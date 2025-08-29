import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import QAList from '../components/QAList';
import { useLanguage } from '../contexts/LanguageContext';
import { Button } from '@/components/ui/button';

interface Question {
  id: number;
  question_en: string;
  answer_en: string;
  question_ar: string;
  answer_ar: string;
}

const BackendGeneral: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const { t } = useLanguage();

  useEffect(() => {
    const loadQuestions = async () => {
      try {
        const response = await fetch('/src/data/backend_general.json');
        const data = await response.json();
        setQuestions(data);
      } catch (error) {
        console.error('Error loading questions:', error);
      }
    };

    loadQuestions();
  }, []);

  return (
    <div>
      <div className="container mx-auto px-4 py-8">
        <Button variant="ghost" asChild className="mb-6">
          <Link to="/" className="flex items-center space-x-2">
            <ArrowLeft className="h-4 w-4" />
            <span>{t('common.back')}</span>
          </Link>
        </Button>
      </div>
      
      <QAList 
        questions={questions} 
        title={t('category.backend.general.title')} 
      />
    </div>
  );
};

export default BackendGeneral;