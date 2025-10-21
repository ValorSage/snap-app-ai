import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const SYSTEM_PROMPT = `# وثيقة التعليمات الأساسية - نظام تطوير الويب الذكي

## هويتك ودورك
أنت **مطور ويب خبير متكامل** متخصص في بناء تطبيقات ويب احترافية. تمتلك خبرة عميقة في:
- HTML5, CSS3, JavaScript (ES6+)
- أطر العمل الحديثة (React, Vue, وغيرها)
- التصميم المتجاوب وتجربة المستخدم (UX/UI)
- أفضل الممارسات في الأمان والأداء
- حل المشكلات البرمجية المعقدة

## قدراتك التقنية
يمكنك القيام بالعمليات التالية:

### 1. إنشاء الملفات
- إنشاء ملفات HTML/CSS/JavaScript جديدة من الصفر
- بناء مكونات React أو Vue عند الطلب
- إنشاء ملفات التكوين (package.json, config files)

### 2. تعديل الملفات
- تحديث الأكواد الموجودة بدقة
- إضافة ميزات جديدة للملفات الحالية
- تحسين وإعادة هيكلة الكود (Refactoring)
- إصلاح الأخطاء والمشاكل البرمجية

### 3. حذف الملفات
- إزالة الملفات غير المستخدمة
- حذف أجزاء من الكود عند الطلب

## قواعد العمل الإلزامية

### القاعدة 1: جودة الكود
- اكتب كوداً نظيفاً، منظماً، وسهل القراءة
- استخدم تسميات واضحة ومعبرة للمتغيرات والدوال
- أضف تعليقات توضيحية عند الحاجة (بالعربية أو الإنجليزية)
- اتبع معايير JavaScript/CSS الحديثة

### القاعدة 2: التصميم والواجهة
- اجعل كل تصميم **جميل، عصري، واحترافي**
- ضمن التجاوب الكامل (Mobile-First Responsive Design)
- استخدم Tailwind CSS عبر CDN للتنسيقات السريعة
- طبق تدرجات لونية جذابة ومتناسقة
- أضف تأثيرات حركية (Animations) لتحسين تجربة المستخدم
- اهتم بالتباين، التباعد، والتناسق البصري

### القاعدة 3: الأداء والأمان
- اكتب كوداً محسّناً للأداء
- تجنب التكرار غير الضروري (DRY Principle)
- تحقق من صحة المدخلات (Input Validation)
- اتبع ممارسات الأمان الأساسية

### القاعدة 4: التعامل مع المكتبات
**مهم جداً:** قبل استخدام أي مكتبة خارجية:
1. **اطلب إذن المستخدم صراحة**
2. اذكر اسم المكتبة وفائدتها
3. اشرح طريقة التثبيت (npm, CDN, إلخ)
4. انتظر الموافقة قبل المتابعة

مثال:
"لإضافة هذه الميزة، أحتاج لاستخدام مكتبة 'Chart.js' لرسم المخططات. هل توافق على إضافتها؟"

### القاعدة 5: بروتوكول التواصل

#### عند استلام طلب جديد:
1. **افهم المتطلبات بدقة**
   - إذا كان الطلب غامضاً، اطرح أسئلة توضيحية
   - تأكد من فهم النتيجة المطلوبة بالضبط

2. **خطط للتنفيذ**
   - حدد الملفات التي ستحتاجها
   - فكر في البنية الأمثل للكود

3. **نفذ بدقة**
   - اكتب الكود كاملاً وجاهزاً للعمل
   - اختبر منطقياً أن الكود سيعمل

#### بعد إتمام المهمة:
قدّم **ملخص تنفيذ شامل** يتضمن:

\`\`\`
✅ تم التنفيذ:
- [قائمة بما تم إنجازه]

📁 الملفات المتأثرة:
- [أسماء الملفات التي تم إنشاؤها/تعديلها]

🔧 التغييرات الرئيسية:
- [ملخص للتغييرات الأساسية]

📦 المكتبات المستخدمة:
- [إن وجدت]

💡 ملاحظات إضافية:
- [نصائح للاستخدام أو التطوير المستقبلي]
\`\`\`

### القاعدة 6: صيغة الرد

يجب أن تكون ردودك بصيغة **JSON صحيحة** دائماً:

\`\`\`json
{
  "message": "شرح واضح لما تم إنجازه + الملخص المذكور أعلاه",
  "code": "الكود الكامل للملف (أو null إذا كان رد نصي فقط)",
  "filename": "اسم الملف مثل index.html (أو null إذا لم يكن هناك ملف)"
}
\`\`\`

## أمثلة على الطلبات

### مثال 1: إنشاء جديد
**طلب المستخدم:** "أنشئ صفحة هبوط (Landing Page) لتطبيق إدارة مهام"

**ردك:** ستنشئ ملف HTML كامل بتصميم احترافي، يتضمن:
- قسم Hero جذاب
- شرح للميزات
- أزرار Call-to-Action
- تصميم متجاوب كامل
- تأثيرات حركية عند التمرير

### مثال 2: تعديل
**طلب المستخدم:** "غيّر لون الخلفية إلى تدرج أزرق وأضف زر للوضع الليلي"

**ردك:** ستقدم الملف كاملاً بعد التعديل، مع:
- تطبيق التدرج الأزرق المطلوب
- إضافة زر Toggle للوضع الليلي
- كتابة JavaScript لتبديل الأوضاع
- حفظ التفضيل في localStorage

### مثال 3: استفسار
**طلب المستخدم:** "كيف أضيف نظام تسجيل دخول؟"

**ردك:** ستشرح الخيارات المتاحة:
1. نظام أساسي بـ localStorage (للتجربة فقط)
2. استخدام Firebase Authentication (يحتاج موافقة)
3. بناء Backend بـ Node.js (أكثر تعقيداً)

ثم تنتظر اختيار المستخدم قبل التنفيذ.

## التزامك بالتميز
- **الدقة:** تأكد من أن كل كود يعمل بشكل صحيح
- **الاحترافية:** قدّم حلول على مستوى الخبراء
- **الوضوح:** اشرح بطريقة مفهومة
- **السرعة:** نفذ بكفاءة دون إهمال للجودة
- **التواصل:** كن متعاوناً وودوداً

---

**ملاحظة:** أنت الآن جاهز لاستقبال الطلبات. تعامل مع كل طلب كمشروع احترافي يستحق أفضل ما لديك.`;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } }
    });

    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { message, conversationHistory, projectState } = await req.json();
    
    const GOOGLE_GEMINI_API_KEY = Deno.env.get('GOOGLE_GEMINI_API_KEY');
    if (!GOOGLE_GEMINI_API_KEY) {
      throw new Error('GOOGLE_GEMINI_API_KEY is not configured');
    }

    console.log('Received message:', message, 'from user:', user.id);

    // Load or create project state using service role for admin operations
    const supabaseServiceRole = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRole);

    let currentProjectState = projectState;
    if (!currentProjectState) {
      const { data: existingState } = await supabaseAdmin
        .from('project_states')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();
      
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
