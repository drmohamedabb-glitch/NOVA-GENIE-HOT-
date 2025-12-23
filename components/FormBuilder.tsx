import React, { useState } from 'react';
import { Plus, Trash2, Copy, GripVertical, CheckSquare, AlignLeft, List, ChevronDown } from 'lucide-react';
import { FormSchema, Question, QuestionType, Option } from '../types';
import { Button } from './Button';

interface FormBuilderProps {
  form: FormSchema;
  setForm: React.Dispatch<React.SetStateAction<FormSchema>>;
}

export const FormBuilder: React.FC<FormBuilderProps> = ({ form, setForm }) => {
  const [activeQuestionId, setActiveQuestionId] = useState<string | null>(null);

  const addQuestion = () => {
    const newQuestion: Question = {
      id: crypto.randomUUID(),
      type: QuestionType.MULTIPLE_CHOICE,
      title: '',
      required: false,
      options: [{ id: crypto.randomUUID(), text: 'Option 1' }],
    };
    setForm(prev => ({ ...prev, questions: [...prev.questions, newQuestion] }));
    setActiveQuestionId(newQuestion.id);
  };

  const updateQuestion = (id: string, updates: Partial<Question>) => {
    setForm(prev => ({
      ...prev,
      questions: prev.questions.map(q => q.id === id ? { ...q, ...updates } : q)
    }));
  };

  const deleteQuestion = (id: string) => {
    setForm(prev => ({
      ...prev,
      questions: prev.questions.filter(q => q.id !== id)
    }));
  };

  const duplicateQuestion = (question: Question) => {
    const newQuestion = { 
      ...question, 
      id: crypto.randomUUID(),
      options: question.options?.map(o => ({ ...o, id: crypto.randomUUID() }))
    };
    setForm(prev => {
      const idx = prev.questions.findIndex(q => q.id === question.id);
      const newQuestions = [...prev.questions];
      newQuestions.splice(idx + 1, 0, newQuestion);
      return { ...prev, questions: newQuestions };
    });
    setActiveQuestionId(newQuestion.id);
  };

  const handleOptionChange = (qId: string, oId: string, text: string) => {
    setForm(prev => ({
      ...prev,
      questions: prev.questions.map(q => {
        if (q.id !== qId) return q;
        return {
          ...q,
          options: q.options?.map(o => o.id === oId ? { ...o, text } : o)
        };
      })
    }));
  };

  const addOption = (qId: string) => {
    setForm(prev => ({
      ...prev,
      questions: prev.questions.map(q => {
        if (q.id !== qId) return q;
        return {
          ...q,
          options: [...(q.options || []), { id: crypto.randomUUID(), text: `Option ${(q.options?.length || 0) + 1}` }]
        };
      })
    }));
  };

  const removeOption = (qId: string, oId: string) => {
    setForm(prev => ({
      ...prev,
      questions: prev.questions.map(q => {
        if (q.id !== qId) return q;
        return {
          ...q,
          options: q.options?.filter(o => o.id !== oId)
        };
      })
    }));
  };

  return (
    <div className="max-w-3xl mx-auto pb-20">
      {/* Form Title Card */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 border-t-8 border-t-purple-600 mb-6 p-6">
        <input
          type="text"
          value={form.title}
          onChange={(e) => setForm(prev => ({ ...prev, title: e.target.value }))}
          className="text-3xl font-bold w-full border-b border-transparent hover:border-slate-200 focus:border-purple-600 focus:outline-none py-2 transition-colors mb-2"
          placeholder="Form Title"
        />
        <input
          type="text"
          value={form.description}
          onChange={(e) => setForm(prev => ({ ...prev, description: e.target.value }))}
          className="text-slate-600 w-full border-b border-transparent hover:border-slate-200 focus:border-purple-600 focus:outline-none py-1 transition-colors text-sm"
          placeholder="Form Description"
        />
      </div>

      {/* Questions List */}
      <div className="space-y-4">
        {form.questions.map((question) => (
          <div 
            key={question.id}
            onClick={() => setActiveQuestionId(question.id)}
            className={`bg-white rounded-lg shadow-sm border transition-all duration-200 relative group
              ${activeQuestionId === question.id 
                ? 'border-l-8 border-l-purple-500 border-y-slate-200 border-r-slate-200 ring-1 ring-purple-100' 
                : 'border-slate-200 border-l-8 border-l-transparent hover:border-l-slate-300'}`}
          >
            {activeQuestionId === question.id ? (
              // Active Editing Mode
              <div className="p-6">
                <div className="flex flex-col md:flex-row gap-4 mb-4">
                  <div className="flex-1 bg-slate-50 rounded-md">
                    <input
                      type="text"
                      value={question.title}
                      onChange={(e) => updateQuestion(question.id, { title: e.target.value })}
                      className="w-full bg-transparent p-4 border-b-2 border-slate-200 focus:border-purple-600 focus:outline-none transition-colors"
                      placeholder="Question"
                      autoFocus
                    />
                  </div>
                  <div className="w-full md:w-64">
                    <div className="relative">
                      <select
                        value={question.type}
                        onChange={(e) => updateQuestion(question.id, { type: e.target.value as QuestionType })}
                        className="w-full appearance-none bg-white border border-slate-300 text-slate-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                      >
                        <option value={QuestionType.SHORT_ANSWER}>Short Answer</option>
                        <option value={QuestionType.PARAGRAPH}>Paragraph</option>
                        <option value={QuestionType.MULTIPLE_CHOICE}>Multiple Choice</option>
                        <option value={QuestionType.CHECKBOXES}>Checkboxes</option>
                        <option value={QuestionType.DROPDOWN}>Dropdown</option>
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-700">
                        <ChevronDown className="h-4 w-4" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Question Type Specific Content */}
                <div className="mb-6 space-y-2">
                  {[QuestionType.MULTIPLE_CHOICE, QuestionType.CHECKBOXES, QuestionType.DROPDOWN].includes(question.type) && (
                    <div className="space-y-2">
                      {question.options?.map((option, idx) => (
                        <div key={option.id} className="flex items-center gap-3 group/option">
                          {question.type === QuestionType.MULTIPLE_CHOICE && <div className="w-4 h-4 rounded-full border-2 border-slate-300" />}
                          {question.type === QuestionType.CHECKBOXES && <div className="w-4 h-4 rounded border-2 border-slate-300" />}
                          {question.type === QuestionType.DROPDOWN && <span className="text-slate-400 text-sm">{idx + 1}.</span>}
                          
                          <input
                            type="text"
                            value={option.text}
                            onChange={(e) => handleOptionChange(question.id, option.id, e.target.value)}
                            className="flex-1 py-1 px-2 border-b border-transparent hover:border-slate-200 focus:border-purple-500 focus:outline-none"
                          />
                          <button 
                            onClick={() => removeOption(question.id, option.id)}
                            className="opacity-0 group-hover/option:opacity-100 text-slate-400 hover:text-red-500 transition-opacity"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                      <div className="flex items-center gap-3 mt-2">
                         {question.type === QuestionType.MULTIPLE_CHOICE && <div className="w-4 h-4 rounded-full border-2 border-slate-200" />}
                         {question.type === QuestionType.CHECKBOXES && <div className="w-4 h-4 rounded border-2 border-slate-200" />}
                         <button 
                            onClick={() => addOption(question.id)}
                            className="text-slate-500 hover:text-purple-600 text-sm font-medium py-1 px-2 rounded hover:bg-slate-50"
                         >
                           Add option
                         </button>
                      </div>
                    </div>
                  )}

                  {question.type === QuestionType.SHORT_ANSWER && (
                     <div className="border-b border-dotted border-slate-300 py-2 w-1/2 text-slate-400 text-sm">Short answer text</div>
                  )}
                  {question.type === QuestionType.PARAGRAPH && (
                     <div className="border-b border-dotted border-slate-300 py-2 w-3/4 text-slate-400 text-sm">Long answer text</div>
                  )}
                </div>

                <div className="border-t border-slate-100 pt-4 flex justify-end items-center gap-4">
                  <button 
                    onClick={() => duplicateQuestion(question)}
                    className="p-2 text-slate-500 hover:bg-slate-50 rounded-full"
                    title="Duplicate"
                  >
                    <Copy className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={() => deleteQuestion(question.id)}
                    className="p-2 text-slate-500 hover:bg-red-50 hover:text-red-500 rounded-full"
                    title="Delete"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                  <div className="h-6 w-px bg-slate-200 mx-2"></div>
                  <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer select-none">
                    <span>Required</span>
                    <div className={`w-10 h-6 rounded-full p-1 transition-colors ${question.required ? 'bg-purple-600' : 'bg-slate-300'}`}
                         onClick={() => updateQuestion(question.id, { required: !question.required })}>
                      <div className={`bg-white w-4 h-4 rounded-full shadow-sm transition-transform ${question.required ? 'translate-x-4' : ''}`} />
                    </div>
                  </label>
                </div>
              </div>
            ) : (
              // Inactive Preview Mode
              <div className="p-6 cursor-pointer">
                <div className="mb-2 text-lg text-slate-800 font-medium">
                  {question.title || <span className="text-slate-400 italic">Untitled Question</span>}
                  {question.required && <span className="text-red-500 ml-1">*</span>}
                </div>
                <div className="text-slate-500">
                  {question.type === QuestionType.SHORT_ANSWER && <div className="border-b border-slate-200 w-1/2 h-6"></div>}
                  {question.type === QuestionType.PARAGRAPH && <div className="border-b border-slate-200 w-full h-6"></div>}
                  {[QuestionType.MULTIPLE_CHOICE, QuestionType.CHECKBOXES].includes(question.type) && (
                    <div className="space-y-2">
                       {question.options?.map(opt => (
                         <div key={opt.id} className="flex items-center gap-2">
                            {question.type === QuestionType.MULTIPLE_CHOICE 
                              ? <div className="w-4 h-4 rounded-full border border-slate-300" />
                              : <div className="w-4 h-4 rounded border border-slate-300" />
                            }
                            <span>{opt.text}</span>
                         </div>
                       ))}
                    </div>
                  )}
                  {question.type === QuestionType.DROPDOWN && (
                    <div className="border border-slate-300 rounded px-3 py-2 w-48 flex justify-between items-center bg-white">
                      <span>Dropdown</span>
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  )}
                </div>
              </div>
            )}
            
            {/* Drag Handle (Visual only) */}
            <div className="absolute top-0 left-0 bottom-0 w-8 flex items-center justify-center opacity-0 group-hover:opacity-50 cursor-move">
               <GripVertical className="w-4 h-4 text-slate-400" />
            </div>
          </div>
        ))}
      </div>

      {/* Add Question Floating Action (or sticky bottom bar) */}
      <div className="fixed bottom-8 right-8 flex flex-col gap-3">
         {/* Could add other quick actions here like 'Add Image', 'Add Section' */}
      </div>

      <div className="mt-6 flex justify-center">
        <button 
          onClick={addQuestion}
          className="p-3 bg-white border border-slate-200 shadow-sm rounded-full text-slate-500 hover:text-purple-600 hover:shadow-md transition-all"
        >
          <Plus className="w-6 h-6" />
        </button>
      </div>

    </div>
  );
};
