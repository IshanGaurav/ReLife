import React, { useState, useRef, useEffect } from 'react';
import { UploadCloud, CheckCircle, ArrowRight, Camera, FileText, Settings, X, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Upload() {
  const [step, setStep] = useState(1);
  const [productName, setProductName] = useState('');
  const [files, setFiles] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [loadingPhase, setLoadingPhase] = useState(0);
  const loadingMessages = [
    "Analyzing Product...",
    "Inspecting Damage...",
    "Calculating Condition Score...",
    "Generating Product Passport..."
  ];
  const [result, setResult] = useState(null);
  const navigate = useNavigate();

  const onDragOver = (e) => { e.preventDefault(); setIsDragging(true); };
  const onDragLeave = () => setIsDragging(false);
  const onDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleFiles = (selectedFiles) => {
    const validFormats = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
    const validFiles = selectedFiles.filter(file => validFormats.includes(file.type));
    if (validFiles.length !== selectedFiles.length) {
      alert('Some files were rejected. Only JPG, PNG, and WEBP formats are supported.');
    }
    const newFiles = validFiles.map(file => ({
      file,
      id: Math.random().toString(36).substring(7),
      previewUrl: URL.createObjectURL(file),
      size: (file.size / (1024 * 1024)).toFixed(2) + ' MB'
    }));
    setFiles(prev => [...prev, ...newFiles]);
  };

  const removeFile = (id) => setFiles(files.filter(f => f.id !== id));

  useEffect(() => {
    return () => files.forEach(f => URL.revokeObjectURL(f.previewUrl));
  }, []);

  const simulateUpload = () => {
    if (files.length === 0) {
      alert("Please upload at least one photo.");
      return;
    }
    setIsAnalyzing(true);
    setLoadingPhase(0);
    let currentPhase = 0;
    const interval = setInterval(() => {
      currentPhase++;
      if (currentPhase < loadingMessages.length) {
        setLoadingPhase(currentPhase);
      } else {
        clearInterval(interval);
        setIsAnalyzing(false);
        setResult({
          score: 82,
          disposition: 'Refurbish',
          reasoning: 'Minor cosmetic scratches on the back casing, but functionally intact. Meets threshold for official refurbishment program.',
          scratches: 3,
          damage: 'Back casing scuff, worn charging port edges.',
          missingComponents: 'None',
          expectedLifespan: '2-3 Years',
          credits: 50,
          model: productName || 'Amazon Echo Dot (4th Gen)'
        });
        setStep(2);
      }
    }, 1500);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 animate-fade-in">
      
      {/* Amazon-style Breadcrumbs */}
      <div className="text-sm text-[#007185] hover:text-[#C7511F] mb-6 cursor-pointer hover:underline flex items-center">
        &lsaquo; Back to Amazon ReLife Hub
      </div>

      <div className="bg-white border border-[#D5D9D9] rounded-lg shadow-sm overflow-hidden">
        
        {/* Step Tracker (Amazon Trade-in Style) */}
        <div className="bg-[#F3F3F3] px-8 py-4 border-b border-[#D5D9D9] flex items-center justify-between">
          <h1 className="text-2xl font-bold text-[#0F1111]">Sell an Item / Trade-in</h1>
          <div className="flex items-center space-x-2 text-sm font-bold text-[#565959]">
            <span className={step === 1 ? 'text-[#C7511F]' : ''}>1. Product Details</span>
            <span>&rsaquo;</span>
            <span className={step === 2 ? 'text-[#C7511F]' : ''}>2. AI Evaluation</span>
            <span>&rsaquo;</span>
            <span className={step === 3 ? 'text-[#C7511F]' : ''}>3. Review & List</span>
          </div>
        </div>

        <div className="p-8">
          {step === 1 && (
            <div className="max-w-2xl animate-fade-in">
              <h2 className="text-xl font-bold text-[#0F1111] mb-2">What device are you trading in or selling?</h2>
              <p className="text-sm text-[#565959] mb-6">Our Generative AI will analyze your photos to determine condition, estimate value, and generate a Digital Product Passport.</p>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-[#0F1111] mb-1">Product Category & Model</label>
                  <input 
                    type="text" 
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                    className="w-full border border-[#888C8C] rounded-md px-3 py-2 shadow-sm focus:border-[#007185] focus:ring-1 focus:ring-[#007185] outline-none transition-shadow" 
                    placeholder="e.g. iPhone 12 Pro, 256GB" 
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-bold text-[#0F1111] mb-1">Upload Device Photos</label>
                  <p className="text-xs text-[#565959] mb-2">Include front, back, and close-ups of any visible scratches or damage.</p>
                  
                  <input 
                    type="file" 
                    multiple 
                    accept="image/png, image/jpeg, image/jpg, image/webp"
                    className="hidden" 
                    ref={fileInputRef}
                    onChange={(e) => handleFiles(Array.from(e.target.files))}
                  />

                  <div 
                    onDragOver={onDragOver}
                    onDragLeave={onDragLeave}
                    onDrop={onDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-lg p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all ${isDragging ? 'border-[#007185] bg-[#F7FAFA]' : 'border-[#D5D9D9] hover:bg-[#F7FAFA]'}`}
                  >
                    <UploadCloud className="w-10 h-10 text-[#565959] mb-2" />
                    <p className="font-bold text-[#0F1111]">Drag and drop images here</p>
                    <p className="text-sm text-[#007185]">or click to browse</p>
                  </div>

                  {files.length > 0 && (
                    <div className="grid grid-cols-3 md:grid-cols-5 gap-3 mt-4">
                      {files.map((fileObj) => (
                        <div key={fileObj.id} className="relative group rounded-md border border-[#D5D9D9] p-1">
                          <img src={fileObj.previewUrl} alt="Preview" className="w-full h-20 object-contain bg-[#F3F3F3]" />
                          <button 
                            onClick={(e) => { e.stopPropagation(); removeFile(fileObj.id); }}
                            className="absolute -top-2 -right-2 bg-white border border-[#D5D9D9] rounded-full p-0.5 shadow-sm hover:bg-gray-100"
                          >
                            <X className="w-3 h-3 text-[#0F1111]" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="pt-6 border-t border-[#D5D9D9]">
                  <button 
                    onClick={simulateUpload}
                    disabled={isAnalyzing || files.length === 0}
                    className="bg-[#FFD814] hover:bg-[#F7CA00] border border-[#FCD200] rounded-lg px-6 py-2 font-bold text-[#0F1111] shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                  >
                    {isAnalyzing ? (
                      <>
                        <div className="w-4 h-4 border-2 border-[#0F1111] border-t-transparent rounded-full animate-spin mr-2"></div>
                        {loadingMessages[loadingPhase]}
                      </>
                    ) : (
                      'Continue to AI Inspection'
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

          {step === 2 && result && (
            <div className="animate-fade-in max-w-4xl">
              <div className="flex items-center space-x-3 mb-6">
                <CheckCircle className="w-8 h-8 text-[#16a34a]" />
                <h2 className="text-2xl font-bold text-[#0F1111]">Analysis Complete: {result.model}</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                <div className="md:col-span-1">
                  <div className="bg-[#F7FAFA] border border-[#D5D9D9] p-6 rounded-lg text-center h-full">
                    <p className="text-sm font-bold text-[#565959] uppercase tracking-wider mb-2">Condition Score</p>
                    <p className="text-6xl font-extrabold text-[#0F1111] mb-4">{result.score}<span className="text-2xl text-[#565959]">/100</span></p>
                    <div className="inline-block bg-[#E7F4F5] text-[#007185] font-bold px-4 py-1.5 rounded-full border border-[#99D2D9]">
                      {result.disposition}
                    </div>
                  </div>
                </div>

                <div className="md:col-span-2 space-y-4">
                  <div className="border border-[#D5D9D9] rounded-lg overflow-hidden">
                    <div className="bg-[#F3F3F3] px-4 py-2 border-b border-[#D5D9D9] font-bold text-[#0F1111]">
                      AI Inspection Report
                    </div>
                    <div className="p-4 bg-white grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-[#565959] uppercase font-bold">Expected Lifespan</p>
                        <p className="font-bold text-[#0F1111]">{result.expectedLifespan}</p>
                      </div>
                      <div>
                        <p className="text-xs text-[#565959] uppercase font-bold">Scratches Detected</p>
                        <p className="font-bold text-[#0F1111]">{result.scratches}</p>
                      </div>
                      <div className="col-span-2 mt-2">
                        <p className="text-xs text-[#C7511F] uppercase font-bold flex items-center"><Settings className="w-3 h-3 mr-1" /> Damage Analysis</p>
                        <p className="text-[#0F1111] text-sm mt-1">{result.damage} Missing: {result.missingComponents}</p>
                      </div>
                    </div>
                  </div>

                  <div className="border border-[#D5D9D9] rounded-lg overflow-hidden">
                    <div className="bg-[#EFFFF3] px-4 py-3 flex items-center justify-between border-b border-[#B8E2C4]">
                      <div className="flex items-center text-[#16a34a] font-bold">
                        <ShieldCheck className="w-5 h-5 mr-2" /> Digital Passport Ready
                      </div>
                      <span className="font-bold text-[#16a34a]">+{result.credits} Credits</span>
                    </div>
                    <div className="p-4 bg-white">
                      <p className="text-sm text-[#0F1111] mb-4">By continuing, your item will be minted on the ReLife ledger and automatically listed for {result.disposition.toLowerCase()}.</p>
                      <div className="flex space-x-3">
                        <button onClick={() => navigate('/relife/product/up-2')} className="bg-[#FFD814] hover:bg-[#F7CA00] border border-[#FCD200] rounded-lg px-6 py-2 font-bold text-[#0F1111] shadow-sm">
                          Confirm & List Item
                        </button>
                        <button onClick={() => navigate('/relife/passport/up-2')} className="bg-white hover:bg-gray-50 border border-[#D5D9D9] rounded-lg px-4 py-2 font-bold text-[#0F1111] shadow-sm flex items-center">
                          <ShieldCheck className="w-4 h-4 mr-2 text-[#007185]" /> View Passport
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
