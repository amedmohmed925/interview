import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Card } from '@/components/ui/card';

interface Question {
  id: number;
  question_en: string;
  answer_en: string;
  question_ar: string;
  answer_ar: string;
}

interface QAListProps {
  questions: Question[];
  title: string;
}

const QAList: React.FC<QAListProps> = ({ questions, title }) => {
  const { language, t } = useLanguage();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring" as const,
        stiffness: 300,
        damping: 24
      }
    }
  };

  if (!questions || questions.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-muted-foreground">
          {t('common.loading')}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl font-bold text-primary mb-4">{title}</h1>
        <p className="text-lg text-muted-foreground">
          {questions.length} {t('common.questions')}
        </p>
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-4xl mx-auto space-y-4"
      >
        <Accordion type="single" collapsible className="space-y-4">
          {questions.map((question, index) => (
            <motion.div
              key={question.id}
              variants={itemVariants}
            >
              <Card className="overflow-hidden border-2 hover:border-primary/20 transition-colors duration-300">
                <AccordionItem value={`item-${question.id}`} className="border-none">
                  <AccordionTrigger className="px-6 py-4 text-left hover:no-underline hover:bg-accent/50 transition-colors duration-200">
                    <div className="flex items-start space-x-4 w-full">
                      <div className="flex-shrink-0 w-8 h-8 bg-primary/10 text-primary rounded-full flex items-center justify-center text-sm font-bold">
                        {index + 1}
                      </div>
                      <div className="flex-grow min-w-0">
                        <h3 className="text-lg font-semibold text-foreground leading-6">
                          {language === 'en' ? question.question_en : question.question_ar}
                        </h3>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-6">
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.1 }}
                      className="bg-accent/30 rounded-lg p-6 mt-4"
                    >
                      <div className="prose prose-sm max-w-none dark:prose-invert">
                        <p className="text-foreground leading-relaxed whitespace-pre-line">
                          {language === 'en' ? question.answer_en : question.answer_ar}
                        </p>
                      </div>
                    </motion.div>
                  </AccordionContent>
                </AccordionItem>
              </Card>
            </motion.div>
          ))}
        </Accordion>
      </motion.div>
    </div>
  );
};

export default QAList;