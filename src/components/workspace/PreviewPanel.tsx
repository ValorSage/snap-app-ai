import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Code2, Eye, Laptop, FileCode } from 'lucide-react';
import CodeEditor from './CodeEditor';

interface PreviewPanelProps {
  viewMode: 'preview' | 'code';
  currentCode?: string;
  currentFilename?: string;
  onCodeChange?: (code: string) => void;
}

const PreviewPanel = ({ viewMode, currentCode, currentFilename, onCodeChange }: PreviewPanelProps) => {
  const [previewKey, setPreviewKey] = useState(0);

  useEffect(() => {
    if (currentCode) {
      setPreviewKey(prev => prev + 1);
    }
  }, [currentCode]);

  return (
    <div className="h-full flex flex-col bg-muted/30">
      {/* Preview Header */}
      <div className="border-b border-border bg-card/50 backdrop-blur-sm px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {viewMode === 'preview' ? (
              <>
                <Eye className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium">المعاينة الحية</span>
              </>
            ) : (
              <>
                <Code2 className="w-4 h-4 text-accent" />
                <span className="text-sm font-medium">محرر الكود</span>
              </>
            )}
          </div>
          {currentFilename && (
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-muted text-xs">
              <FileCode className="w-3 h-3" />
              <span>{currentFilename}</span>
            </div>
          )}
        </div>
      </div>

      {/* Preview Content */}
      <div className="flex-1 overflow-hidden">
        {viewMode === 'preview' ? (
          currentCode ? (
            <iframe
              key={previewKey}
              srcDoc={currentCode}
              className="w-full h-full border-0 bg-white"
              sandbox="allow-scripts"
              title="preview"
            />
          ) : (
            <Card className="h-full bg-white dark:bg-gray-900 shadow-elevated border-2 border-border/50 rounded-xl overflow-hidden m-6">
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
          )
        ) : (
          currentCode && currentFilename ? (
            <CodeEditor
              code={currentCode}
              filename={currentFilename}
              onChange={onCodeChange}
            />
          ) : (
            <Card className="h-full bg-card shadow-elevated border-border/50 rounded-xl overflow-hidden m-6">
              <div className="h-full flex flex-col items-center justify-center p-8 text-center">
                <div className="w-20 h-20 rounded-2xl bg-gradient-primary flex items-center justify-center mb-6 shadow-glow">
                  <Code2 className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-semibold mb-3 bg-gradient-primary bg-clip-text text-transparent">
                  محرر الكود
                </h3>
                <p className="text-muted-foreground max-w-md">
                  هنا يمكنك تعديل الكود مباشرة. ابدأ بطلب إنشاء صفحة لرؤية المحرر!
                </p>
              </div>
            </Card>
          )
        )}
      </div>
    </div>
  );
};

export default PreviewPanel;

