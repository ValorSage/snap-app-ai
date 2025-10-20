import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const SYSTEM_PROMPT = `أنت مساعد ذكي متخصص في إنشاء تطبيقات ويب بسيطة. تستقبل أوامر من المستخدم باللغة العربية أو الإنجليزية وتحولها إلى كود HTML/CSS/JavaScript.

قواعد مهمة:
1. عندما يطلب المستخدم إنشاء صفحة أو تطبيق جديد، أنشئ ملف HTML كامل ومستقل
2. ضمّن CSS داخل <style> و JavaScript داخل <script> في نفس الملف
3. استخدم Tailwind CSS عبر CDN للتنسيقات
4. اجعل التصميم جميلاً وعصرياً ومتجاوباً
5. عند طلب تعديل (مثل "غير اللون")، قدم الملف كاملاً بعد التعديل
6. استخدم ألوان وتدرجات جذابة
7. أضف تأثيرات حركية بسيطة لتحسين تجربة المستخدم

صيغة الرد يجب أن تكون JSON بهذا الشكل:
{
  "message": "رسالة توضيحية للمستخدم",
  "code": "الكود الكامل للملف",
  "filename": "اسم الملف مثل index.html"
}

مثال على طلب: "أنشئ صفحة ترحيب بسيطة"
مثال على التعديل: "غير لون الخلفية إلى أزرق"`;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, conversationHistory, projectState } = await req.json();
    
    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    const GOOGLE_GEMINI_API_KEY = Deno.env.get('GOOGLE_GEMINI_API_KEY');
    if (!GOOGLE_GEMINI_API_KEY) {
      throw new Error('GOOGLE_GEMINI_API_KEY is not configured');
    }

    console.log('Received message:', message);

    // Load or create project state
    let currentProjectState = projectState;
    if (!currentProjectState) {
      const { data: existingState } = await supabase
        .from('project_states')
        .select('*')
        .eq('project_id', 'default')
        .single();
      
      currentProjectState = existingState || {
        file_structure: [],
        technologies: ['HTML', 'CSS', 'JavaScript', 'Tailwind CSS'],
        installed_libraries: [],
        metadata: {}
      };
    }

    // Build enhanced system prompt with project context
    const enhancedSystemPrompt = `${SYSTEM_PROMPT}

السياق الحالي للمشروع:
- التقنيات المستخدمة: ${currentProjectState.technologies?.join(', ') || 'HTML, CSS, JavaScript, Tailwind CSS'}
- المكتبات المثبتة: ${currentProjectState.installed_libraries?.join(', ') || 'لا توجد'}
- عدد الملفات: ${currentProjectState.file_structure?.length || 0}
${currentProjectState.file_structure?.length > 0 ? `- الملفات الموجودة: ${currentProjectState.file_structure.map((f: any) => f.name).join(', ')}` : ''}

استخدم هذا السياق لفهم حالة المشروع الحالية وتقديم إجابات أكثر دقة.`;

    // Build conversation messages
    const messages = [
      { role: "user", parts: [{ text: enhancedSystemPrompt }] }
    ];

    // Add conversation history
    if (conversationHistory && conversationHistory.length > 0) {
      conversationHistory.forEach((msg: any) => {
        if (msg.role === 'user') {
          messages.push({ role: "user", parts: [{ text: msg.content }] });
        } else if (msg.role === 'assistant') {
          messages.push({ role: "model", parts: [{ text: msg.content }] });
        }
      });
    }

    // Add current message
    messages.push({ role: "user", parts: [{ text: message }] });

    console.log('Calling Gemini API with', messages.length, 'messages');

    const response = await fetch(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': GOOGLE_GEMINI_API_KEY,
        },
        body: JSON.stringify({
          contents: messages,
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 8192,
          },
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini API error:', response.status, errorText);
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    console.log('Gemini response received');

    if (!data.candidates || data.candidates.length === 0) {
      throw new Error('No response from Gemini');
    }

    const aiResponse = data.candidates[0].content.parts[0].text;

    // Try to extract JSON from response
    let parsedResponse;
    try {
      // Try to find JSON in the response
      const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        parsedResponse = JSON.parse(jsonMatch[0]);
      } else {
        // If no JSON found, create a simple response
        parsedResponse = {
          message: aiResponse,
          code: null,
          filename: null
        };
      }
    } catch (e) {
      console.error('Error parsing JSON from AI response:', e);
      parsedResponse = {
        message: aiResponse,
        code: null,
        filename: null
      };
    }

    return new Response(
      JSON.stringify(parsedResponse),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (error) {
    console.error('Error in gemini-chat function:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Unknown error',
        message: 'عذراً، حدث خطأ أثناء معالجة طلبك. يرجى المحاولة مرة أخرى.'
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
});
