const LoadingSpinner = ({ size = "md" }) => {
  const sizes = {
    sm: "w-6 h-6 border-2",
    md: "w-10 h-10 border-4",
    lg: "w-14 h-14 border-4",
  };

  return (
    <div className="flex items-center justify-center py-10">
      <div
        className={`${sizes[size]} border-indigo-600 border-t-transparent rounded-full animate-spin`}
      />
    </div>
  );
};

export default LoadingSpinner;