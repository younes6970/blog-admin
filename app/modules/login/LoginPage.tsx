import { useNavigate } from "react-router";
import { toast } from "sonner";
import { z } from "zod";
import { ButtonForm, Form, InputForm } from "~/components/form";
import { Card } from "~/components/ui/card";
import usePost from "~/lib/hooks/query/usePost";
import { serviceLogin, type ServiceLoginParams } from "~/lib/services/authentication";
import { useAuthStore } from "~/lib/useAuthStore";
import type { Response, TokenResponse } from "~/types";

const loginSchema = z.object({
  username: z.string().min(1, "نام کاربری الزامی است"),
  password: z.string().min(1, "رمز عبور الزامی است"),
});

export function LoginPage() {
  const navigate = useNavigate();
  const authLogin = useAuthStore((state) => state.login);
  const { mutate: login, isPending } = usePost<ServiceLoginParams, Response<TokenResponse>>(
    serviceLogin,
    { onSuccess: (data) => {
      try {
        authLogin(data.result.token);
        toast.success("با موفقیت وارد شدید");
        navigate("/", { replace: true });
      } catch {
        toast.error("پاسخ ورود معتبر نیست");
      }
    } },
  );
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md p-8">
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-2xl font-bold">ورود به پنل مدیریت</h1>
          <p className="text-sm text-gray-600">نام کاربری و رمز عبور خود را وارد کنید.</p>
        </div>
        <Form schema={loginSchema} onSubmit={(data) => login(data)}
          defaultValues={{ username: "", password: "" }} className="flex flex-col gap-4">
          <InputForm name="username" label="نام کاربری" autoComplete="username" classNameInput="text-left" />
          <InputForm name="password" label="رمز عبور" type="password" autoComplete="current-password" classNameInput="text-left" />
          <ButtonForm className="w-full" isLoading={isPending}>ورود</ButtonForm>
        </Form>
      </Card>
    </div>
  );
}
