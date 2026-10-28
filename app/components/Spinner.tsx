export function Spinner() {
  return (
    <div className="text-center">
      <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
      <p className="text-gray-600">در حال بارگذاری...</p>
    </div>
  );
}
