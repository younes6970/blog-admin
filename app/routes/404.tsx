import { Link } from "react-router";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-lighter-dasht flex flex-col items-center justify-center p-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">
          صفحه پیدا نشد
        </h2>
        <p className="text-gray-600 mb-8">
          صفحه‌ای که دنبال آن می‌گردید وجود ندارد.
        </p>
        <Link
          to="/"
          className="inline-flex items-center px-6 py-3 bg-main text-white rounded-lg hover:bg-main/90 transition-colors"
        >
          بازگشت به خانه
        </Link>
      </div>
    </div>
  );
}
