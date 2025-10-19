import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { useApiKey } from '@/contexts/ApiKeyContext';
import { Sparkles, Code2, Zap } from 'lucide-react';
import { toast } from 'sonner';

const Landing = () => {
  const [key, setKey] = useState('');
  const { setApiKey } = useApiKey();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!key.trim()) {
      toast.error('يرجى إدخال مفتاح API');
      return;
    }
    setApiKey(key);
    toast.success('تم حفظ مفتاح API بنجاح');
    navigate('/workspace');
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute inset-0 bg-gradient-glow opacity-50" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-3xl" />

      <div className="relative z-10 container mx-auto px-4 py-16 flex flex-col items-center justify-center min-h-screen">
        {/* Header */}
        <div className="text-center mb-12 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-card/50 backdrop-blur-sm border border-primary/20 shadow-glow mb-6">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm text-muted-foreground">منصة بناء التطبيقات بالذكاء الاصطناعي</span>
          </div>
          
          <h1 className="text-6xl font-bold bg-gradient-primary bg-clip-text text-transparent animate-in fade-in slide-in-from-bottom-4 duration-700">
            اصنع تطبيقك بالمحادثة
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-6 duration-700 delay-150">
            حوّل أفكارك إلى تطبيقات حقيقية باستخدام قوة الذكاء الاصطناعي. ما عليك سوى الوصف، ونحن نبني لك.
          </p>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-6 mb-12 w-full max-w-4xl animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
          <Card className="p-6 bg-card/50 backdrop-blur-sm border-primary/20 hover:shadow-glow transition-all duration-300 hover:-translate-y-1">
            <Code2 className="w-10 h-10 text-primary mb-4" />
            <h3 className="text-lg font-semibold mb-2">كود تلقائي</h3>
            <p className="text-sm text-muted-foreground">يكتب الذكاء الاصطناعي الكود بناءً على وصفك</p>
          </Card>
          
          <Card className="p-6 bg-card/50 backdrop-blur-sm border-accent/20 hover:shadow-glow transition-all duration-300 hover:-translate-y-1">
            <Sparkles className="w-10 h-10 text-accent mb-4" />
            <h3 className="text-lg font-semibold mb-2">معاينة حية</h3>
            <p className="text-sm text-muted-foreground">شاهد تطبيقك يتطور أمام عينيك</p>
          </Card>
          
          <Card className="p-6 bg-card/50 backdrop-blur-sm border-secondary/20 hover:shadow-glow transition-all duration-300 hover:-translate-y-1">
            <Zap className="w-10 h-10 text-secondary mb-4" />
            <h3 className="text-lg font-semibold mb-2">سريع وذكي</h3>
            <p className="text-sm text-muted-foreground">من الفكرة للتطبيق في دقائق</p>
          </Card>
        </div>

        {/* API Key Input */}
        <Card className="w-full max-w-md p-8 bg-card/80 backdrop-blur-md border-primary/30 shadow-elevated animate-in fade-in zoom-in-95 duration-700 delay-500">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-semibold">ابدأ الآن</h2>
              <p className="text-sm text-muted-foreground">
                أدخل مفتاح Google Gemini API الخاص بك للبدء
              </p>
            </div>

            <div className="space-y-2">
              <Input
                type="password"
                placeholder="أدخل مفتاح API هنا..."
                value={key}
                onChange={(e) => setKey(e.target.value)}
                className="bg-input border-border focus:border-primary focus:ring-primary text-right"
                dir="ltr"
              />
              <p className="text-xs text-muted-foreground text-right">
                يمكنك الحصول على مفتاح API من{' '}
                <a 
                  href="https://ai.google.dev/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  Google AI Studio
                </a>
              </p>
            </div>

            <Button 
              type="submit" 
              className="w-full bg-gradient-primary hover:shadow-glow transition-all duration-300 text-lg py-6"
            >
              <Sparkles className="w-5 h-5 ml-2" />
              دخول للمنصة
            </Button>
          </form>
        </Card>

        {/* Footer note */}
        <p className="mt-8 text-sm text-muted-foreground animate-in fade-in duration-700 delay-700">
          مفتاح API الخاص بك محفوظ بأمان في جلستك الحالية فقط
        </p>
      </div>
    </div>
  );
};

export default Landing;
