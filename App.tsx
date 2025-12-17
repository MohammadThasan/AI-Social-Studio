
import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import GeneratorForm from './components/GeneratorForm';
import PostResult from './components/PostResult';
import { FormData, GeneratedPost } from './types';
import { generateSocialPost, generatePostImage } from './services/geminiService';
import { ShieldAlert, Key } from 'lucide-react';

const App: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    platform: 'LinkedIn',
    topic: 'Autonomous Data Agents',
    customTopic: '',
    tone: 'Educational',
    includeEmoji: true,
    includeHashtags: true,
    includePromptChaining: false,
    includeCTA: false,
    comparisonFormat: false,
    tldrSummary: false,
    includeFutureOutlook: false,
    includeDevilsAdvocate: false,
    includeImplementationSteps: false,
  });

  const [generatedPost, setGeneratedPost] = useState<GeneratedPost | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [hasProKey, setHasProKey] = useState<boolean>(false);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  useEffect(() => {
    // Check if user has already selected a key
    const checkKey = async () => {
        if (window.aistudio?.hasSelectedApiKey) {
            const has = await window.aistudio.hasSelectedApiKey();
            setHasProKey(has);
        }
    };
    checkKey();
  }, []);

  const handleOpenKeySelector = async () => {
    if (window.aistudio?.openSelectKey) {
        await window.aistudio.openSelectKey();
        setHasProKey(true); // Assume success per guidelines
    }
  };

  const handleSubmit = async () => {
    if (!hasProKey) {
        await handleOpenKeySelector();
        return;
    }

    setIsLoading(true);
    setError(null);
    setGeneratedPost(null);

    try {
      const [textResult, imageResult] = await Promise.all([
        generateSocialPost(formData),
        generatePostImage(formData)
      ]);

      setGeneratedPost({
        ...textResult,
        imageUrl: imageResult
      });
    } catch (err: any) {
      if (err.message === "PRO_KEY_REQUIRED") {
        setHasProKey(false);
        setError("High-quality model requires a selected API Key. Please click the button below.");
      } else {
        setError(err.message || 'Something went wrong.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header isDarkMode={isDarkMode} toggleTheme={() => setIsDarkMode(!isDarkMode)} />
      
      {!hasProKey && (
          <div className="bg-indigo-600 text-white py-3 px-4 flex items-center justify-center gap-4 text-sm font-medium">
             <div className="flex items-center gap-2">
                <Key className="w-4 h-4" />
                <span>Unlock High-Quality AI Analytics Content (Gemini 3 Pro)</span>
             </div>
             <button 
                onClick={handleOpenKeySelector}
                className="bg-white text-indigo-600 px-3 py-1 rounded-md text-xs font-bold hover:bg-indigo-50 transition-colors shadow-sm"
             >
                Connect Pro Key
             </button>
             <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" className="underline opacity-80 hover:opacity-100 text-xs">
                Billing Docs
             </a>
          </div>
      )}

      <main className="flex-grow max-w-[1400px] mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 md:py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 h-full items-start">
          
          <div className="lg:col-span-5 xl:col-span-4 sticky top-24">
            <GeneratorForm 
              formData={formData} 
              setFormData={setFormData} 
              onSubmit={handleSubmit} 
              isLoading={isLoading} 
            />
          </div>

          <div className="lg:col-span-7 xl:col-span-8 w-full">
            <PostResult 
              post={generatedPost} 
              isLoading={isLoading} 
              error={error}
              formData={formData}
              onImageUpdate={(url) => generatedPost && setGeneratedPost({...generatedPost, imageUrl: url})}
              onContentUpdate={(c) => generatedPost && setGeneratedPost({...generatedPost, content: c})}
            />
          </div>
          
        </div>
      </main>

      <footer className="border-t border-slate-200 dark:border-slate-800 py-8 mt-auto">
        <div className="max-w-7xl mx-auto px-4 text-center text-slate-400 dark:text-slate-600 text-xs font-medium">
          <p>© {new Date().getFullYear()} InsightGen - AI Analytics Specialist. Powered by Gemini 3.</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
