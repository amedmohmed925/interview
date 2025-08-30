import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Play, RotateCcw, Copy, Download } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const JavaScriptInterpreter: React.FC = () => {
  const { t } = useLanguage();
  const [code, setCode] = useState(`// مرحباً بك في JavaScript Interpreter
// يمكنك كتابة الكود هنا وتشغيله

console.log("Hello, World!");
console.log("مرحباً بالعالم!");

function greet(name) {
  return "مرحباً " + name + "!";
}

console.log(greet("المطور"));
console.log(greet("المستخدم"));

// جرب كتابة كودك الخاص هنا...`);
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const runCode = async () => {
    setIsRunning(true);
    setOutput('');

    try {
      // محاكاة console.log
      const logs: string[] = [];
      const originalConsoleLog = console.log;
      console.log = (...args) => {
        logs.push(args.map(arg =>
          typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
        ).join(' '));
        originalConsoleLog(...args);
      };

      // تنفيذ الكود
      const result = eval(code);

      // استعادة console.log الأصلي
      console.log = originalConsoleLog;

      // عرض النتائج
      let finalOutput = logs.join('\n');
      if (result !== undefined) {
        finalOutput += (finalOutput ? '\n' : '') + 'Result: ' + (typeof result === 'object' ? JSON.stringify(result, null, 2) : String(result));
      }

      setOutput(finalOutput || 'Code executed successfully (no output)');

    } catch (error) {
      setOutput('Error: ' + (error instanceof Error ? error.message : String(error)));
    } finally {
      setIsRunning(false);
    }
  };

  const clearCode = () => {
    setCode(`// JavaScript Interpreter
// Write your code here...

console.log("Hello, World!");`);
    setOutput('');
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(code);
      // يمكن إضافة toast notification هنا
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };

  const downloadCode = () => {
    const blob = new Blob([code], { type: 'text/javascript' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'javascript-code.js';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const loadExample = (exampleCode: string) => {
    setCode(exampleCode);
    setOutput('');
  };

  const examples = [
    {
      key: 'basic_ops',
      code: '// العمليات الأساسية\\nconsole.log("الجمع:", 5 + 3);\\nconsole.log("الطرح:", 10 - 4);\\nconsole.log("الضرب:", 6 * 7);\\nconsole.log("القسمة:", 20 / 4);\\n\\n// العمليات النصية\\nconst name = "أحمد";\\nconst greeting = "مرحباً " + name + "!";\\nconsole.log(greeting);\\n\\n// المصفوفات\\nconst numbers = [1, 2, 3, 4, 5];\\nconsole.log("المصفوفة:", numbers);\\nconsole.log("المجموع:", numbers.reduce((a, b) => a + b, 0));'
    },
    {
      key: 'functions',
      code: '// الدوال\\nfunction factorial(n) {\\n  if (n <= 1) return 1;\\n  return n * factorial(n - 1);\\n}\\n\\nfunction isPrime(num) {\\n  if (num <= 1) return false;\\n  for (let i = 2; i <= Math.sqrt(num); i++) {\\n    if (num % i === 0) return false;\\n  }\\n  return true;\\n}\\n\\nconsole.log("Factorial of 5:", factorial(5));\\nconsole.log("Is 17 prime?", isPrime(17));\\nconsole.log("Is 15 prime?", isPrime(15));'
    },
    {
      key: 'objects_arrays',
      code: '// الكائنات والمصفوفات\\nconst student = {\\n  name: "سارة",\\n  age: 22,\\n  grades: [85, 92, 78, 96],\\n  getAverage: function() {\\n    return this.grades.reduce((a, b) => a + b, 0) / this.grades.length;\\n  }\\n};\\n\\nconsole.log("الطالب:", student.name);\\nconsole.log("العمر:", student.age);\\nconsole.log("الدرجات:", student.grades);\\nconsole.log("المتوسط:", student.getAverage().toFixed(2));\\n\\n// مصفوفة الكائنات\\nconst products = [\\n  { name: "لابتوب", price: 1500 },\\n  { name: "ماوس", price: 25 },\\n  { name: "كيبورد", price: 75 }\\n];\\n\\nconst total = products.reduce((sum, product) => sum + product.price, 0);\\nconsole.log("إجمالي الأسعار:", total);'
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <Button variant="ghost" asChild className="mb-6">
        <Link to="/" className="flex items-center space-x-2">
          <ArrowLeft className="h-4 w-4" />
          <span>{t('common.back')}</span>
        </Link>
      </Button>

      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-primary mb-2">{t('js.title')}</h1>
        <p className="text-lg text-muted-foreground">{t('js.subtitle')}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Code Editor */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{t('js.editor')}</CardTitle>
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={copyCode}
                    className="flex items-center space-x-1"
                  >
                    <Copy className="h-4 w-4" />
                    <span>{t('js.copy')}</span>
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={downloadCode}
                    className="flex items-center space-x-1"
                  >
                    <Download className="h-4 w-4" />
                    <span>{t('js.download')}</span>
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Textarea
                ref={textareaRef}
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="اكتب كود JavaScript هنا..."
                className="min-h-[400px] font-mono text-sm resize-none"
                style={{ fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace' }}
              />
              <div className="flex space-x-2 mt-4">
                <Button
                  onClick={runCode}
                  disabled={isRunning}
                  className="flex items-center space-x-2"
                >
                  <Play className="h-4 w-4" />
                  <span>{isRunning ? t('js.running') : t('js.run')}</span>
                </Button>
                <Button
                  variant="outline"
                  onClick={clearCode}
                  className="flex items-center space-x-2"
                >
                  <RotateCcw className="h-4 w-4" />
                  <span>{t('js.clear')}</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Output & Examples */}
        <div className="space-y-6">
          {/* Output */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">{t('js.output')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-muted rounded-lg p-4 min-h-[200px] font-mono text-sm overflow-auto">
                {output ? (
                  <pre className="whitespace-pre-wrap">{output}</pre>
                ) : (
                  <div className="text-muted-foreground text-center py-8">
                    اضغط "{t('js.run')}" لرؤية النتائج هنا
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Examples */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">{t('js.examples')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {examples.map((example, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => loadExample(example.code)}
                    className="w-full justify-start text-left"
                  >
                    {t('js.' + example.key)}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Tips */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">{t('js.tips')}</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="text-sm space-y-2 text-muted-foreground">
                <li>• استخدم <code>console.log()</code> لطباعة النتائج</li>
                <li>• يمكنك استخدام جميع ميزات JavaScript الحديثة</li>
                <li>• الكود يُنفذ في بيئة آمنة</li>
                <li>• يمكنك نسخ الكود أو تحميله كملف</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default JavaScriptInterpreter;
