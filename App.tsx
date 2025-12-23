import React, { useState } from 'react';
import { FormBuilder } from './components/FormBuilder';
import { FormPreview } from './components/FormPreview';
import { ImageEditor } from './components/ImageEditor';
import { AppView, FormSchema, QuestionType } from './types';
import { FileEdit, Eye, Image as ImageIcon, LayoutList } from 'lucide-react';

const App: React.FC = () => {
  const [view, setView] = useState<AppView>(AppView.FORM_BUILDER);
  
  const [form, setForm] = useState<FormSchema>({
    id: '1',
    title: 'Untitled Form',
    description: '',
    questions: [
      {
        id: 'q1',
        type: QuestionType.MULTIPLE_CHOICE,
        title: 'Untitled Question',
        required: false,
        options: [{ id: 'o1', text: 'Option 1' }]
      }
    ]
  });

  return (
    <div className="min-h-screen flex flex-col bg-slate-100 font-sans">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="bg-purple-600 p-2 rounded text-white">
                <LayoutList className="w-5 h-5" />
              </div>
              <span className="font-semibold text-xl text-slate-800 hidden sm:block">FormGenie</span>
              <span className="text-slate-300 text-2xl font-light hidden sm:block">|</span>
              <span className="text-slate-600 truncate max-w-[150px] sm:max-w-xs">{form.title}</span>
            </div>

            <nav className="flex items-center gap-2 sm:gap-4 bg-slate-100 p-1 rounded-lg">
              <button
                onClick={() => setView(AppView.FORM_BUILDER)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                  view === AppView.FORM_BUILDER 
                    ? 'bg-white text-purple-700 shadow-sm' 
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                <FileEdit className="w-4 h-4" />
                <span className="hidden sm:inline">Builder</span>
              </button>
              <button
                onClick={() => setView(AppView.FORM_PREVIEW)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                  view === AppView.FORM_PREVIEW 
                    ? 'bg-white text-purple-700 shadow-sm' 
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                <Eye className="w-4 h-4" />
                <span className="hidden sm:inline">Preview</span>
              </button>
              <button
                onClick={() => setView(AppView.IMAGE_EDITOR)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                  view === AppView.IMAGE_EDITOR 
                    ? 'bg-white text-purple-700 shadow-sm' 
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                <ImageIcon className="w-4 h-4" />
                <span className="hidden sm:inline">AI Image Editor</span>
              </button>
            </nav>

            <div className="hidden sm:flex items-center gap-2">
               <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 font-bold text-xs border border-purple-200">
                  JS
               </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto py-8 px-4 sm:px-6">
        {view === AppView.FORM_BUILDER && (
          <FormBuilder form={form} setForm={setForm} />
        )}
        {view === AppView.FORM_PREVIEW && (
          <FormPreview form={form} />
        )}
        {view === AppView.IMAGE_EDITOR && (
          <ImageEditor />
        )}
      </main>
    </div>
  );
};

export default App;