import React, { createContext, useContext, useEffect, useState } from 'react';

type Language = 'en' | 'ar';

type LanguageProviderProps = {
  children: React.ReactNode;
  defaultLanguage?: Language;
  storageKey?: string;
};

type LanguageProviderState = {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
};

const translations = {
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.categories': 'Categories',
    'nav.about': 'About',
    
    // Home page
    'home.title': 'Interview Q&A Platform',
    'home.subtitle': 'Master your technical interviews with our comprehensive question and answer database',
    'home.cta': 'Start Preparing',
    'home.categories.title': 'Interview Categories',
    'home.categories.subtitle': 'Choose your focus area and start practicing',
    
    // Categories
    'category.frontend.general.title': 'Frontend General',
    'category.frontend.general.description': 'General frontend development concepts and principles',
    'category.frontend.tech.title': 'Frontend Technologies',
    'category.frontend.tech.description': 'Specific frontend frameworks and libraries',
    'category.backend.general.title': 'Backend General',
    'category.backend.general.description': 'Server-side development fundamentals',
    'category.backend.tech.title': 'Backend Technologies',
    'category.backend.tech.description': 'Backend frameworks and databases',
    'category.web.general.title': 'Web Development',
    'category.web.general.description': 'General web development concepts',
    
    // Exams
    'exam.frontend.title': 'Frontend Exam',
    'exam.frontend.description': 'Test your frontend development skills',
    'exam.backend.title': 'Backend Exam',
    'exam.backend.description': 'Test your backend development skills',
    
    // Common
    'common.questions': 'Questions',
    'common.loading': 'Loading...',
    'common.error': 'Error loading questions',
    'common.back': 'Back to Home',
    'common.examples': 'Examples',
    'common.input': 'Input',
    'common.expected_output': 'Expected Output',
    'common.show_solution': 'Show Solution',
    'common.hide_solution': 'Hide Solution',
    
    // Algorithms page
    'algorithms.title': 'Algorithms & Data Structures',
    'algorithms.questions': 'Questions',
    'algorithms.intro': 'Essential algorithms and data structures concepts, interview questions, and practical examples.',
    
    // JavaScript Interpreter
    'js.title': 'JavaScript Interpreter',
    'js.subtitle': 'Write and run JavaScript code with live output',
    'js.editor': 'Code Editor',
    'js.output': 'Output',
    'js.examples': 'Ready Examples',
    'js.tips': 'Tips',
    'js.run': 'Run Code',
    'js.running': 'Running...',
    'js.clear': 'Clear',
    'js.copy': 'Copy',
    'js.download': 'Download',
    'js.basic_ops': 'Basic Operations',
    'js.functions': 'Functions',
    'js.objects_arrays': 'Objects & Arrays',
    
    // Home page additional
    'home.start_learning': 'Start Learning',
  },
  ar: {
    // Navigation
    'nav.home': 'الرئيسية',
    'nav.categories': 'الفئات',
    'nav.about': 'حول',
    
    // Home page
    'home.title': 'منصة أسئلة وأجوبة المقابلات',
    'home.subtitle': 'أتقن مقابلاتك التقنية مع قاعدة بيانات شاملة للأسئلة والأجوبة',
    'home.cta': 'ابدأ التحضير',
    'home.categories.title': 'فئات المقابلات',
    'home.categories.subtitle': 'اختر مجال تركيزك وابدأ الممارسة',
    
    // Categories
    'category.frontend.general.title': 'الواجهة الأمامية العامة',
    'category.frontend.general.description': 'مفاهيم ومبادئ تطوير الواجهة الأمامية العامة',
    'category.frontend.tech.title': 'تقنيات الواجهة الأمامية',
    'category.frontend.tech.description': 'أطر عمل ومكتبات الواجهة الأمامية المحددة',
    'category.backend.general.title': 'الخادم العامة',
    'category.backend.general.description': 'أساسيات تطوير الخادم',
    'category.backend.tech.title': 'تقنيات الخادم',
    'category.backend.tech.description': 'أطر عمل الخادم وقواعد البيانات',
    'category.web.general.title': 'تطوير الويب',
    'category.web.general.description': 'مفاهيم تطوير الويب العامة',
    
    // Exams
    'exam.frontend.title': 'امتحان الواجهة الأمامية',
    'exam.frontend.description': 'اختبر مهاراتك في تطوير الواجهة الأمامية',
    'exam.backend.title': 'امتحان الخادم',
    'exam.backend.description': 'اختبر مهاراتك في تطوير الخادم',
    
    // Common
    'common.questions': 'الأسئلة',
    'common.loading': 'جاري التحميل...',
    'common.error': 'خطأ في تحميل الأسئلة',
    'common.back': 'العودة للرئيسية',
    'common.examples': 'الأمثلة',
    'common.input': 'المدخل',
    'common.expected_output': 'المخرج المتوقع',
    'common.show_solution': 'إظهار الحل',
    'common.hide_solution': 'إخفاء الحل',
    
    // Algorithms page
    'algorithms.title': 'الخوارزميات وهياكل البيانات',
    'algorithms.questions': 'سؤال',
    'algorithms.intro': 'مفاهيم الخوارزميات وهياكل البيانات الأساسية، أسئلة المقابلات، والأمثلة العملية.',
    
    // JavaScript Interpreter
    'js.title': 'مترجم JavaScript',
    'js.subtitle': 'اكتب وشغل كود JavaScript الخاص بك مع مخرجات مباشرة',
    'js.editor': 'محرر الكود',
    'js.output': 'المخرجات',
    'js.examples': 'أمثلة جاهزة',
    'js.tips': 'نصائح',
    'js.run': 'تشغيل الكود',
    'js.running': 'جاري التشغيل...',
    'js.clear': 'مسح',
    'js.copy': 'نسخ',
    'js.download': 'تحميل',
    'js.basic_ops': 'العمليات الأساسية',
    'js.functions': 'الدوال',
    'js.objects_arrays': 'الكائنات والمصفوفات',
    
    // Home page additional
    'home.start_learning': 'ابدأ التعلم',
  },
};

const initialState: LanguageProviderState = {
  language: 'en',
  setLanguage: () => null,
  t: () => '',
};

const LanguageProviderContext = createContext<LanguageProviderState>(initialState);

export function LanguageProvider({
  children,
  defaultLanguage = 'en',
  storageKey = 'platform-language',
  ...props
}: LanguageProviderProps) {
  const [language, setLanguage] = useState<Language>(
    () => (localStorage.getItem(storageKey) as Language) || defaultLanguage
  );

  useEffect(() => {
    const root = window.document.documentElement;
    
    if (language === 'ar') {
      root.setAttribute('dir', 'rtl');
      root.setAttribute('lang', 'ar');
    } else {
      root.setAttribute('dir', 'ltr');
      root.setAttribute('lang', 'en');
    }
  }, [language]);

  const t = (key: string): string => {
    return (translations[language] as Record<string, string>)[key] || key;
  };

  const value = {
    language,
    setLanguage: (language: Language) => {
      localStorage.setItem(storageKey, language);
      setLanguage(language);
    },
    t,
  };

  return (
    <LanguageProviderContext.Provider {...props} value={value}>
      {children}
    </LanguageProviderContext.Provider>
  );
}

export const useLanguage = () => {
  const context = useContext(LanguageProviderContext);

  if (context === undefined)
    throw new Error('useLanguage must be used within a LanguageProvider');

  return context;
};