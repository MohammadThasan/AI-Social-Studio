
import React from 'react';
import { FormData, Topic, Tone, Platform } from '../types';
import { TOPICS, TONES } from '../constants';
import { 
  Wand2, Loader2, Link2, Linkedin, Facebook, Twitter, Instagram, BookOpen, 
  ChevronDown, Megaphone, ArrowRightLeft, ListEnd, Hash, Smile,
  Telescope, Scale, ListTodo, BarChart3, Database, BrainCircuit, ShieldCheck, Activity,
  Sparkles, Bot, Cpu, GraduationCap, Briefcase, Coffee, Globe
} from 'lucide-react';

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

  const getTopicIcon = (topic: string) => {
    switch (topic) {
        case 'Generative AI': return <Sparkles className="w-4 h-4 text-indigo-500" />;
        case 'Agentic AI': return <Bot className="w-4 h-4 text-indigo-500" />;
        case 'AI Automation': return <Cpu className="w-4 h-4 text-indigo-500" />;
        case 'AI for Education': return <GraduationCap className="w-4 h-4 text-indigo-500" />;
        case 'AI for professionals': return <Briefcase className="w-4 h-4 text-indigo-500" />;
        case 'AI for Daily life': return <Coffee className="w-4 h-4 text-indigo-500" />;
        case 'Predictive Forecasting': return <BarChart3 className="w-4 h-4 text-indigo-500" />;
        case 'Generative BI & Chat-with-Data': return <BrainCircuit className="w-4 h-4 text-indigo-500" />;
        case 'Autonomous Data Agents': return <Activity className="w-4 h-4 text-indigo-500" />;
        case 'Data Privacy in Analytics': return <ShieldCheck className="w-4 h-4 text-indigo-500" />;
        default: return <Database className="w-4 h-4 text-indigo-500" />;
    }
  };

  const PLATFORM_CONFIG: { id: Platform; label: string; icon: React.ReactNode }[] = [
    { id: 'LinkedIn', label: 'LinkedIn', icon: <Linkedin className="w-4 h-4" /> },
    { id: 'X (Twitter)', label: 'X', icon: <Twitter className="w-4 h-4" /> },
    { id: 'Medium', label: 'Medium', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'Instagram', label: 'Insta', icon: <Instagram className="w-4 h-4" /> },
    { id: 'Facebook', label: 'Facebook', icon: <Facebook className="w-4 h-4" /> },
  ];

  const OPTIONS_CONFIG = [
    { key: 'includeEmoji', label: 'Use Emojis', icon: <Smile className="w-3.5 h-3.5 text-amber-500" /> },
    { key: 'includeHashtags', label: 'Include Hashtags', icon: <Hash className="w-3.5 h-3.5 text-blue-500" /> },
    { key: 'comparisonFormat', label: 'Before vs After', icon: <ArrowRightLeft className="w-3.5 h-3.5 text-indigo-500" /> },
    { key: 'includeCTA', label: 'Strong CTA', icon: <Megaphone className="w-3.5 h-3.5 text-red-500" /> },
    { key: 'tldrSummary', label: 'TL;DR Summary', icon: <ListEnd className="w-3.5 h-3.5 text-emerald-500" /> },
    { key: 'includeFutureOutlook', label: 'Future Outlook', icon: <Telescope className="w-3.5 h-3.5 text-purple-500" /> },
    { key: 'includeDevilsAdvocate', label: "Devil's Advocate", icon: <Scale className="w-3.5 h-3.5 text-orange-500" /> },
    { key: 'includeImplementationSteps', label: 'Action Plan', icon: <ListTodo className="w-3.5 h-3.5 text-cyan-500" /> }
  ];

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 flex flex-col transition-colors duration-300">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">AI Analytics Studio</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Configure your industry-specific content.</p>
      </div>

      <div className="space-y-6 flex-grow">
        <div>
           <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-3">Target Platform</label>
           <div className="grid grid-cols-5 gap-2">
             {PLATFORM_CONFIG.map((p) => {
               const isSelected = formData.platform === p.id;
               return (
                <button
                  key={p.id}
                  onClick={() => handleChange('platform', p.id)}
                  className={`flex flex-col items-center justify-center p-2 rounded-lg border transition-all duration-200 ${
                    isSelected
                      ? `border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300 ring-1 ring-indigo-600`
                      : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-850 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                  }`}
                  title={p.label}
                >
                  {p.icon}
                </button>
               );
             })}
           </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-3">Analytics Domain</label>
          <div className="space-y-3">
            <div className="relative">
              <select
                value={formData.topic}
                onChange={(e) => handleChange('topic', e.target.value as Topic)}
                className="w-full appearance-none rounded-lg border-slate-200 dark:border-slate-800 border bg-slate-50 dark:bg-slate-850 px-10 py-2.5 text-slate-900 dark:text-white text-sm font-medium focus:border-indigo-500 outline-none"
              >
                {TOPICS.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
              <div className="absolute inset-y-0 left-0 flex items-center px-3 pointer-events-none">
                {getTopicIcon(formData.topic)}
              </div>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-400">
                <ChevronDown className="w-4 h-4" />
              </div>
            </div>
            
            {formData.topic === 'Custom' && (
              <input
                type="text"
                value={formData.customTopic}
                onChange={(e) => handleChange('customTopic', e.target.value)}
                placeholder="E.g. Scalable LLM Observability..."
                className="w-full rounded-lg border-slate-200 dark:border-slate-800 border px-3 py-2.5 text-slate-900 dark:text-white text-sm bg-white dark:bg-slate-900 focus:border-indigo-500"
              />
            )}
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-3">Perspective (Tone)</label>
          <div className="grid grid-cols-2 gap-2">
            {TONES.map((tone) => (
              <button
                key={tone.value}
                onClick={() => handleChange('tone', tone.value)}
                className={`text-left px-3 py-2.5 rounded-lg border text-sm transition-all ${
                  formData.tone === tone.value
                    ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20 ring-1 ring-indigo-600'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-850 text-slate-700 dark:text-slate-300'
                }`}
              >
                <div className="font-bold text-xs">{tone.label}</div>
                <div className="text-[10px] mt-0.5 leading-tight opacity-60 truncate">{tone.description}</div>
              </button>
            ))}
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
           <div className="grid grid-cols-1 gap-1">
             {OPTIONS_CONFIG.map((opt) => (
               <label key={opt.key} className="flex items-center justify-between p-2 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-lg cursor-pointer transition-colors group">
                <span className="text-xs font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
                   {opt.icon}
                   {opt.label}
                </span>
                <input 
                  type="checkbox" 
                  checked={(formData as any)[opt.key]}
                  onChange={(e) => handleChange(opt.key as any, e.target.checked)}
                  className="h-3.5 w-3.5 rounded border-slate-300 text-indigo-600"
                />
              </label>
             ))}
           </div>
        </div>
      </div>

      <div className="mt-8 pt-4 border-t border-slate-100 dark:border-slate-800">
        <button
          onClick={onSubmit}
          disabled={isLoading || (formData.topic === 'Custom' && !formData.customTopic.trim())}
          className="w-full flex items-center justify-center space-x-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 px-4 py-3 text-sm font-bold text-white shadow-lg transition-all disabled:opacity-50"
        >
          {isLoading ? (
            <><Loader2 className="w-4 h-4 animate-spin" /><span>Processing Analytics...</span></>
          ) : (
            <><Wand2 className="w-4 h-4" /><span>Generate Pro Post</span></>
          )}
        </button>
      </div>
    </div>
  );
};

export default GeneratorForm;
