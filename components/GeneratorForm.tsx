import React from 'react';
import { FormData, Topic, Tone, Platform } from '../types';
import { TOPICS, TONES } from '../constants';
import { Wand2, Loader2, Link2, Linkedin, Facebook, Twitter, Instagram, BookOpen } from 'lucide-react';

interface GeneratorFormProps {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  onSubmit: () => void;
  isLoading: boolean;
}

const GeneratorForm: React.FC<GeneratorFormProps> = ({ 
  formData, 
  setFormData, 
  onSubmit, 
  isLoading 
}) => {
  
  const handleChange = <K extends keyof FormData>(key: K, value: FormData[K]) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const PLATFORM_CONFIG: { id: Platform; label: string; icon: React.ReactNode; color: string; bg: string; darkBg: string }[] = [
    { id: 'LinkedIn', label: 'LinkedIn', icon: <Linkedin className="w-5 h-5" />, color: 'text-[#0a66c2] dark:text-[#378fe9]', bg: 'bg-[#0a66c2]/5', darkBg: 'dark:bg-[#0a66c2]/20' },
    { id: 'X (Twitter)', label: 'X (Twitter)', icon: <Twitter className="w-5 h-5" />, color: 'text-slate-900 dark:text-slate-100', bg: 'bg-slate-100', darkBg: 'dark:bg-slate-700' },
    { id: 'Medium', label: 'Medium', icon: <BookOpen className="w-5 h-5" />, color: 'text-slate-900 dark:text-slate-100', bg: 'bg-slate-100', darkBg: 'dark:bg-slate-700' },
    { id: 'Instagram', label: 'Instagram', icon: <Instagram className="w-5 h-5" />, color: 'text-[#E1306C]', bg: 'bg-[#E1306C]/5', darkBg: 'dark:bg-[#E1306C]/20' },
    { id: 'Facebook', label: 'Facebook', icon: <Facebook className="w-5 h-5" />, color: 'text-[#0866ff] dark:text-[#4e92ff]', bg: 'bg-[#0866ff]/5', darkBg: 'dark:bg-[#0866ff]/20' },
  ];

  return (
    <div className="bg-gradient-to-br from-amber-50/80 via-white to-blue-50/80 dark:from-slate-800 dark:via-slate-900 dark:to-slate-800 rounded-2xl shadow-xl shadow-slate-200/60 dark:shadow-none p-6 md:p-8 h-full flex flex-col border border-white/60 dark:border-slate-700 transition-colors duration-300">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Create New Post</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">Configure your target audience and content strategy.</p>
      </div>

      <div className="space-y-6 flex-grow">
        
        {/* Platform Selection */}
        <div>
           <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-3">
             Target Platform
           </label>
           <div className="flex flex-wrap gap-2">
             {PLATFORM_CONFIG.map((p) => {
               const isSelected = formData.platform === p.id;
               return (
                <button
                  key={p.id}
                  onClick={() => handleChange('platform', p.id)}
                  className={`flex items-center space-x-2 px-3 py-2.5 rounded-xl border transition-all duration-200 flex-grow justify-center md:flex-grow-0 ${
                    isSelected
                      ? `border-indigo-600 bg-white shadow-md shadow-indigo-100 dark:bg-slate-800 dark:shadow-none dark:border-indigo-500`
                      : 'border-slate-100 bg-white/60 hover:border-slate-200 hover:bg-white dark:border-slate-700 dark:bg-slate-800/50 dark:hover:bg-slate-800 dark:hover:border-slate-600'
                  }`}
                >
                  <div className={`${isSelected ? p.color : 'text-slate-400 dark:text-slate-500'}`}>
                    {p.icon}
                  </div>
                  <span className={`text-sm font-medium ${isSelected ? 'text-slate-900 dark:text-white' : 'text-slate-500 dark:text-slate-400'}`}>
                    {p.label}
                  </span>
                </button>
               );
             })}
           </div>
        </div>

        {/* Topic Selection */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-3">
             Research Topic <span className="text-indigo-500 text-[10px] ml-1 bg-indigo-50 dark:bg-indigo-900/30 px-1.5 py-0.5 rounded-full">AI Powered</span>
          </label>
          <div className="space-y-3">
            <div className="relative">
              <select
                value={formData.topic}
                onChange={(e) => handleChange('topic', e.target.value as Topic)}
                className="w-full rounded-xl border-slate-200 dark:border-slate-700 border bg-white/80 dark:bg-slate-900 px-4 py-3 text-slate-900 dark:text-white focus:border-indigo-500 focus:ring-indigo-500 text-sm font-medium transition-shadow outline-none appearance-none cursor-pointer hover:bg-white dark:hover:bg-slate-800"
              >
                {TOPICS.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-500">
                <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20">
                  <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" fillRule="evenodd" />
                </svg>
              </div>
            </div>
            
            {/* Custom Topic Input */}
            {formData.topic === 'Custom' && (
              <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                <input
                  type="text"
                  value={formData.customTopic}
                  onChange={(e) => handleChange('customTopic', e.target.value)}
                  placeholder="e.g. The impact of Gemini 1.5 on coding workflows..."
                  className="w-full rounded-xl border-slate-200 dark:border-slate-700 border px-4 py-3 text-slate-900 dark:text-white focus:border-indigo-500 focus:ring-indigo-500 text-sm bg-white/80 dark:bg-slate-900 dark:placeholder-slate-600"
                  autoFocus
                />
              </div>
            )}
            
            {/* Helper Text */}
            {formData.topic !== 'Custom' && (
                <p className="text-[11px] text-slate-400 dark:text-slate-500 flex items-center gap-1.5 px-1">
                   <Wand2 className="w-3 h-3" />
                   AI will search the web for the latest breakthrough in this field.
                </p>
            )}
          </div>
        </div>

        {/* Tone Selection */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-3">Tone of Voice</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {TONES.map((tone) => (
              <button
                key={tone.value}
                type="button"
                onClick={() => handleChange('tone', tone.value)}
                className={`flex flex-col items-start p-3 rounded-xl border text-left transition-all duration-200 
                  ${formData.tone === tone.value 
                    ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-900/30 ring-1 ring-indigo-600 dark:ring-indigo-500 dark:border-indigo-500' 
                    : 'border-slate-200 bg-white/60 dark:bg-slate-800/50 dark:border-slate-700 hover:border-slate-300 hover:bg-white dark:hover:bg-slate-800 dark:hover:border-slate-600'
                  }`}
              >
                <span className={`text-sm font-semibold ${formData.tone === tone.value ? 'text-indigo-900 dark:text-indigo-200' : 'text-slate-900 dark:text-slate-200'}`}>
                  {tone.label}
                </span>
                <span className={`text-[10px] mt-0.5 leading-tight ${formData.tone === tone.value ? 'text-indigo-700 dark:text-indigo-300' : 'text-slate-500 dark:text-slate-500'}`}>
                  {tone.description}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Toggles */}
        <div className="space-y-4 pt-2 border-t border-slate-200/50 dark:border-slate-700">
           <div className="flex flex-wrap gap-6">
            <label className="flex items-center space-x-3 cursor-pointer group select-none">
              <div className="relative flex items-center">
                <input 
                  type="checkbox" 
                  checked={formData.includeEmoji}
                  onChange={(e) => handleChange('includeEmoji', e.target.checked)}
                  className="peer h-5 w-5 cursor-pointer appearance-none rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 checked:border-indigo-600 checked:bg-indigo-600 dark:checked:bg-indigo-600 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1 dark:focus:ring-offset-slate-900 transition-all"
                />
                <Wand2 className="pointer-events-none absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 peer-checked:opacity-100" />
              </div>
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white">Emojis</span>
            </label>
            
            <label className="flex items-center space-x-3 cursor-pointer group select-none">
              <div className="relative flex items-center">
                <input 
                  type="checkbox" 
                  checked={formData.includeHashtags}
                  onChange={(e) => handleChange('includeHashtags', e.target.checked)}
                  className="peer h-5 w-5 cursor-pointer appearance-none rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 checked:border-indigo-600 checked:bg-indigo-600 dark:checked:bg-indigo-600 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1 dark:focus:ring-offset-slate-900 transition-all"
                />
                <Wand2 className="pointer-events-none absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 peer-checked:opacity-100" />
              </div>
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white">Hashtags #</span>
            </label>
           </div>
           
           <label className="flex items-center space-x-3 cursor-pointer group bg-white/60 dark:bg-slate-800/60 p-3 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 hover:bg-white dark:hover:bg-slate-800 transition-colors select-none">
              <div className="relative flex items-center">
                <input 
                  type="checkbox" 
                  checked={formData.includePromptChaining}
                  onChange={(e) => handleChange('includePromptChaining', e.target.checked)}
                  className="peer h-5 w-5 cursor-pointer appearance-none rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 checked:border-indigo-600 checked:bg-indigo-600 dark:checked:bg-indigo-600 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1 dark:focus:ring-offset-slate-900 transition-all"
                />
                <Link2 className="pointer-events-none absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 peer-checked:opacity-100" />
              </div>
              <div>
                <span className="text-sm font-medium text-slate-700 dark:text-slate-200 group-hover:text-slate-900 dark:group-hover:text-white flex items-center gap-1">
                  Include Prompt Chain
                </span>
                <span className="text-xs text-slate-400 dark:text-slate-500 block">Adds a practical prompting example</span>
              </div>
           </label>
        </div>
      </div>

      {/* Action Button */}
      <div className="mt-8 pt-6 border-t border-slate-200/50 dark:border-slate-700">
        <button
          onClick={onSubmit}
          disabled={isLoading || (formData.topic === 'Custom' && !formData.customTopic.trim())}
          className="w-full flex items-center justify-center space-x-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-4 py-4 text-sm font-bold text-white shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/40 hover:scale-[1.02] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100 transition-all active:scale-[0.98]"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Researching & Writing...</span>
            </>
          ) : (
            <>
              <Wand2 className="w-5 h-5" />
              <span>Generate {formData.platform} Post</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default GeneratorForm;