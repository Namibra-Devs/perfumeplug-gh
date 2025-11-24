export const ProductSkeleton = ({ viewMode = "grid" }) => {
  if (viewMode === "list") {
    return (
      <div className="w-full bg-black/20 border border-yellow-600/20 rounded-lg p-4 animate-pulse flex gap-4">
        <div className="w-32 h-28 bg-yellow-900/20 rounded-md"></div>
        <div className="flex-1 space-y-3">
          <div className="h-4 w-40 bg-yellow-900/20 rounded"></div>
          <div className="h-3 w-60 bg-yellow-900/20 rounded"></div>
          <div className="h-3 w-24 bg-yellow-900/20 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-black/20 border border-yellow-600/20 rounded-lg p-4 animate-pulse">
      <div className="w-full h-40 bg-yellow-900/20 rounded-md mb-4"></div>
      <div className="h-4 w-3/4 bg-yellow-900/20 rounded mb-2"></div>
      <div className="h-3 w-1/2 bg-yellow-900/20 rounded"></div>
    </div>
  );
};