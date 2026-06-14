import React, { useState, useRef, useEffect } from 'react';
import { UploadCloud, CheckCircle, ArrowRight, Camera, FileText, Settings, X, ShieldCheck, ShoppingBag, Info, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getMyOrdersApi, submitCircularActionApi, uploadImagesApi, inspectImageWithAIApi } from '../../api/client';
import { useAuth } from '../../context/AuthContext';

export default function ResellerProducts() {
  const { updateUser } = useAuth();
  const [step, setStep] = useState(1);
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  
  // Step 2 state
  const [files, setFiles] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);
  
  // AI State
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [loadingPhase, setLoadingPhase] = useState(0);
  const loadingMessages = [
    "Analyzing Photos...",
    "Inspecting Damage & Cosmetics...",
    "Generating Digital Passport...",
    "Verifying Amazon Origin..."
  ];
  const [result, setResult] = useState(null);
  
  // Submit state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [successAction, setSuccessAction] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    // Fetch Amazon purchase history
    const fetchOrders = async () => {
      try {
        const response = await getMyOrdersApi();
        if (response && response.orders) {
          // Flatten all AmazonProduct items from all orders into a single list
          let purchasedItems = [];
          response.orders.forEach(order => {
            order.items.forEach(item => {
              // Process all item types
              // Status logic based on real resaleStatus
              const orderDate = new Date(order.createdAt);
              const ageInYears = (new Date() - orderDate) / (1000 * 60 * 60 * 24 * 365.25);
              
              let status = item.resaleStatus || 'not_listed';

              purchasedItems.push({
                ...item,
                orderId: order._id,
                orderDate: order.createdAt,
                status,
                ageInYears
              });
            });
          });
          
          // Add a dummy order if empty so the user can test the flow
          if (purchasedItems.length === 0) {
            purchasedItems.push({
              _id: 'dummy-1',
              name: 'Apple iPhone 15 Pro, 256GB',
              price: 134900,
              image: 'https://m.media-amazon.com/images/I/81SigpJN1KL._SX679_.jpg',
              orderId: 'AMZ-8829-112',
              orderDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 180).toISOString(),
              status: 'not_listed',
              ageInYears: 0.5
            });
            purchasedItems.push({
              _id: 'dummy-2',
              name: 'Sony WH-1000XM5',
              price: 29990,
              image: 'https://m.media-amazon.com/images/I/61vJtKbAssL._SX679_.jpg',
              orderId: 'AMZ-9938-221',
              orderDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 60).toISOString(),
              status: 'listed',
              ageInYears: 0.1
            });
          }

          setOrders(purchasedItems);
        }
      } catch (error) {
        console.error("Failed to fetch orders:", error);
      } finally {
        setLoadingOrders(false);
      }
    };
    fetchOrders();
  }, []);

  const handleSelectOrder = (order) => {
    if (order.status === 'not_listed') {
      setSelectedOrder(order);
      setStep(2);
    }
  };

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
    const newFiles = selectedFiles.map(file => ({
      file,
      id: Math.random().toString(36).substring(7),
      previewUrl: URL.createObjectURL(file)
    }));
    setFiles(prev => [...prev, ...newFiles]);
  };

  const removeFile = (id) => setFiles(files.filter(f => f.id !== id));

  const [aiError, setAiError] = useState(null);

  const startAIInspection = async () => {
    if (files.length === 0) {
      alert("Please upload at least one photo.");
      return;
    }
    setAiError(null);
    setSubmitError(null);
    setIsAnalyzing(true);
    setLoadingPhase(0);
    
    // Animate loading text just for UX
    let currentPhase = 0;
    const interval = setInterval(() => {
      currentPhase++;
      if (currentPhase < loadingMessages.length) {
        setLoadingPhase(currentPhase);
      } else {
        clearInterval(interval);
      }
    }, 1500);

    try {
      // Send the first file to AI service
      const aiResponse = await inspectImageWithAIApi(files[0].file);
      clearInterval(interval);
      setIsAnalyzing(false);
      
      const aiData = aiResponse.data;
      const discount = aiData.discount || 0;
      setResult({
        score: aiData.score,
        disposition: aiData.disposition,
        reasoning: aiData.reasoning,
        suggestedPrice: selectedOrder ? Math.floor(selectedOrder.price * (1 - discount / 100)) : 48500,
        scratches: aiData.scratches,
        damage: aiData.damage,
        expectedLifespan: aiData.expectedLifespan,
        model: selectedOrder?.name || 'Unknown Product',
        rawTelemetry: aiData.rawTelemetry,
        suggestedAction: aiData.suggestedAction
      });
      setStep(3);
    } catch (error) {
      clearInterval(interval);
      setIsAnalyzing(false);
      setAiError(error.message || "Failed to inspect image.");
    }
  };

  const handleAction = async (actionType) => {
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      let sellerImages = [];
      if (files && files.length > 0 && actionType === 'RESELL') {
        const fileObjects = files.map(f => f.file);
        sellerImages = await uploadImagesApi(fileObjects);
      }

      const payload = {
        sourceOrderId: selectedOrder.orderId,
        sourceItemId: selectedOrder._id,
        actionType,
        modelName: selectedOrder.name,
        originalPrice: selectedOrder.price,
        healthScore: result.score,
        conditionLabel: result.disposition,
        suggestedPrice: result.suggestedPrice,
        confidence: result.rawTelemetry?.confidence,
        damagePercentage: result.rawTelemetry?.damagePercentage,
        recommendation: result.suggestedAction,
        image: selectedOrder.image,
        category: 'Electronics', // Mock category
        sellerImages
      };
      const response = await submitCircularActionApi(payload);
      if (response.user) updateUser(response.user);
      setSuccessAction({ type: actionType, credits: response.creditsEarned });
      setStep(4);
    } catch (error) {
      setSubmitError(error.message || "Failed to process action. You may have already claimed this item.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 animate-fade-in">
      <div className="text-sm text-[#007185] hover:text-[#C7511F] mb-6 cursor-pointer hover:underline flex items-center">
        &lsaquo; Back to Amazon ReLife Hub
      </div>

      <div className="bg-white border border-[#D5D9D9] rounded-lg shadow-sm overflow-hidden">
        {/* Step Tracker */}
        <div className="bg-[#F3F3F3] px-8 py-4 border-b border-[#D5D9D9] flex items-center justify-between">
          <h1 className="text-2xl font-bold text-[#0F1111]">My ReLife Products</h1>
          <div className="flex items-center space-x-2 text-sm font-bold text-[#565959]">
            <span className={step === 1 ? 'text-[#C7511F]' : ''}>1. Purchase History</span>
            <span>&rsaquo;</span>
            <span className={step === 2 ? 'text-[#C7511F]' : ''}>2. Product Details</span>
            <span>&rsaquo;</span>
            <span className={step === 3 ? 'text-[#C7511F]' : ''}>3. Decision Hub</span>
          </div>
        </div>

        <div className="p-8">
          {/* STEP 1: Purchase History */}
          {step === 1 && (
            <div className="animate-fade-in">
              <div className="flex items-start mb-6 bg-blue-50 border border-blue-200 p-4 rounded-lg">
                <Info className="w-6 h-6 text-blue-600 mr-3 flex-shrink-0" />
                <div>
                  <h3 className="font-bold text-[#0F1111]">Verified Amazon Purchases Only</h3>
                  <p className="text-sm text-[#565959] mt-1">To maintain trust and generate accurate Digital Passports, you can only list items on ReLife that were originally purchased from Amazon and are currently in your order history.</p>
                </div>
              </div>

              <h2 className="text-xl font-bold text-[#0F1111] mb-6">Select an item to sell</h2>
              
              {loadingOrders ? (
                <div className="flex justify-center p-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FF9900]"></div>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((order, idx) => (
                    <div key={idx} className={`border rounded-lg p-4 flex flex-col md:flex-row items-center justify-between ${order.status === 'not_listed' ? 'border-[#D5D9D9] hover:border-[#FF9900] bg-white' : 'border-gray-200 bg-gray-50 opacity-75'}`}>
                      <div className="flex items-center w-full md:w-auto mb-4 md:mb-0">
                        <img src={order.image || 'https://via.placeholder.com/150'} alt={order.name} className="w-20 h-20 object-contain mix-blend-multiply bg-white border border-gray-100 rounded p-1 mr-6" />
                        <div>
                          <h3 className="font-bold text-[#0F1111] text-lg">{order.name}</h3>
                          <div className="flex items-center text-sm text-[#565959] mt-1 space-x-4">
                            <span><strong className="text-[#0F1111]">Purchased:</strong> {new Date(order.orderDate).toLocaleDateString()}</span>
                            <span><strong className="text-[#0F1111]">Price:</strong> ₹{order.price?.toLocaleString()}</span>
                            <span><strong className="text-[#0F1111]">Order ID:</strong> #{order.orderId || 'AMZ-12345'}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex-shrink-0 w-full md:w-auto text-right">
                        {order.status === 'not_listed' ? (
                          <button 
                            onClick={() => handleSelectOrder(order)}
                            className="w-full md:w-auto bg-[#FFD814] hover:bg-[#F7CA00] border border-[#FCD200] rounded-full px-6 py-2 font-bold text-[#0F1111] shadow-sm transition-colors"
                          >
                            Start Analysis
                          </button>
                        ) : order.status === 'listed' ? (
                          <div className="flex flex-col items-end">
                            <span className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-bold mb-2 uppercase">
                              Listed
                            </span>
                            <button 
                              onClick={() => navigate('/reseller/listings')}
                              className="w-full md:w-auto bg-white hover:bg-gray-50 border border-[#D5D9D9] rounded-full px-6 py-2 font-bold text-[#0F1111] shadow-sm transition-colors"
                            >
                              View Listing
                            </button>
                          </div>
                        ) : order.status === 'sold' ? (
                          <span className="inline-flex items-center px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-bold uppercase">
                            Sold
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-4 py-2 bg-gray-200 text-gray-700 rounded-full text-sm font-bold">
                            {order.status}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                  
                  {orders.length === 0 && (
                    <div className="text-center p-12 border border-[#D5D9D9] rounded-lg">
                      <ShoppingBag className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="font-bold text-lg">No eligible orders found</h3>
                      <p className="text-[#565959] mt-2">You don't have any Amazon purchases eligible for ReLife.</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* STEP 2: Photo Upload */}
          {step === 2 && selectedOrder && (
            <div className="max-w-4xl animate-fade-in">
              <button onClick={() => setStep(1)} className="text-sm text-[#007185] hover:underline mb-6 block">&lsaquo; Change Selected Item</button>
              
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-8 flex items-start">
                <img src={selectedOrder.image} alt={selectedOrder.name} className="w-24 h-24 object-contain mix-blend-multiply bg-white border border-gray-200 p-2 rounded mr-6" />
                <div>
                  <h2 className="text-xl font-bold text-[#0F1111] mb-2">{selectedOrder.name}</h2>
                  <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm">
                    <p><span className="text-[#565959]">Original Purchase Date:</span> <strong className="text-[#0F1111]">{new Date(selectedOrder.orderDate).toLocaleDateString()}</strong></p>
                    <p><span className="text-[#565959]">Original Price:</span> <strong className="text-[#0F1111]">₹{selectedOrder.price?.toLocaleString()}</strong></p>
                    <p><span className="text-[#565959]">Warranty Status:</span> <strong className="text-yellow-600">Expired</strong></p>
                    <p className="flex items-center text-green-700 font-bold"><ShieldCheck className="w-4 h-4 mr-1"/> Amazon Origin Verified</p>
                  </div>
                </div>
              </div>

              <h3 className="text-lg font-bold text-[#0F1111] mb-4">Upload Condition Photos</h3>
              <p className="text-sm text-[#565959] mb-6">Our Generative AI will analyze these photos to determine your Condition Score and Suggested Price.</p>

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
                className={`border-2 border-dashed rounded-lg p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all ${isDragging ? 'border-[#007185] bg-[#F7FAFA]' : 'border-[#D5D9D9] hover:bg-[#F7FAFA]'} mb-4`}
              >
                <UploadCloud className="w-10 h-10 text-[#565959] mb-2" />
                <p className="font-bold text-[#0F1111]">Drag and drop images here</p>
                <p className="text-sm text-[#007185]">or click to browse</p>
              </div>

              {files.length > 0 && (
                <div className="grid grid-cols-3 md:grid-cols-5 gap-3 mb-8">
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

              {aiError && (
                <div className="mb-4 bg-red-50 text-red-700 p-4 rounded border border-red-200 font-bold flex items-center">
                  <AlertTriangle className="w-5 h-5 mr-2" />
                  {aiError}
                </div>
              )}

              <div className="pt-6 border-t border-[#D5D9D9] flex justify-end">
                <button 
                  onClick={startAIInspection}
                  disabled={isAnalyzing || files.length === 0}
                  className="bg-[#FFD814] hover:bg-[#F7CA00] border border-[#FCD200] rounded-full px-8 py-2.5 font-bold text-[#0F1111] shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  {isAnalyzing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-[#0F1111] border-t-transparent rounded-full animate-spin mr-2"></div>
                      {loadingMessages[loadingPhase]}
                    </>
                  ) : (
                    'Generate AI Passport & Condition'
                  )}
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Circular Economy Decision Hub */}
          {step === 3 && result && (
            <div className="animate-fade-in max-w-5xl">
              <div className="flex items-center space-x-3 mb-6 bg-green-50 p-4 rounded-lg border border-green-200">
                <CheckCircle className="w-8 h-8 text-[#16a34a]" />
                <div>
                  <h2 className="text-xl font-bold text-[#0F1111]">Analysis Complete & Passport Generated</h2>
                  <p className="text-green-700 text-sm flex items-center mt-1 font-bold"><ShieldCheck className="w-4 h-4 mr-1"/> ✓ Amazon Verified Purchase Origin Attached</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-[#F7FAFA] border border-[#D5D9D9] p-4 rounded-lg text-center">
                  <p className="text-xs font-bold text-[#565959] uppercase tracking-wider mb-1">Health Score</p>
                  <p className="text-4xl font-extrabold text-[#0F1111]">{result.score}<span className="text-lg text-[#565959]">/100</span></p>
                  <div className="text-[10px] text-[#565959] mt-1 font-mono">100 - {result.rawTelemetry?.damagePercentage?.toFixed(0) || 0}% Damage</div>
                  <div className="mt-2 text-sm text-[#007185] font-bold">{result.disposition}</div>
                </div>
                <div className="bg-[#F7FAFA] border border-[#D5D9D9] p-4 rounded-lg flex flex-col justify-center">
                  <p className="text-xs text-[#565959] uppercase font-bold mb-1">Expected Lifespan</p>
                  <p className="font-bold text-[#0F1111]">{result.expectedLifespan}</p>
                </div>
                <div className="bg-[#F7FAFA] border border-[#D5D9D9] p-4 rounded-lg flex flex-col justify-center">
                  <p className="text-xs text-[#565959] uppercase font-bold mb-1">Purchase Date</p>
                  <p className="font-bold text-[#0F1111]">{new Date(selectedOrder?.orderDate).toLocaleDateString()}</p>
                </div>
                <div className="bg-[#F7FAFA] border border-[#D5D9D9] p-4 rounded-lg flex flex-col justify-center">
                  <p className="text-xs text-[#565959] uppercase font-bold mb-1">Suggested Price</p>
                  <p className="font-bold text-[#B12704] text-xl">₹{result.suggestedPrice?.toLocaleString()}</p>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-2xl font-bold text-[#0F1111]">Choose Your Impact</h3>
                <p className="text-[#565959] mt-1">Select how you want to extend the life of your product. Earn Green Credits for sustainable choices.</p>
              </div>

              {submitError && (
                <div className="mb-6 bg-red-50 text-red-700 p-4 rounded border border-red-200 font-bold flex items-center">
                  <AlertTriangle className="w-5 h-5 mr-2" />
                  {submitError}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Action 1: Resell */}
                <div title={result.score < 80 ? "Health Score must be ≥ 80" : ""} className={`border ${result.suggestedAction === 'RESELL' ? 'border-[#FF9900] bg-yellow-50' : 'border-[#D5D9D9] bg-white'} ${result.score < 80 ? 'opacity-70 bg-gray-50' : 'hover:border-[#FF9900]'} rounded-lg p-6 flex flex-col h-full transition-colors relative overflow-hidden`}>
                  {result.suggestedAction === 'RESELL' && <div className="absolute top-0 right-0 bg-[#FF9900] text-white text-[10px] font-bold px-2 py-1 rounded-bl-lg">AI Recommended</div>}
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-bold text-lg text-[#0F1111]">Resell on ReLife</h4>
                    <span className="bg-green-100 text-green-800 text-xs font-bold px-2 py-1 rounded-full">+35 Credits</span>
                  </div>
                  <p className="text-sm text-[#565959] mb-4 flex-1">List the product directly on the Amazon ReLife marketplace.</p>
                  <ul className="text-sm space-y-2 mb-6 text-[#0F1111]">
                    <li className="flex items-center"><CheckCircle className="w-4 h-4 text-[#16a34a] mr-2"/> Receive money from buyer</li>
                    <li className="flex items-center"><CheckCircle className="w-4 h-4 text-[#16a34a] mr-2"/> Amazon Verified Badge</li>
                  </ul>
                  {result.score < 80 && <div className="text-xs text-red-600 mb-2 font-bold flex items-center"><Info className="w-3 h-3 mr-1"/> Health Score must be ≥ 80</div>}
                  <button 
                    disabled={isSubmitting || result.score < 80}
                    onClick={() => handleAction('RESELL')}
                    className={`w-full bg-[#FFD814] hover:bg-[#F7CA00] border border-[#FCD200] rounded-full py-2 font-bold text-[#0F1111] shadow-sm disabled:opacity-50 ${result.score < 80 ? 'cursor-not-allowed' : ''}`}
                  >
                    List for Sale
                  </button>
                </div>

                {/* Action 2: Refurbish */}
                <div title={result.score < 50 ? "Health Score must be ≥ 50" : ""} className={`border ${result.suggestedAction === 'REFURBISH' ? 'border-[#007185] bg-blue-50' : 'border-[#D5D9D9] bg-white'} ${result.score < 50 ? 'opacity-70 bg-gray-50' : 'hover:border-[#007185]'} rounded-lg p-6 flex flex-col h-full transition-colors relative overflow-hidden`}>
                  {result.suggestedAction === 'REFURBISH' && <div className="absolute top-0 right-0 bg-[#007185] text-white text-[10px] font-bold px-2 py-1 rounded-bl-lg">AI Recommended</div>}
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-bold text-lg text-[#0F1111]">Amazon Refurbishment</h4>
                    <span className="bg-green-100 text-green-800 text-xs font-bold px-2 py-1 rounded-full">+50 Credits</span>
                  </div>
                  <p className="text-sm text-[#565959] mb-4 flex-1">Amazon repairs, certifies, and relists the device.</p>
                  <ul className="text-sm space-y-2 mb-6 text-[#0F1111]">
                    <li className="flex items-center"><CheckCircle className="w-4 h-4 text-[#16a34a] mr-2"/> Extend product lifespan</li>
                    <li className="flex items-center"><CheckCircle className="w-4 h-4 text-[#16a34a] mr-2"/> Free shipping to center</li>
                  </ul>
                  {result.score < 50 && <div className="text-xs text-red-600 mb-2 font-bold flex items-center"><Info className="w-3 h-3 mr-1"/> Health Score must be ≥ 50</div>}
                  <button 
                    disabled={isSubmitting || result.score < 50}
                    onClick={() => handleAction('REFURBISH')}
                    className={`w-full bg-white hover:bg-gray-50 border border-[#D5D9D9] rounded-full py-2 font-bold text-[#0F1111] shadow-sm disabled:opacity-50 ${result.score < 50 ? 'cursor-not-allowed' : ''}`}
                  >
                    Send for Refurbishment
                  </button>
                </div>

                {/* Action 3: Recycle */}
                <div className={`border ${result.suggestedAction === 'RECYCLE' ? 'border-[#16a34a] bg-green-50' : 'border-[#D5D9D9] bg-white'} hover:border-[#16a34a] rounded-lg p-6 flex flex-col h-full transition-colors relative overflow-hidden`}>
                  {result.suggestedAction === 'RECYCLE' && <div className="absolute top-0 right-0 bg-[#16a34a] text-white text-[10px] font-bold px-2 py-1 rounded-bl-lg">AI Recommended</div>}
                  <div className="flex justify-between items-start mb-2 mt-2">
                    <h4 className="font-bold text-lg text-[#0F1111]">Recycle Responsibly</h4>
                    <span className="bg-green-100 text-green-800 text-xs font-bold px-2 py-1 rounded-full">+100 Credits</span>
                  </div>
                  <p className="text-sm text-[#565959] mb-4 flex-1">Send device to a certified e-waste recycling partner.</p>
                  <ul className="text-sm space-y-2 mb-6 text-[#0F1111]">
                    <li className="flex items-center"><CheckCircle className="w-4 h-4 text-[#16a34a] mr-2"/> Recover valuable materials</li>
                    <li className="flex items-center"><CheckCircle className="w-4 h-4 text-[#16a34a] mr-2"/> Reduce landfill waste</li>
                  </ul>
                  <button 
                    disabled={isSubmitting}
                    onClick={() => handleAction('RECYCLE')}
                    className="w-full bg-white hover:bg-gray-50 border border-[#D5D9D9] rounded-full py-2 font-bold text-[#0F1111] shadow-sm disabled:opacity-50"
                  >
                    Recycle Device
                  </button>
                </div>

                {/* Action 4: Donate */}
                <div title={result.score < 30 ? "Health Score must be ≥ 30" : ""} className={`border ${result.suggestedAction === 'DONATE' ? 'border-blue-600 bg-blue-50' : 'border-[#D5D9D9] bg-white'} ${result.score < 30 ? 'opacity-70 bg-gray-50' : 'hover:border-blue-600'} rounded-lg p-6 flex flex-col h-full transition-colors relative overflow-hidden`}>
                  {result.suggestedAction === 'DONATE' && <div className="absolute top-0 right-0 bg-blue-600 text-white text-[10px] font-bold px-2 py-1 rounded-bl-lg">AI Recommended</div>}
                  <div className="flex justify-between items-start mb-2 mt-2">
                    <h4 className="font-bold text-lg text-[#0F1111]">Donate for Impact</h4>
                    <span className="bg-green-100 text-green-800 text-xs font-bold px-2 py-1 rounded-full">+150 Credits</span>
                  </div>
                  <p className="text-sm text-[#565959] mb-4 flex-1">Donate the device to schools or underserved communities.</p>
                  <ul className="text-sm space-y-2 mb-6 text-[#0F1111]">
                    <li className="flex items-center"><CheckCircle className="w-4 h-4 text-[#16a34a] mr-2"/> Help someone in need</li>
                    <li className="flex items-center"><CheckCircle className="w-4 h-4 text-[#16a34a] mr-2"/> Create measurable social impact</li>
                  </ul>
                  {result.score < 30 && <div className="text-xs text-red-600 mb-2 font-bold flex items-center"><Info className="w-3 h-3 mr-1"/> Health Score must be ≥ 30</div>}
                  <button 
                    disabled={isSubmitting || result.score < 30}
                    onClick={() => handleAction('DONATE')}
                    className={`w-full bg-white hover:bg-gray-50 border border-[#D5D9D9] rounded-full py-2 font-bold text-[#0F1111] shadow-sm disabled:opacity-50 ${result.score < 30 ? 'cursor-not-allowed' : ''}`}
                  >
                    Donate Device
                  </button>
                </div>

              </div>
            </div>
          )}

          {/* STEP 4: Success */}
          {step === 4 && successAction && (
            <div className="animate-fade-in text-center py-12 max-w-2xl mx-auto">
              <div className="bg-green-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-12 h-12 text-[#16a34a]" />
              </div>
              
              {successAction.type === 'RESELL' && (
                <>
                  <h2 className="text-3xl font-bold text-[#0F1111] mb-4">Your item is now live!</h2>
                  <p className="text-lg text-[#565959] mb-8">"{selectedOrder?.name}" is now listed on the Amazon ReLife Marketplace.</p>
                </>
              )}
              {successAction.type === 'REFURBISH' && (
                <>
                  <h2 className="text-3xl font-bold text-[#0F1111] mb-4">Refurbishment Requested</h2>
                  <p className="text-lg text-[#565959] mb-8">We've scheduled a pickup for "{selectedOrder?.name}". Thank you for extending its lifespan!</p>
                </>
              )}
              {successAction.type === 'RECYCLE' && (
                <>
                  <h2 className="text-3xl font-bold text-[#0F1111] mb-4">Recycling Scheduled</h2>
                  <p className="text-lg text-[#565959] mb-8">You're an Environmental Hero! We will collect "{selectedOrder?.name}" to safely recover its materials.</p>
                </>
              )}
              {successAction.type === 'DONATE' && (
                <>
                  <h2 className="text-3xl font-bold text-[#0F1111] mb-4">Donation Confirmed</h2>
                  <p className="text-lg text-[#565959] mb-8">You are a Community Champion! Your donation of "{selectedOrder?.name}" will help someone in need.</p>
                </>
              )}

              <div className="bg-[#F7FAFA] border border-[#D5D9D9] rounded-lg p-6 mb-8 inline-block w-full max-w-md">
                <p className="text-sm font-bold text-[#565959] mb-2 uppercase">Impact Achieved</p>
                <div className="flex justify-center items-center space-x-6">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-[#16a34a]">+{successAction.credits}</p>
                    <p className="text-xs text-[#565959]">Green Credits</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4">
                {successAction.type === 'RESELL' && (
                  <button onClick={() => navigate('/relife/marketplace')} className="bg-[#FFD814] hover:bg-[#F7CA00] border border-[#FCD200] rounded-full px-8 py-3 font-bold text-[#0F1111] shadow-sm w-full sm:w-auto">
                    View Marketplace
                  </button>
                )}
                <button onClick={() => navigate('/reseller/listings')} className="bg-white hover:bg-gray-50 border border-[#D5D9D9] rounded-full px-8 py-3 font-bold text-[#0F1111] shadow-sm w-full sm:w-auto">
                  My Listings Dashboard
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
