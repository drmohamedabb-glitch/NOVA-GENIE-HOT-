import React from 'react';
import { FormSchema, QuestionType } from '../types';

interface FormPreviewProps {
  form: FormSchema;
}

export const FormPreview: React.FC<FormPreviewProps> = ({ form }) => {
  return (
    <div className="max-w-3xl mx-auto pb-20">
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 border-t-8 border-t-purple-600 mb-6 p-6">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">{form.title || "Untitled Form"}</h1>
        <p className="text-slate-600 whitespace-pre-wrap">{form.description}</p>
        <div className="mt-4 pt-4 border-t border-slate-100 text-red-600 text-sm">
          * Indicates required question
        </div>
      </div>

      <div className="space-y-4">
        {form.questions.map((question) => (
          <div key={question.id} className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
            <div className="mb-4">
              <span className="text-base text-slate-800 font-medium">{question.title}</span>
              {question.required && <span className="text-red-500 ml-1">*</span>}
            </div>

            <div className="mt-2">
              {question.type === QuestionType.SHORT_ANSWER && (
                <input 
                  type="text" 
                  className="w-full md:w-1/2 border-b border-slate-300 focus:border-purple-600 focus:outline-none py-2 transition-colors placeholder:text-slate-400"
                  placeholder="Your answer"
                />
              )}
              
              {question.type === QuestionType.PARAGRAPH && (
                <textarea 
                  className="w-full border-b border-slate-300 focus:border-purple-600 focus:outline-none py-2 transition-colors placeholder:text-slate-400 resize-none h-24"
                  placeholder="Your answer"
                />
              )}

              {question.type === QuestionType.MULTIPLE_CHOICE && (
                <div className="space-y-3">
                  {question.options?.map(opt => (
                    <label key={opt.id} className="flex items-start gap-3 cursor-pointer group">
                      <div className="flex items-center h-5">
                        <input 
                          type="radio" 
                          name={question.id} 
                          className="w-4 h-4 text-purple-600 border-slate-300 focus:ring-purple-500 cursor-pointer" 
                        />
                      </div>
                      <span className="text-slate-700 group-hover:text-slate-900">{opt.text}</span>
                    </label>
                  ))}
                </div>
              )}

              {question.type === QuestionType.CHECKBOXES && (
                <div className="space-y-3">
                  {question.options?.map(opt => (
                    <label key={opt.id} className="flex items-start gap-3 cursor-pointer group">
                      <div className="flex items-center h-5">
                        <input 
                          type="checkbox" 
                          className="w-4 h-4 text-purple-600 border-slate-300 rounded focus:ring-purple-500 cursor-pointer" 
                        />
                      </div>
                      <span className="text-slate-700 group-hover:text-slate-900">{opt.text}</span>
                    </label>
                  ))}
                </div>
              )}

              {question.type === QuestionType.DROPDOWN && (
                <div className="w-full md:w-1/2">
                  <select className="w-full border border-slate-300 rounded px-3 py-2 text-slate-700 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 bg-white">
                    <option value="" disabled selected>Choose</option>
                    {question.options?.map(opt => (
                      <option key={opt.id} value={opt.text}>{opt.text}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 flex justify-between items-center">
         <button className="bg-purple-600 text-white px-6 py-2 rounded shadow-sm hover:bg-purple-700 font-medium transition-colors">
            Submit
         </button>
         <button className="text-slate-500 text-sm hover:text-purple-600 font-medium">
            Clear form
         </button>
      </div>
    </div>
  );
};