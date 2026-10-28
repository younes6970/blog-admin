import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";

export default function DashboardPage() {
  return (
    <Card>
      <CardHeader><CardTitle>داشبورد مدیریت</CardTitle></CardHeader>
      <CardContent>
        <p className="text-sm leading-7 text-gray-600">به پنل مدیریت خوش آمدید. بخش‌های پروژه‌ی جدید در این قسمت اضافه خواهند شد.</p>
      </CardContent>
    </Card>
  );
}
