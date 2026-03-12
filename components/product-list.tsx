"use client";

import Stripe from "stripe";
import { ProductCard } from "./product-card";
import { useState, useMemo } from "react";

interface Props {
  products: Stripe.Product[];
}

type SortOption = "default" | "price-asc" | "price-desc" | "name-asc";

export const ProductList = ({ products }: Props) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("default");

  const filteredAndSorted = useMemo(() => {
    // 1. 검색 필터
    const filtered = products.filter((product) => {
      const term = searchTerm.toLowerCase();
      const nameMatch = product.name.toLowerCase().includes(term);
      const descMatch = product.description
        ? product.description.toLowerCase().includes(term)
        : false;
      return nameMatch || descMatch;
    });

    // 2. 정렬
    return [...filtered].sort((a, b) => {
      const priceA = (a.default_price as Stripe.Price)?.unit_amount ?? 0;
      const priceB = (b.default_price as Stripe.Price)?.unit_amount ?? 0;

      switch (sortBy) {
        case "price-asc":
          return priceA - priceB;
        case "price-desc":
          return priceB - priceA;
        case "name-asc":
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });
  }, [products, searchTerm, sortBy]);

  return (
    <div>
      {/* 검색 + 정렬 */}
      <div className="mb-6 flex flex-col sm:flex-row gap-3 items-center justify-between">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search products..."
          className="w-full sm:max-w-sm rounded-xl border border-gray-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-zinc-500 transition"
        />

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <label className="text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">
            Sort by
          </label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className="flex-1 sm:flex-none rounded-xl border border-gray-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 text-gray-900 dark:text-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-zinc-500 transition cursor-pointer"
          >
            <option value="default">Default</option>
            <option value="price-asc">Price: Low → High</option>
            <option value="price-desc">Price: High → Low</option>
            <option value="name-asc">Name: A → Z</option>
          </select>
        </div>
      </div>

      {/* 결과 수 */}
      <p className="text-sm text-gray-400 dark:text-gray-500 mb-4">
        {filteredAndSorted.length}{" "}
        {filteredAndSorted.length === 1 ? "product" : "products"} found
      </p>

      {/* 상품 그리드 */}
      {filteredAndSorted.length > 0 ? (
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredAndSorted.map((product, key) => (
            <li key={key}>
              <ProductCard product={product} />
            </li>
          ))}
        </ul>
      ) : (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <p className="text-4xl mb-4">🔍</p>
          <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">
            No products found
          </p>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
            Try a different search term
          </p>
        </div>
      )}
    </div>
  );
};
