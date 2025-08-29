import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { LanguageProvider } from './contexts/LanguageContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import FrontendGeneral from './pages/FrontendGeneral';
import FrontendTech from './pages/FrontendTech';
import BackendGeneral from './pages/BackendGeneral';
import BackendTech from './pages/BackendTech';
import WebGeneral from './pages/WebGeneral';
import FrontendExam from './pages/FrontendExam';
import BackendExam from './pages/BackendExam';
import { Toaster } from '@/components/ui/sonner';

function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <Router>
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/frontend-general" element={<FrontendGeneral />} />
              <Route path="/frontend-tech" element={<FrontendTech />} />
              <Route path="/backend-general" element={<BackendGeneral />} />
              <Route path="/backend-tech" element={<BackendTech />} />
              <Route path="/web-general" element={<WebGeneral />} />
              <Route path="/frontend-exam" element={<FrontendExam />} />
              <Route path="/backend-exam" element={<BackendExam />} />
            </Routes>
          </Layout>
          <Toaster />
        </Router>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;