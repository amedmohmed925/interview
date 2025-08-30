import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { Button } from '@/components/ui/button';

const AlgorithmsDataStructures: React.FC = () => {
  const { t, language } = useLanguage();



  interface Example {
    input: string;
    expected_output: string;
  }

  interface Problem {
    id: number;
    question_en: string;
    question_ar: string;
    solution: string;
    examples?: Example[];
  }

  const [problems, setProblems] = React.useState<Problem[]>([]);
  const [openIndex, setOpenIndex] = React.useState<number | null>(null);

  React.useEffect(() => {
    const fetchProblems = async () => {
      try {
        const res = await fetch('/src/data/algorithms_data_structures.json');
        const data = await res.json();
        setProblems(data);
      } catch (err) {
        setProblems([]);
      }
    };
    fetchProblems();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <Button variant="ghost" asChild className="mb-6">
        <Link to="/" className="flex items-center space-x-2">
          <ArrowLeft className="h-4 w-4" />
          <span>{t('common.back')}</span>
        </Link>
      </Button>
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-3xl font-bold text-primary mb-2">{t('algorithms.title')}</h1>
        <div className="text-lg text-muted-foreground mb-8">{problems.length} {t('algorithms.questions')}</div>
      </div>

      <div className="space-y-6 max-w-3xl mx-auto">
        {problems.map((item, idx) => (
          <Card key={idx} className="">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">
                {language === 'ar' ? item.question_ar : item.question_en}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {item.examples && item.examples.length > 0 && (
                <div className="mt-4">
                  <div className="font-semibold mb-2">{t('common.examples')}:</div>
                  <ul className="space-y-2">
                    {item.examples.map((ex, exIdx) => (
                      <li key={exIdx} className="bg-accent/30 rounded p-2 text-sm">
                        <div><span className="font-medium">{t('common.input')}:</span> <code>{ex.input}</code></div>
                        <div><span className="font-medium">{t('common.expected_output')}:</span> <code>{ex.expected_output}</code></div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              <Button
                size="sm"
                variant="outline"
                className="mb-4 mt-4"
                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
              >
                {openIndex === idx
                  ? t('common.hide_solution')
                  : t('common.show_solution')}
              </Button>
              {openIndex === idx && (
                <pre className="bg-muted rounded p-4 overflow-x-auto text-sm mt-2">
                  <code>{item.solution}</code>
                </pre>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AlgorithmsDataStructures;
