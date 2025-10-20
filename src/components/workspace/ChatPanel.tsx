import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  code?: string;
  filename?: string;
}

interface ProjectState {
  file_structure: { name: string; content: string }[];
  technologies: string[];
  installed_libraries: string[];
  metadata: Record<string, any>;
}

interface ChatPanelProps {
  onCodeGenerated?: (code: string, filename: string) => void;
}

const ChatPanel = ({ onCodeGenerated }: ChatPanelProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'مرحباً! أنا هنا لمساعدتك في بناء تطبيقك. صف لي فكرتك وسأنشئ لك الكود.\n\nأمثلة:\n• أنشئ صفحة ترحيب بسيطة\n• اصنع صفحة تسجيل دخول\n• غير لون الخلفية إلى أزرق',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [projectState, setProjectState] = useState<ProjectState>({
    file_structure: [],
    technologies: ['HTML', 'CSS', 'JavaScript', 'Tailwind CSS'],
    installed_libraries: [],
    metadata: {}
  });

  // Load project state on mount
  useEffect(() => {
    loadProjectState();
  }, []);

  const loadProjectState = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('project_states')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (data && !error) {
        setProjectState({
          file_structure: (data.file_structure as { name: string; content: string }[]) || [],
          technologies: (data.technologies as string[]) || ['HTML', 'CSS', 'JavaScript', 'Tailwind CSS'],
          installed_libraries: (data.installed_libraries as string[]) || [],
          metadata: (data.metadata as Record<string, any>) || {}
        });
      }
    } catch (error) {
      console.error('Error loading project state:', error);
    }
  };

  const updateProjectState = async (newFile?: { name: string; content: string }) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const updatedState = { ...projectState };
      
      if (newFile) {
        // Update or add file to structure
        const fileIndex = updatedState.file_structure.findIndex(f => f.name === newFile.name);
        if (fileIndex >= 0) {
          updatedState.file_structure[fileIndex] = newFile;
        } else {
          updatedState.file_structure.push(newFile);
        }
      }

      const { error } = await supabase
        .from('project_states')
        .upsert({
          user_id: user.id,
          project_id: user.id,
          ...updatedState
        });

      if (!error) {
        setProjectState(updatedState);
      }
    } catch (error) {
      console.error('Error updating project state:', error);
    }
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    const currentInput = input;
    setInput('');
    setIsLoading(true);

    try {
      // Prepare conversation history (last 10 messages for context)
      const conversationHistory = messages.slice(-10).map(msg => ({
        role: msg.role,
        content: msg.content
      }));

      const { data, error } = await supabase.functions.invoke('gemini-chat', {
        body: {
          message: currentInput,
          conversationHistory,
          projectState
        }
      });

      if (error) throw error;

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.message || 'تم إنشاء الكود!',
        timestamp: new Date(),
        code: data.code,
        filename: data.filename
      };

      setMessages((prev) => [...prev, aiMessage]);

      // If code was generated, notify parent and update project state
      if (data.code && data.filename && onCodeGenerated) {
        onCodeGenerated(data.code, data.filename);
        await updateProjectState({ name: data.filename, content: data.code });
      }

      if (data.code) {
        toast.success('تم إنشاء الكود بنجاح!');
      }

    } catch (error) {
      console.error('Error calling AI:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'عذراً، حدث خطأ. يرجى المحاولة مرة أخرى.',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
      toast.error('حدث خطأ في الاتصال بالذكاء الاصطناعي');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="h-full flex flex-col bg-gradient-subtle">
      {/* Messages */}
      <ScrollArea className="flex-1 p-6">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === 'user' ? 'justify-start' : 'justify-end'}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                  message.role === 'user'
                    ? 'bg-card border border-border text-right'
                    : 'bg-gradient-primary text-white shadow-glow text-right'
                }`}
              >
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                <span className="text-xs opacity-70 mt-1 block">
                  {message.timestamp.toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-end">
              <div className="bg-gradient-primary text-white rounded-2xl px-4 py-3 shadow-glow">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                  <span className="text-sm">جاري التفكير...</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="border-t border-border bg-card/50 backdrop-blur-sm p-4">
        <div className="flex gap-3 items-end">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="صف فكرة تطبيقك هنا... (مثال: أريد تطبيق لإدارة المهام)"
            className="min-h-[60px] max-h-[200px] resize-none bg-input border-border focus:border-primary text-right"
            dir="rtl"
          />
          <Button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="bg-gradient-primary hover:shadow-glow transition-all duration-300 h-[60px] px-6"
          >
            <Send className="w-5 h-5" />
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mt-2 text-right">
          اضغط Enter للإرسال، Shift+Enter لسطر جديد
        </p>
      </div>
    </div>
  );
};

export default ChatPanel;
