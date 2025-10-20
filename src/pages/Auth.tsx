import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { z } from "zod";

const authSchema = z.object({
  email: z.string().email("البريد الإلكتروني غير صالح"),
  password: z.string().min(6, "كلمة المرور يجب أن تكون 6 أحرف على الأقل"),
});

export default function Auth() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const validation = authSchema.safeParse({ email, password });
      if (!validation.success) {
        toast.error(validation.error.errors[0].message);
        setLoading(false);
        return;
      }

      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          if (error.message.includes("Invalid login credentials")) {
            toast.error("البريد الإلكتروني أو كلمة المرور غير صحيحة");
          } else {
            toast.error(error.message);
          }
          return;
        }

        toast.success("تم تسجيل الدخول بنجاح");
        navigate("/workspace");
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/workspace`,
          },
        });

        if (error) {
          if (error.message.includes("already registered")) {
            toast.error("هذا البريد الإلكتروني مسجل بالفعل");
          } else {
            toast.error(error.message);
          }
          return;
        }

        toast.success("تم إنشاء الحساب بنجاح! يمكنك الآن تسجيل الدخول");
        setIsLogin(true);
      }
    } catch (error) {
      toast.error("حدث خطأ أثناء المصادقة");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-right">
          <CardTitle className="text-2xl font-bold">
            {isLogin ? "تسجيل الدخول" : "إنشاء حساب جديد"}
          </CardTitle>
          <CardDescription>
            {isLogin
              ? "أدخل بريدك الإلكتروني وكلمة المرور للدخول"
              : "أدخل بريدك الإلكتروني وكلمة المرور لإنشاء حساب"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAuth} className="space-y-4">
            <div className="space-y-2">
              <Input
                type="email"
                placeholder="البريد الإلكتروني"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                dir="rtl"
              />
            </div>
            <div className="space-y-2">
              <Input
                type="password"
                placeholder="كلمة المرور"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                dir="rtl"
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading
                ? "جاري المعالجة..."
                : isLogin
                ? "تسجيل الدخول"
                : "إنشاء حساب"}
            </Button>
            <Button
              type="button"
              variant="ghost"
              className="w-full"
              onClick={() => setIsLogin(!isLogin)}
            >
              {isLogin ? "ليس لديك حساب؟ سجل الآن" : "لديك حساب؟ سجل دخولك"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}