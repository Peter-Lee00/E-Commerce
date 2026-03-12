import Link from "next/link";
import Stripe from "stripe";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import Image from "next/image";
import { Button } from "./ui/button";

interface Props {
  product: Stripe.Product;
}

export const ProductCard = ({ product }: Props) => {
  const price = product.default_price as Stripe.Price;

  return (
    <Link href={`/products/${product.id}`} className="block h-full">
      <Card className="group hover:shadow-2xl transition duration-300 py-0 h-full flex flex-col gap-0 border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-900">
        {product.images && product.images[0] && (
          <div className="relative h-60 w-full">
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              style={{ objectFit: "cover" }}
              className="group-hover:opacity-90 transition-opacity duration-300 rounded-t-lg"
            />
          </div>
        )}
        <CardHeader className="p-4">
          <CardTitle className="text-xl font-bold text-gray-800 dark:text-white">
            {product.name}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 flex-grow flex flex-col justify-between">
          {product.description && (
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">
              {product.description}
            </p>
          )}
          {price && price.unit_amount && (
            <p className="text-lg font-semibold text-gray-900 dark:text-white">
              ${(price.unit_amount / 100).toFixed(2)}
            </p>
          )}
          <Button className="mt-4 bg-black dark:bg-white dark:text-black text-white hover:bg-gray-800 dark:hover:bg-gray-200">
            View Details
          </Button>
        </CardContent>
      </Card>
    </Link>
  );
};
