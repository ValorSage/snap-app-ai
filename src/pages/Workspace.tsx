import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import ChatPanel from '@/components/workspace/ChatPanel';
import PreviewPanel from '@/components/workspace/PreviewPanel';
import { LogOut, Code2, Eye } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import type { User } from '@supabase/supabase-js';

const Workspace = () => {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<'preview' | 'code'>('preview');
  const [currentCode, setCurrentCode] = useState<string>('');
  const [currentFilename, setCurrentFilename] = useState<string>('');
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session?.user) {
        navigate('/auth');
      } else {
        setUser(session.user);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session?.user) {
        navigate('/auth');
      } else {
        setUser(session.user);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  if (!user) {
    return null;
  }

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success('تم تسجيل الخروج بنجاح');
    navigate('/');
  };

  const handleCodeGenerated = (code: string, filename: string) => {
    setCurrentCode(code);
    setCurrentFilename(filename);
  };

  const handleCodeChange = (newCode: string) => {
    setCurrentCode(newCode);
  };

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="flex items-center justify-between px-6 py-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center">
              <Code2 className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-lg font-semibold">مساحة العمل</h1>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 p-1 rounded-lg bg-muted">
              <Button
                size="sm"
                variant={viewMode === 'preview' ? 'default' : 'ghost'}
                onClick={() => setViewMode('preview')}
                className={viewMode === 'preview' ? 'bg-gradient-primary' : ''}
              >
                <Eye className="w-4 h-4 ml-1" />
                معاينة
              </Button>
              <Button
                size="sm"
                variant={viewMode === 'code' ? 'default' : 'ghost'}
                onClick={() => setViewMode('code')}
                className={viewMode === 'code' ? 'bg-gradient-primary' : ''}
              >
                <Code2 className="w-4 h-4 ml-1" />
                كود
              </Button>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="border-destructive/20 hover:bg-destructive/10 hover:border-destructive"
            >
              <LogOut className="w-4 h-4 ml-1" />
              خروج
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Chat Panel - Left */}
        <div className="w-full md:w-1/2 border-l border-border">
          <ChatPanel onCodeGenerated={handleCodeGenerated} />
        </div>

        {/* Preview Panel - Right */}
        <div className="hidden md:block w-1/2">
          <PreviewPanel 
            viewMode={viewMode}
            currentCode={currentCode}
            currentFilename={currentFilename}
            onCodeChange={handleCodeChange}
          />
        </div>
      </div>
    </div>
  );
};

export default Workspace;
