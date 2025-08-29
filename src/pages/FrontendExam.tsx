import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, CheckCircle, XCircle, RotateCcw, Trophy, Clock } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';

interface ExamQuestion {
  id: number;
  type: 'true_false' | 'multiple_choice';
  question_en: string;
  question_ar: string;
  options_en?: string[];
  options_ar?: string[];
  correct_answer: boolean | number;
  explanation_en: string;
  explanation_ar: string;
}

interface UserAnswer {
  questionId: number;
  answer: boolean | number;
  isCorrect: boolean;
}

const FrontendExam: React.FC = () => {
  const [questions, setQuestions] = useState<ExamQuestion[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<boolean | number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [examCompleted, setExamCompleted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(3600); // 60 minutes
  const [examStarted, setExamStarted] = useState(false);
  const { language, t } = useLanguage();

  useEffect(() => {
    const loadQuestions = async () => {
      try {
        const response = await fetch('/src/data/frontend_exam.json');
        const data = await response.json();
        setQuestions(data);
      } catch (error) {
        console.error('Error loading exam questions:', error);
      }
    };

    loadQuestions();
  }, []);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (examStarted && timeLeft > 0 && !examCompleted) {
      timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    } else if (timeLeft === 0) {
      handleExamComplete();
    }
    return () => clearTimeout(timer);
  }, [timeLeft, examStarted, examCompleted]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const startExam = () => {
    setExamStarted(true);
    setCurrentQuestion(0);
    setUserAnswers([]);
    setExamCompleted(false);
    setShowResult(false);
    setTimeLeft(3600);
  };

  const handleAnswerSelect = (answer: boolean | number) => {
    setSelectedAnswer(answer);
  };

  const handleNextQuestion = () => {
    if (selectedAnswer === null) return;

    const currentQ = questions[currentQuestion];
    const isCorrect = selectedAnswer === currentQ.correct_answer;
    
    const newAnswer: UserAnswer = {
      questionId: currentQ.id,
      answer: selectedAnswer,
      isCorrect
    };

    const updatedAnswers = [...userAnswers, newAnswer];
    setUserAnswers(updatedAnswers);
    setSelectedAnswer(null);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      handleExamComplete();
    }
  };

  const handleExamComplete = () => {
    setExamCompleted(true);
    setShowResult(true);
  };

  const resetExam = () => {
    setCurrentQuestion(0);
    setUserAnswers([]);
    setSelectedAnswer(null);
    setShowResult(false);
    setExamCompleted(false);
    setExamStarted(false);
    setTimeLeft(3600);
  };

  const calculateScore = () => {
    const correctAnswers = userAnswers.filter(answer => answer.isCorrect).length;
    return Math.round((correctAnswers / questions.length) * 100);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBadge = (score: number) => {
    if (score >= 90) return { text: 'Excellent', variant: 'default' as const };
    if (score >= 80) return { text: 'Good', variant: 'secondary' as const };
    if (score >= 60) return { text: 'Pass', variant: 'outline' as const };
    return { text: 'Needs Improvement', variant: 'destructive' as const };
  };

  if (!examStarted) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Button variant="ghost" asChild className="mb-6">
          <Link to="/" className="flex items-center space-x-2">
            <ArrowLeft className="h-4 w-4" />
            <span>{t('common.back')}</span>
          </Link>
        </Button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto text-center"
        >
          <div className="mb-8">
            <Trophy className="h-16 w-16 text-primary mx-auto mb-4" />
            <h1 className="text-4xl font-bold text-primary mb-4">
              {language === 'en' ? 'Frontend Development Exam' : 'امتحان تطوير الواجهة الأمامية'}
            </h1>
            <p className="text-lg text-muted-foreground">
              {language === 'en' 
                ? 'Test your frontend development knowledge with 50 comprehensive questions'
                : 'اختبر معرفتك في تطوير الواجهة الأمامية مع 50 سؤال شامل'
              }
            </p>
          </div>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>
                {language === 'en' ? 'Exam Instructions' : 'تعليمات الامتحان'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-left">
              <div className="flex items-center space-x-3">
                <Clock className="h-5 w-5 text-primary" />
                <span>
                  {language === 'en' 
                    ? 'Time limit: 60 minutes' 
                    : 'الحد الزمني: 60 دقيقة'
                  }
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle className="h-5 w-5 text-primary" />
                <span>
                  {language === 'en' 
                    ? '50 questions (True/False and Multiple Choice)' 
                    : '50 سؤال (صح/خطأ واختيار متعدد)'
                  }
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <Trophy className="h-5 w-5 text-primary" />
                <span>
                  {language === 'en' 
                    ? 'Passing score: 60%' 
                    : 'درجة النجاح: 60%'
                  }
                </span>
              </div>
            </CardContent>
          </Card>

          <Button 
            onClick={startExam} 
            size="lg"
            className="text-lg px-8 py-6"
            disabled={questions.length === 0}
          >
            {language === 'en' ? 'Start Exam' : 'بدء الامتحان'}
          </Button>
        </motion.div>
      </div>
    );
  }

  if (showResult) {
    const score = calculateScore();
    const scoreBadge = getScoreBadge(score);
    
    return (
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-2xl mx-auto text-center"
        >
          <div className="mb-8">
            <Trophy className={`h-20 w-20 mx-auto mb-4 ${getScoreColor(score)}`} />
            <h1 className="text-4xl font-bold text-primary mb-4">
              {language === 'en' ? 'Exam Completed!' : 'تم إكمال الامتحان!'}
            </h1>
            <div className="text-6xl font-bold mb-4">
              <span className={getScoreColor(score)}>{score}%</span>
            </div>
            <Badge variant={scoreBadge.variant} className="text-lg px-4 py-2">
              {scoreBadge.text}
            </Badge>
          </div>

          <Card className="mb-8">
            <CardContent className="pt-6">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-green-600">
                    {userAnswers.filter(a => a.isCorrect).length}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {language === 'en' ? 'Correct' : 'صحيح'}
                  </div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-red-600">
                    {userAnswers.filter(a => !a.isCorrect).length}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {language === 'en' ? 'Incorrect' : 'خطأ'}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-4">
            <Button onClick={resetExam} size="lg" className="w-full">
              <RotateCcw className="mr-2 h-5 w-5" />
              {language === 'en' ? 'Retake Exam' : 'إعادة الامتحان'}
            </Button>
            <Button variant="outline" asChild className="w-full">
              <Link to="/">
                {language === 'en' ? 'Back to Home' : 'العودة للرئيسية'}
              </Link>
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  const currentQ = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <Button variant="ghost" asChild>
          <Link to="/" className="flex items-center space-x-2">
            <ArrowLeft className="h-4 w-4" />
            <span>{t('common.back')}</span>
          </Link>
        </Button>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4 text-primary" />
            <span className="font-mono text-lg">{formatTime(timeLeft)}</span>
          </div>
          <Badge variant="outline">
            {currentQuestion + 1} / {questions.length}
          </Badge>
        </div>
      </div>

      {/* Progress */}
      <div className="mb-8">
        <Progress value={progress} className="h-2" />
        <div className="text-sm text-muted-foreground mt-2">
          {language === 'en' ? 'Progress' : 'التقدم'}: {Math.round(progress)}%
        </div>
      </div>

      {/* Question */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestion}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="max-w-4xl mx-auto">
            <CardHeader>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold">
                  {currentQuestion + 1}
                </div>
                <Badge variant={currentQ?.type === 'true_false' ? 'default' : 'secondary'}>
                  {currentQ?.type === 'true_false' 
                    ? (language === 'en' ? 'True/False' : 'صح/خطأ')
                    : (language === 'en' ? 'Multiple Choice' : 'اختيار متعدد')
                  }
                </Badge>
              </div>
              <CardTitle className="text-xl leading-relaxed">
                {language === 'en' ? currentQ?.question_en : currentQ?.question_ar}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {currentQ?.type === 'true_false' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Button
                    variant={selectedAnswer === true ? 'default' : 'outline'}
                    onClick={() => handleAnswerSelect(true)}
                    className="h-16 text-lg"
                  >
                    <CheckCircle className="mr-2 h-5 w-5" />
                    {language === 'en' ? 'True' : 'صحيح'}
                  </Button>
                  <Button
                    variant={selectedAnswer === false ? 'default' : 'outline'}
                    onClick={() => handleAnswerSelect(false)}
                    className="h-16 text-lg"
                  >
                    <XCircle className="mr-2 h-5 w-5" />
                    {language === 'en' ? 'False' : 'خطأ'}
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {currentQ?.options_en?.map((option, index) => (
                    <Button
                      key={index}
                      variant={selectedAnswer === index ? 'default' : 'outline'}
                      onClick={() => handleAnswerSelect(index)}
                      className="w-full h-auto p-4 text-left justify-start"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-6 h-6 rounded-full border-2 flex items-center justify-center text-sm font-bold">
                          {String.fromCharCode(65 + index)}
                        </div>
                        <span>
                          {language === 'en' ? option : currentQ?.options_ar?.[index]}
                        </span>
                      </div>
                    </Button>
                  ))}
                </div>
              )}

              <div className="flex justify-between items-center pt-6">
                <Button
                  variant="outline"
                  onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
                  disabled={currentQuestion === 0}
                >
                  {language === 'en' ? 'Previous' : 'السابق'}
                </Button>
                
                <Button
                  onClick={handleNextQuestion}
                  disabled={selectedAnswer === null}
                  className="px-8"
                >
                  {currentQuestion === questions.length - 1
                    ? (language === 'en' ? 'Finish Exam' : 'إنهاء الامتحان')
                    : (language === 'en' ? 'Next Question' : 'السؤال التالي')
                  }
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default FrontendExam;