import { motion } from "framer-motion";
import ProductCard from "./ProductCard";
import { useProducts } from "../../hooks/useProducts";

const ProductGrid = () => {
  const { products, loading, error, refetch} = useProducts();
  const featuredProducts = products.slice(0, 8);
  console.log("Featured Products:", featuredProducts);

  // Loading: show skeleton cards in the same grid layout 
  if (loading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
        {Array.from({ length: 8 }).map((_, index) => (
          <div
            key={index}
            className="animate-pulse bg-black/20 backdrop-blur-lg border border-yellow-600/20 rounded-lg shadow-sm p-4 space-y-4"
          >
            <div className="w-full h-36 bg-black/30 rounded-md" />
            <div className="h-4 bg-black/30 backdrop-blur-lg rounded w-3/4" />
            <div className="h-4 bg-black/30 backdrop-blur-lg rounded w-1/2" />
            <div className="h-8 bg-black/30 backdrop-blur-lg rounded w-full" />
          </div>
        ))}
      </div>
    );
  }

  // ─── Error state ───────────────────────────────────────────────────────
  if (error) {
    return (
      <div className="text-center py-10 col-span-full">
        <p className="text-red-500">Error loading products: {String(error)}</p>
        <button
          onClick={() => refetch()}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Retry
        </button>
      </div>
    );
  }

  // ─── Empty state ───────────────────────────────────────────────────────
  if (!products || products.length === 0) {
    return (
      <div className="text-center py-10 col-span-full">
        <p className="text-gray-500">No products found.</p>
      </div>
    );
  }

  // ─── Normal state: render product cards ─────────────────────────────────
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
      {featuredProducts.map((product, index) => (
        <motion.div
          key={product._id}
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: index * 0.08 }}
          viewport={{ once: true }}
          whileHover={{ y: -5 }}
        >
          <ProductCard product={product} />
        </motion.div>
      ))}
    </div>
  );
};

export default ProductGrid;
