export const generatePassport = (product) => {
  if (!product) return null;

  const score = product.conditionScore || 85;
  let conditionColor = '#ef4444'; // Red
  let conditionColorName = 'Red';

  if (score >= 95) { conditionColor = '#16a34a'; conditionColorName = 'Green'; }
  else if (score >= 85) { conditionColor = '#84cc16'; conditionColorName = 'Light Green'; }
  else if (score >= 70) { conditionColor = '#eab308'; conditionColorName = 'Yellow'; }
  else if (score >= 50) { conditionColor = '#f97316'; conditionColorName = 'Orange'; }

  const nameLow = product.name.toLowerCase();
  
  let specs = [];
  let repairs = [];

  if (nameLow.includes('macbook') || nameLow.includes('laptop')) {
    specs = [
      { label: 'Chip/Processor', value: nameLow.includes('m2') ? 'Apple M2' : 'Intel Core i7' },
      { label: 'RAM', value: '16GB Unified' },
      { label: 'Storage', value: '512GB SSD' }
    ];
    repairs = [
      { type: 'Keyboard Replacement', center: 'Certified Repair Hub', date: 'Jan 2024' },
      { type: 'Battery Service', center: 'ReLife Center', date: 'May 2024' }
    ];
  } else if (nameLow.includes('iphone') || nameLow.includes('samsung') || product.category === 'Smartphones') {
    specs = [
      { label: 'Storage', value: '256GB' },
      { label: 'Color', value: 'Midnight' },
      { label: 'Battery Health', value: `${Math.max(80, score)}%` }
    ];
    repairs = [
      { type: 'Battery Replacement', center: 'Official Store', date: 'Feb 2024' },
      { type: 'Screen Replacement', center: 'ReLife Center', date: 'May 2024' }
    ];
  } else if (nameLow.includes('echo') || nameLow.includes('speaker')) {
    specs = [
      { label: 'Speaker Type', value: 'Smart Speaker' },
      { label: 'Connectivity', value: 'Wi-Fi, Bluetooth' },
      { label: 'Voice Assistant', value: 'Alexa' }
    ];
    repairs = [
      { type: 'Firmware Refresh', center: 'Amazon ReLife', date: 'April 2024' }
    ];
  } else if (nameLow.includes('kindle')) {
    specs = [
      { label: 'Display', value: 'E-Ink Carta' },
      { label: 'Storage', value: '16GB' },
      { label: 'Connectivity', value: 'Wi-Fi' }
    ];
    repairs = [
      { type: 'Screen Polish', center: 'ReLife Center', date: 'March 2024' }
    ];
  } else if (nameLow.includes('headphone') || nameLow.includes('wh-')) {
    specs = [
      { label: 'Type', value: 'Over-Ear ANC' },
      { label: 'Connectivity', value: 'Bluetooth 5.0' },
      { label: 'Battery Life', value: 'Up to 30 Hours' }
    ];
    repairs = [
      { type: 'Ear Pad Replacement', center: 'ReLife Center', date: 'March 2024' }
    ];
  } else {
    specs = [
      { label: 'Category', value: product.category || 'Electronics' },
      { label: 'Model Year', value: '2023' }
    ];
    repairs = [
      { type: 'General Servicing & Cleaning', center: 'ReLife Center', date: 'Recent' }
    ];
  }

  const ownership = [
    { user: 'Initial Owner', role: 'First Owner', date: 'Activated 14 months ago' },
    { user: 'ReLife Processing', role: 'Intake & Data Wipe', date: '1 month ago' },
    { user: 'ReLife Inspection Center', role: 'Certification', date: 'Current' }
  ];

  const inspection = [
    { item: 'Screen Condition', pass: score >= 70 },
    { item: 'Battery Health', pass: true },
    { item: 'Physical Damage', pass: score >= 80 },
    { item: 'Performance Status', pass: true },
    { item: 'Ports Working', pass: true },
    { item: 'Camera Working', pass: !nameLow.includes('echo') && !nameLow.includes('headphone') ? true : 'N/A' },
    { item: 'Audio Working', pass: true },
    { item: 'Connectivity Status', pass: true }
  ].filter(i => i.pass !== 'N/A');

  const carbonSaved = product.co2Saved || '12 kg';
  const wasteDiverted = '1.2 kg';
  let greenCredits = 150;
  if (product.relifePrice) {
    greenCredits = Math.floor(parseInt(product.relifePrice.replace(/,/g, '')) * 0.05);
  }

  return {
    id: `DPP-${product.id.toUpperCase()}-${Math.floor(Math.random()*9000)+1000}`,
    name: product.name,
    brand: product.name.split(' ')[0],
    model: product.name.split(' ').slice(1,3).join(' '),
    category: product.category || 'Electronics',
    mintDate: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
    condition: score,
    conditionColor,
    conditionColorName,
    disposition: score >= 90 ? 'Open Box' : 'Refurbished',
    lifespan: '2-3 Years',
    carbonSaved,
    wasteDiverted,
    greenCredits,
    ownership,
    repairs,
    specs,
    inspection,
    aiTelemetry: product.aiVerified ? {
      confidence: product.confidence,
      damagePercentage: product.damagePercentage,
      recommendation: product.recommendation
    } : null
  };
};
