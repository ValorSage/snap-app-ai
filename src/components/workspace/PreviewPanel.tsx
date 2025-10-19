import { Card } from '@/components/ui/card';
import { Code2, Eye, Laptop } from 'lucide-react';

interface PreviewPanelProps {
  viewMode: 'preview' | 'code';
}

const PreviewPanel = ({ viewMode }: PreviewPanelProps) => {
  return (
    <div className="h-full flex flex-col bg-muted/30">
      {/* Preview Header */}
      <div className="border-b border-border bg-card/50 backdrop-blur-sm px-6 py-3">
        <div className="flex items-center gap-2">
          {viewMode === 'preview' ? (
            <>
              <Eye className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">المعاينة الحية</span>
            </>
          ) : (
            <>
              <Code2 className="w-4 h-4 text-accent" />
              <span className="text-sm font-medium">مستكشف الملفات</span>
            </>
          )}
        </div>
      </div>

      {/* Preview Content */}
      <div className="flex-1 p-6 overflow-auto">
        {viewMode === 'preview' ? (
          <Card className="h-full bg-white dark:bg-gray-900 shadow-elevated border-2 border-border/50 rounded-xl overflow-hidden">
            <div className="h-full flex flex-col items-center justify-center p-8 text-center">
              <div className="w-20 h-20 rounded-2xl bg-gradient-primary flex items-center justify-center mb-6 shadow-glow">
                <Laptop className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-semibold mb-3 bg-gradient-primary bg-clip-text text-transparent">
                المعاينة الحية
              </h3>
              <p className="text-muted-foreground max-w-md">
                سيظهر تطبيقك هنا بمجرد أن تبدأ في وصف فكرتك. كل تغيير سيُعرض مباشرة أمامك.
              </p>
              <div className="mt-8 grid grid-cols-3 gap-4 w-full max-w-sm">
                <div className="h-2 bg-gradient-primary rounded-full animate-pulse" />
                <div className="h-2 bg-gradient-primary rounded-full animate-pulse delay-150" />
                <div className="h-2 bg-gradient-primary rounded-full animate-pulse delay-300" />
              </div>
            </div>
          </Card>
        ) : (
          <Card className="h-full bg-card shadow-elevated border-border/50 rounded-xl overflow-hidden">
            <div className="h-full flex flex-col items-center justify-center p-8 text-center">
              <div className="w-20 h-20 rounded-2xl bg-gradient-primary flex items-center justify-center mb-6 shadow-glow">
                <Code2 className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-semibold mb-3 bg-gradient-primary bg-clip-text text-transparent">
                مستكشف الملفات
              </h3>
              <p className="text-muted-foreground max-w-md">
                هنا ستجد جميع ملفات مشروعك منظمة في شجرة الملفات. يمكنك تصفح الكود ورؤية التغييرات.
              </p>
              <div className="mt-8 space-y-2 w-full max-w-xs text-right">
                <div className="flex items-center gap-2 p-2 rounded bg-muted/50">
                  <div className="w-4 h-4 rounded bg-primary/20" />
                  <span className="text-sm text-muted-foreground">src/</span>
                </div>
                <div className="flex items-center gap-2 p-2 rounded bg-muted/30 mr-4">
                  <div className="w-4 h-4 rounded bg-accent/20" />
                  <span className="text-sm text-muted-foreground">components/</span>
                </div>
                <div className="flex items-center gap-2 p-2 rounded bg-muted/30 mr-4">
                  <div className="w-4 h-4 rounded bg-secondary/20" />
                  <span className="text-sm text-muted-foreground">App.tsx</span>
                </div>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default PreviewPanel;
