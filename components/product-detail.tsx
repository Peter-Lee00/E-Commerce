"use client";

import Stripe from "stripe";
import Image from "next/image";
import { Button } from "./ui/button";
import { useCartStore } from "@/store/cart-store";

interface Props {
  product: Stripe.Product;
}

export const ProductDetail = ({ product }: Props) => {
  const { items, addItem, removeItem } = useCartStore();
  const price = product.default_price as Stripe.Price;
  const cartItem = items.find((item) => item.id === product.id);
  const quantity = cartItem ? cartItem.quantity : 0;

  const onAddItem = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: price.unit_amount as number,
      imageUrl: product.images ? product.images[0] : null,
      quantity: 1,
    });
  };

  return (
    <div className="container mx-auto px-4 py-8 flex flex-col md:flex-row gap-8 items-center">
      {product.images && product.images[0] && (
        <div className="relative h-96 w-full md:w-1/2 rounded-lg overflow-hidden bg-gray-100 dark:bg-zinc-800">
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            style={{ objectFit: "cover" }}
            className="transition duration-300 hover:opacity-90"
          />
        </div>
      )}
      <div className="md:w-1/2 space-y-4">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          {product.name}
        </h1>
        {product.description && (
          <p className="text-gray-600 dark:text-gray-400">
            {product.description}
          </p>
        )}
        {price && price.unit_amount && (
          <p className="text-2xl font-semibold text-gray-900 dark:text-white">
            ${(price.unit_amount / 100).toFixed(2)}
          </p>
        )}
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            className="border-gray-300 dark:border-zinc-600 dark:text-white dark:hover:bg-zinc-700"
            onClick={() => removeItem(product.id)}
          >
            –
          </Button>
          <span className="text-lg font-semibold text-gray-900 dark:text-white">
            {quantity}
          </span>
          <Button
            className="bg-black dark:bg-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200"
            onClick={onAddItem}
          >
            +
          </Button>
        </div>
      </div>
    </div>
  );
};
