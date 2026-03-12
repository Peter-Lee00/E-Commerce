import { stripe } from "@/lib/stripe";
import Link from "next/link";
import { CheckCircleIcon } from "@heroicons/react/24/solid";
import Stripe from "stripe";

interface Props {
  searchParams: Promise<{ session_id?: string }>;
}

export default async function SuccessPage({ searchParams }: Props) {
  const { session_id } = await searchParams;

  let session: Stripe.Checkout.Session | null = null;
  let lineItems: Stripe.LineItem[] = [];

  if (session_id) {
    try {
      session = await stripe.checkout.sessions.retrieve(session_id, {
        expand: ["line_items.data.price.product"],
      });
      lineItems = session.line_items?.data ?? [];
    } catch {
      // session_id가 잘못된 경우 무시
    }
  }

  const customerEmail =
    session?.customer_details?.email ?? session?.customer_email ?? null;

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="w-full max-w-lg">
        {/* 체크 아이콘 + 제목 */}
        <div className="flex flex-col items-center text-center mb-10">
          <div className="relative mb-6">
            <div className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center animate-[ping_1s_ease-in-out_1] absolute inset-0" />
            <div className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center relative">
              <CheckCircleIcon className="w-10 h-10 text-green-500" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Order Confirmed!
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            {customerEmail
              ? `A confirmation has been sent to ${customerEmail}`
              : "Thank you for your purchase!"}
          </p>
        </div>

        {/* 주문 요약 */}
        {lineItems.length > 0 && (
          <div className="bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 rounded-2xl overflow-hidden mb-6">
            <div className="px-5 py-4 border-b border-gray-200 dark:border-zinc-700">
              <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
                Order Summary
              </h2>
            </div>
            <ul className="divide-y divide-gray-100 dark:divide-zinc-800">
              {lineItems.map((item, i) => {
                const product = item.price?.product as Stripe.Product | undefined;
                return (
                  <li
                    key={i}
                    className="flex items-center justify-between px-5 py-4"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-black dark:bg-white flex items-center justify-center text-white dark:text-black text-xs font-bold flex-shrink-0">
                        {item.quantity}
                      </div>
                      <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
                        {product?.name ?? item.description ?? "Product"}
                      </span>
                    </div>
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">
                      ${((item.amount_total ?? 0) / 100).toFixed(2)}
                    </span>
                  </li>
                );
              })}
            </ul>
            {session?.amount_total && (
              <div className="flex justify-between items-center px-5 py-4 border-t border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800">
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Total
                </span>
                <span className="text-lg font-bold text-gray-900 dark:text-white">
                  ${(session.amount_total / 100).toFixed(2)}{" "}
                  <span className="text-xs font-normal text-gray-400 uppercase">
                    {session.currency}
                  </span>
                </span>
              </div>
            )}
          </div>
        )}

        {/* 버튼 */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            href="/products"
            className="flex-1 text-center py-3 px-6 rounded-xl bg-black dark:bg-white text-white dark:text-black font-semibold text-sm hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
          >
            Continue Shopping
          </Link>
          <Link
            href="/"
            className="flex-1 text-center py-3 px-6 rounded-xl border border-gray-200 dark:border-zinc-700 text-gray-700 dark:text-gray-300 font-semibold text-sm hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
