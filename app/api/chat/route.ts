import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import Stripe from "stripe";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

async function getProducts() {
  const { data: products } = await stripe.products.list({
    expand: ["data.default_price"],
    active: true,
    limit: 100,
  });
  return products;
}

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();
    const products = await getProducts();

    const productCatalog = products
      .map((product) => {
        const price = product.default_price as Stripe.Price;
        const amount = price?.unit_amount
          ? `$${(price.unit_amount / 100).toFixed(2)} SGD`
          : "Price TBD";
        return `id:${product.id} | name:${product.name} | price:${amount} | desc:${product.description ?? "No description"}`;
      })
      .join("\n");

    const SYSTEM_PROMPT = `You are a friendly AI shopping assistant for an online store.
Help customers find the right products.

[Product Catalog]
${productCatalog}

IMPORTANT - Response format rules:
- Always reply in the same language the customer uses
- Keep responses concise (2-4 sentences max)
- When recommending products, you MUST include their product IDs using this exact format at the end of your message:

PRODUCTS:[{"id":"prod_xxx","name":"Product Name","price":"$X.XX SGD"}]

- Include only actually recommended products in the PRODUCTS array
- If no specific products are recommended, omit the PRODUCTS line entirely
- Never show the raw PRODUCTS line to users as text — it will be parsed by the UI`;

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      systemInstruction: SYSTEM_PROMPT,
    });

    const history = messages
      .slice(0, -1)
      .filter((_: unknown, i: number) => !(i === 0 && messages[0].role === "assistant"))
      .map((m: { role: string; content: string }) => ({
        role: m.role === "assistant" ? "model" : "user",
        parts: [{ text: m.content }],
      }));

    const lastMessage = messages[messages.length - 1].content;
    const chat = model.startChat({ history });
    const result = await chat.sendMessage(lastMessage);
    const raw = result.response.text();

    // PRODUCTS:[...] 파싱
const productMatch = raw.match(/PRODUCTS:(\[[\s\S]*?\])/);
    const recommendedProducts = productMatch
      ? JSON.parse(productMatch[1])
      : [];

    // 메시지에서 PRODUCTS 라인 제거
const message = raw.replace(/PRODUCTS:\[[\s\S]*?\]/, "").trim();

    return NextResponse.json({ message, recommendedProducts });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { error: "Sorry, something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
