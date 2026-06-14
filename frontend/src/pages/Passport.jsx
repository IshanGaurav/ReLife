import React, { useState, useEffect } from 'react';
import { ShieldCheck, Download, Clock, Wrench, Settings, Search, CheckCircle, Leaf, FileText } from 'lucide-react';
import Section from '../components/ui/Section';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import { getRelifeProduct } from '../api/client';
import { generatePassport } from '../utils/passportGenerator';
import { useParams, Link, useNavigate } from 'react-router-dom';

export default function Passport() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [passportData, setPassportData] = useState(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    
    getRelifeProduct(id)
      .then(product => {
        if (!isMounted) return;
        if (product) {
          setPassportData(generatePassport(product));
        } else {
          setPassportData(null);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to load product", err);
        setLoading(false);
      });
      
    return () => { isMounted = false; };
  }, [id]);

  const handlePrint = () => {
    window.print();
  };

  const handleGenerate = () => {
    setLoading(true);
    setTimeout(() => {
      const allProducts = [...usedProducts, ...openBoxProducts];
      const product = allProducts.find(p => p.id === id) || allProducts[0];
      setPassportData(generatePassport(product));
      setLoading(false);
    }, 1000);
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-8 animate-pulse space-y-8">
        <div className="h-12 bg-gray-200 rounded w-1/3 mb-4"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-6">
            <div className="h-64 bg-gray-200 rounded"></div>
            <div className="h-40 bg-gray-200 rounded"></div>
          </div>
          <div className="md:col-span-2 space-y-6">
            <div className="h-48 bg-gray-200 rounded"></div>
            <div className="h-48 bg-gray-200 rounded"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!passportData) {
    return (
      <div className="max-w-2xl mx-auto mt-12">
        <Card className="text-center p-12 border border-gray-200">
          <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-amazon-blue mb-2">Digital Passport Not Found</h2>
          <p className="text-gray-500 mb-8">This product does not yet have a digital passport or the ID is invalid.</p>
          <Button variant="primary" onClick={handleGenerate} className="px-8 py-3">
            Generate Passport
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto animate-fade-in space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-200 pb-6">
        <div>
          <div className="flex items-center space-x-2 text-sm text-gray-500 font-bold uppercase tracking-wider mb-2">
            <ShieldCheck className="w-5 h-5 text-relife-green" />
            <span>Verified Digital Passport</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-amazon-blue">{passportData?.name}</h1>
          <p className="text-gray-500 mt-1">ID: {passportData?.id}</p>
        </div>
        <div className="print:hidden flex space-x-3">
          <Button variant="outline" icon={<Download className="w-4 h-4" />} onClick={handlePrint}>PDF</Button>
          <Link to="/relife/sell">
            <Button variant="primary">List on Marketplace</Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Col: Core Stats */}
        <div className="space-y-6">
          <Card noPadding className="overflow-hidden print:border print:border-gray-300">
            <div className="text-white p-6 text-center" style={{ backgroundColor: passportData?.conditionColor }}>
              <p className="text-xs uppercase font-bold tracking-wider opacity-90 mb-1">Condition Score</p>
              <p className="text-5xl font-extrabold">{passportData?.condition}<span className="text-xl opacity-80">/100</span></p>
              <div className="mt-4 flex justify-center space-x-2">
                <Badge variant="gray" className="border-none bg-white text-gray-900 shadow-sm">{passportData?.conditionColorName}</Badge>
                <Badge variant="gray" className="border-none bg-white text-gray-900 shadow-sm">{passportData?.disposition}</Badge>
              </div>
            </div>
            <div className="p-4 bg-white grid grid-cols-2 gap-4 text-center divide-x divide-gray-100">
              <div>
                <p className="text-xs text-gray-400 font-bold uppercase mb-1">CO₂ Saved</p>
                <p className="font-bold text-relife-green">{passportData?.carbonSaved}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 font-bold uppercase mb-1">Waste Diverted</p>
                <p className="font-bold text-amazon-blue">{passportData?.wasteDiverted}</p>
              </div>
            </div>
            <div className="p-4 bg-gray-50 border-t border-gray-100 text-center">
              <p className="text-xs text-gray-400 font-bold uppercase mb-1">Green Credits Generated</p>
              <p className="font-bold text-[#FF9900] flex justify-center items-center">
                <Leaf className="w-4 h-4 mr-1 text-[#16a34a]" /> {passportData?.greenCredits} Credits
              </p>
            </div>
          </Card>

          <Card className="bg-gray-50 border-gray-200">
             <div className="flex items-center space-x-2 mb-4 text-amazon-blue">
               <Settings className="w-5 h-5" />
               <h3 className="font-bold">Hardware Specs</h3>
             </div>
             <ul className="text-sm space-y-2 text-gray-600">
               {passportData?.specs?.map((spec, i) => (
                 <li key={i} className="flex justify-between border-b border-gray-200 pb-1">
                   <span>{spec.label}</span> 
                   <span className="font-medium text-gray-900 text-right">{spec.value}</span>
                 </li>
               ))}
             </ul>
          </Card>
        </div>

        {/* Right Col: Timeline & History */}
        <div className="md:col-span-2 space-y-6">
          <Card>
            <div className="flex items-center justify-between mb-6 border-b border-gray-100 pb-4">
              <div className="flex items-center space-x-2 text-amazon-blue">
                <Clock className="w-5 h-5" />
                <h3 className="font-bold text-lg">Chain of Custody</h3>
              </div>
              <span className="text-xs text-gray-500 font-bold">Immutable Ledger</span>
            </div>
            
            <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-gray-300 before:to-transparent">
              {passportData?.ownership?.map((own, i) => (
                <div key={i} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-relife-light-green text-relife-green shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                    <UserIcon />
                  </div>
                  <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white p-4 rounded border border-gray-100 shadow-sm">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-bold text-amazon-blue">{own.user}</h4>
                      <span className="text-xs text-gray-500">{own.date}</span>
                    </div>
                    <Badge variant="gray" className="text-[10px]">{own.role}</Badge>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <div className="flex items-center space-x-2 mb-6 border-b border-gray-100 pb-4 text-amazon-blue">
              <Wrench className="w-5 h-5" />
              <h3 className="font-bold text-lg">Repair History</h3>
            </div>
            <div className="space-y-4">
              {passportData?.repairs?.map((rep, i) => (
                <div key={i} className="bg-gray-50 p-4 rounded-xl border border-gray-200 flex justify-between items-center">
                  <div>
                    <h4 className="font-bold text-amazon-blue text-sm">{rep.type}</h4>
                    <p className="text-xs text-gray-500 mt-1">{rep.center}</p>
                  </div>
                  <span className="text-xs font-bold text-gray-400 bg-white px-3 py-1 rounded border border-gray-200">{rep.date}</span>
                </div>
              ))}
            </div>
          </Card>

          <Card className="bg-blue-50 border-blue-100 print:break-inside-avoid">
             <div className="flex items-start space-x-3 mb-4">
               <Search className="w-5 h-5 text-blue-600 mt-0.5" />
               <div>
                 <h4 className="font-bold text-blue-900 mb-1">AI Inspection Report Included</h4>
                 <p className="text-sm text-blue-800">This passport contains the full cryptographic hash of the AI visual inspection performed on {passportData?.mintDate}.</p>
               </div>
             </div>
             
             <div className="grid grid-cols-2 gap-3 mt-4 bg-white p-4 rounded-lg border border-blue-100">
               {passportData?.inspection?.map((item, i) => (
                 <div key={i} className="flex items-center text-sm">
                   {item.pass ? (
                     <CheckCircle className="w-4 h-4 text-[#16a34a] mr-2 shrink-0" />
                   ) : (
                     <div className="w-4 h-4 rounded-full bg-red-100 text-red-600 flex items-center justify-center mr-2 shrink-0 text-[10px] font-bold">X</div>
                   )}
                   <span className={item.pass ? "text-gray-700" : "text-red-600 font-bold"}>{item.item}</span>
                 </div>
               ))}
             </div>

             {passportData?.aiTelemetry && (
               <div className="mt-4 p-4 bg-purple-50 border border-purple-100 rounded-lg">
                 <h5 className="text-xs font-bold text-purple-900 uppercase tracking-wider mb-2">Raw AI Telemetry</h5>
                 <div className="grid grid-cols-2 gap-2 text-sm text-purple-800">
                   <div><strong>Confidence:</strong> {(passportData.aiTelemetry.confidence).toFixed(2)}%</div>
                   <div><strong>Damage Detected:</strong> {(passportData.aiTelemetry.damagePercentage).toFixed(2)}%</div>
                   <div className="col-span-2"><strong>AI Recommendation:</strong> {passportData.aiTelemetry.recommendation}</div>
                 </div>
               </div>
             )}
          </Card>
        </div>
      </div>
      
      {/* Print Styles */}
      <style>{`
        @media print {
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          .print\\:hidden { display: none !important; }
          .print\\:break-inside-avoid { break-inside: avoid; }
          .print\\:border { border: 1px solid #e5e7eb !important; }
        }
      `}</style>
    </div>
  );
}

// Inline UserIcon for the timeline since lucide User wasn't explicitly imported above
function UserIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}
