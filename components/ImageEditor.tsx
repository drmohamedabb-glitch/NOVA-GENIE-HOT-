import React, { useState, useRef } from 'react';
import { Upload, Wand2, Download, Image as ImageIcon, RefreshCcw, AlertCircle } from 'lucide-react';
import { Button } from './Button';
import { editImageWithGemini } from '../services/geminiService';

export const ImageEditor: React.FC = () => {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError("File size too large. Please select an image under 5MB.");
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (event) => {
        setOriginalImage(event.target?.result as string);
        setGeneratedImage(null);
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEdit = async () => {
    if (!originalImage || !prompt.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      // Extract base64 data and mime type
      const match = originalImage.match(/^data:(.+);base64,(.+)$/);
      if (!match) throw new Error("Invalid image format");

      const mimeType = match[1];
      const base64Data = match[2];

      const result = await editImageWithGemini(base64Data, mimeType, prompt);
      setGeneratedImage(result);
    } catch (err: any) {
      setError(err.message || "Failed to edit image. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = () => {
    if (generatedImage) {
      const link = document.createElement('a');
      link.href = generatedImage;
      link.download = `edited-image-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-100">
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Wand2 className="w-6 h-6 text-purple-600" />
            AI Image Editor
          </h2>
          <p className="text-slate-500 mt-1">
            Upload an image and use natural language to edit it with Gemini 2.5 Flash.
          </p>
        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="space-y-6">
            
            {/* Image Upload Area */}
            <div 
              className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 ${
                originalImage 
                  ? 'border-purple-200 bg-purple-50' 
                  : 'border-slate-300 hover:border-purple-400 hover:bg-slate-50'
              }`}
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              
              {originalImage ? (
                <div className="relative group">
                   <img 
                    src={originalImage} 
                    alt="Original" 
                    className="max-h-64 mx-auto rounded-lg shadow-sm object-contain"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-lg">
                    <p className="text-white font-medium flex items-center gap-2">
                      <RefreshCcw className="w-4 h-4" /> Change Image
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8">
                  <div className="w-16 h-16 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mb-4">
                    <Upload className="w-8 h-8" />
                  </div>
                  <h3 className="text-lg font-medium text-slate-700">Upload an image</h3>
                  <p className="text-sm text-slate-500 mt-2">PNG, JPG up to 5MB</p>
                </div>
              )}
            </div>

            {/* Prompt Input */}
            <div>
              <label htmlFor="prompt" className="block text-sm font-medium text-slate-700 mb-2">
                How should we change this image?
              </label>
              <textarea
                id="prompt"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="e.g., 'Make it look like a pencil sketch', 'Add a sunset in the background', 'Remove the cat'"
                className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none h-24 transition-all"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button 
                onClick={handleEdit} 
                disabled={!originalImage || !prompt}
                isLoading={isLoading}
                className="w-full"
                icon={<Wand2 className="w-4 h-4" />}
              >
                Generate Edit
              </Button>
            </div>

             {error && (
              <div className="p-4 bg-red-50 text-red-700 rounded-lg flex items-start gap-3 text-sm">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <p>{error}</p>
              </div>
            )}
          </div>

          {/* Result Section */}
          <div className="bg-slate-50 rounded-xl border border-slate-200 p-6 flex flex-col h-full min-h-[400px]">
            <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4 flex items-center gap-2">
              <ImageIcon className="w-4 h-4" />
              Result
            </h3>
            
            <div className="flex-1 flex items-center justify-center bg-slate-100 rounded-lg border border-slate-200 border-dashed overflow-hidden relative">
              {isLoading ? (
                <div className="text-center">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-purple-500 border-t-transparent mb-3"></div>
                  <p className="text-slate-500 font-medium animate-pulse">Gemini is thinking...</p>
                </div>
              ) : generatedImage ? (
                <img 
                  src={generatedImage} 
                  alt="Generated" 
                  className="max-w-full max-h-[400px] object-contain shadow-lg rounded-lg"
                />
              ) : (
                <div className="text-center p-8 text-slate-400">
                  <Wand2 className="w-12 h-12 mx-auto mb-3 opacity-20" />
                  <p>Your edited image will appear here</p>
                </div>
              )}
            </div>

            {generatedImage && (
              <div className="mt-4 flex justify-end">
                <Button 
                  onClick={handleDownload}
                  variant="secondary"
                  icon={<Download className="w-4 h-4" />}
                >
                  Download
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};