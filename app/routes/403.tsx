import { Link } from "react-router";

export default function Forbidden() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-4 p-6">
      <h1 className="text-3xl font-bold">دسترسی غیرمجاز</h1>
      <p>شما اجازه‌ی مشاهده‌ی این صفحه را ندارید.</p>
      <Link to="/" className="text-main">بازگشت به داشبورد</Link>
    </main>
  );
}
