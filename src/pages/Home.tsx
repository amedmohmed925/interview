import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Code, Database, Globe, Layers, Server, GraduationCap } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const Home: React.FC = () => {
  const { t } = useLanguage();

  const categories = [
    {
      key: 'frontend-general',
      title: t('category.frontend.general.title'),
      description: t('category.frontend.general.description'),
      href: '/frontend-general',
      icon: Code,
      gradient: 'from-blue-500 to-cyan-500',
    },
    {
      key: 'frontend-tech',
      title: t('category.frontend.tech.title'),
      description: t('category.frontend.tech.description'),
      href: '/frontend-tech',
      icon: Layers,
      gradient: 'from-purple-500 to-pink-500',
    },
    {
      key: 'backend-general',
      title: t('category.backend.general.title'),
      description: t('category.backend.general.description'),
      href: '/backend-general',
      icon: Server,
      gradient: 'from-green-500 to-emerald-500',
    },
    {
      key: 'backend-tech',
      title: t('category.backend.tech.title'),
      description: t('category.backend.tech.description'),
      href: '/backend-tech',
      icon: Database,
      gradient: 'from-orange-500 to-red-500',
    },
    {
      key: 'web-general',
      title: t('category.web.general.title'),
      description: t('category.web.general.description'),
      href: '/web-general',
      icon: Globe,
      gradient: 'from-indigo-500 to-purple-500',
    },
    {
      key: 'frontend-exam',
      title: t('exam.frontend.title'),
      description: t('exam.frontend.description'),
      href: '/frontend-exam',
      icon: GraduationCap,
      gradient: 'from-pink-500 to-rose-500',
    },
    {
      key: 'backend-exam',
      title: t('exam.backend.title'),
      description: t('exam.backend.description'),
      href: '/backend-exam',
      icon: GraduationCap,
      gradient: 'from-teal-500 to-cyan-500',
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 24
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 24
      }
    }
  };

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-accent/5 to-secondary/5" />
        <div className="container mx-auto px-4 py-16 lg:py-24 relative">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="text-center max-w-4xl mx-auto"
          >
            <motion.h1
              variants={itemVariants}
              className="text-5xl lg:text-7xl font-bold text-primary mb-6 leading-tight"
            >
              {t('home.title')}
            </motion.h1>
            
            <motion.p
              variants={itemVariants}
              className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed"
            >
              {t('home.subtitle')}
            </motion.p>
            
            <motion.div
              variants={itemVariants}
            >
              <Button 
                asChild 
                size="lg"
                className="text-lg px-8 py-6 rounded-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                <Link to="#categories">
                  {t('home.cta')}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Categories Section */}
      <section id="categories" className="container mx-auto px-4 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl lg:text-4xl font-bold text-primary mb-4">
            {t('home.categories.title')}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t('home.categories.subtitle')}
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <motion.div
                key={category.key}
                variants={cardVariants}
                whileHover={{ y: -8, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Link to={category.href}>
                  <Card className="h-full cursor-pointer group border-2 hover:border-primary/20 transition-all duration-300 hover:shadow-lg overflow-hidden">
                    <CardHeader className="space-y-4">
                      <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${category.gradient} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                        <Icon className="h-8 w-8 text-white" />
                      </div>
                      <div className="space-y-2">
                        <CardTitle className="text-xl group-hover:text-primary transition-colors duration-200">
                          {category.title}
                        </CardTitle>
                        <CardDescription className="text-sm leading-relaxed">
                          {category.description}
                        </CardDescription>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center text-primary group-hover:translate-x-2 transition-transform duration-200">
                        <span className="text-sm font-medium">Start Learning</span>
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
      </section>
    </div>
  );
};

export default Home;