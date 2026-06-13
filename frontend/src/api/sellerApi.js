// Mock API service for Amazon Seller Copilot

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const mockProducts = [
  { id: 'p1', title: 'Wireless Noise Cancelling Headphones', category: 'Electronics', rating: 4.5, reviewCount: 1245, seoScore: 78, listingHealth: 'Good', lastUpdated: '2023-10-12' },
  { id: 'p2', title: 'Ergonomic Office Chair', category: 'Furniture', rating: 4.2, reviewCount: 856, seoScore: 65, listingHealth: 'Needs Attention', lastUpdated: '2023-09-28' },
  { id: 'p3', title: 'Stainless Steel Water Bottle 32oz', category: 'Sports & Outdoors', rating: 4.8, reviewCount: 3421, seoScore: 92, listingHealth: 'Excellent', lastUpdated: '2023-10-20' },
  { id: 'p4', title: 'Organic Cotton Bed Sheets', category: 'Home', rating: 3.9, reviewCount: 412, seoScore: 54, listingHealth: 'Poor', lastUpdated: '2023-08-15' },
  { id: 'p5', title: 'Smart LED Desk Lamp', category: 'Electronics', rating: 4.6, reviewCount: 630, seoScore: 85, listingHealth: 'Good', lastUpdated: '2023-10-05' },
];

export const getSellerDashboardMetrics = async () => {
  await delay(800);
  return {
    totalProducts: 24,
    averageRating: 4.4,
    averageSeoScore: 76,
    totalReviews: 12450,
    productsNeedingAttention: 3,
    competitorAlerts: 2,
    seoDistribution: [
      { name: 'Excellent (90-100)', value: 5 },
      { name: 'Good (70-89)', value: 12 },
      { name: 'Fair (50-69)', value: 5 },
      { name: 'Poor (0-49)', value: 2 }
    ],
    reviewSentiment: [
      { name: 'Positive', value: 75 },
      { name: 'Neutral', value: 15 },
      { name: 'Negative', value: 10 }
    ],
    productPerformance: [
      { month: 'Jan', sales: 4000 },
      { month: 'Feb', sales: 3000 },
      { month: 'Mar', sales: 5000 },
      { month: 'Apr', sales: 4500 },
      { month: 'May', sales: 6000 },
      { month: 'Jun', sales: 7200 }
    ],
    recentActivity: [
      { id: 1, type: 'seo', message: 'SEO Recommendations available for "Organic Cotton Bed Sheets"', time: '2 hours ago' },
      { id: 2, type: 'review', message: 'Spike in negative reviews for "Ergonomic Office Chair" regarding packaging', time: '5 hours ago' },
      { id: 3, type: 'competitor', message: 'Competitor "SleepWell" lowered price on similar bed sheets by 15%', time: '1 day ago' }
    ]
  };
};

export const getSellerProducts = async () => {
  await delay(600);
  return mockProducts;
};

export const analyzeSEO = async (data) => {
  await delay(1500);
  return {
    seoScore: Math.floor(Math.random() * 30) + 60, // Random score between 60-90
    missingKeywords: ['wireless bluetooth 5.0', 'noise isolation', 'over ear headphones'],
    keywordDensity: [
      { keyword: 'headphones', density: '3.2%' },
      { keyword: 'wireless', density: '2.1%' },
      { keyword: 'cancelling', density: '1.5%' }
    ],
    suggestedTitle: data.title ? `Premium ${data.title} with Active Noise Cancellation` : 'Optimized Product Title',
    suggestedBulletPoints: [
      'INDUSTRY LEADING NOISE CANCELLATION: Block out unwanted background noise.',
      '40-HOUR BATTERY LIFE: Fast charging capabilities.',
      'PREMIUM COMFORT: Ergonomic design for all-day wear.'
    ],
    suggestedDescription: 'Experience unparalleled sound quality with our latest generation wireless headphones...'
  };
};

export const getReviewIntelligence = async (productId) => {
  await delay(1200);
  return {
    positiveSummary: {
      title: 'Customers Love:',
      points: ['✓ Battery Life is exceptional (40+ hours)', '✓ Build Quality feels premium', '✓ Comfort for long listening sessions']
    },
    negativeSummary: {
      title: 'Customers Dislike:',
      points: ['✗ Packaging arrived damaged for some', '✗ Charging Speed is slightly slower than competitors']
    },
    aiRecommendations: [
      'Improve packaging quality (corrugated boxes instead of bubble mailers)',
      'Highlight 40-hour battery life more prominently in images',
      'Add warranty information explicitly in bullet 5'
    ],
    sentimentData: [
      { name: '5 Star', value: 65 },
      { name: '4 Star', value: 20 },
      { name: '3 Star', value: 8 },
      { name: '2 Star', value: 4 },
      { name: '1 Star', value: 3 }
    ],
    complaintCategories: [
      { category: 'Packaging', count: 45 },
      { category: 'Shipping Time', count: 22 },
      { category: 'Charging Cable', count: 15 }
    ],
    positiveCategories: [
      { category: 'Sound Quality', count: 320 },
      { category: 'Comfort', count: 280 },
      { category: 'Battery', count: 250 }
    ]
  };
};

export const analyzeCompetitor = async (inputUrlOrName) => {
  await delay(2000);
  return {
    competitorName: 'Bose QuietComfort 45',
    competitorFeatures: ['Waterproof (IPX4)', 'Fast Charging (15 min = 3 hrs)', 'Lifetime Warranty'],
    yourMissingFeatures: ['Waterproof', 'Lifetime Warranty'],
    featureComparison: [
      { feature: 'Battery Life', yours: '30 Hours', competitor: '24 Hours', winner: 'yours' },
      { feature: 'Weight', yours: '250g', competitor: '240g', winner: 'competitor' },
      { feature: 'Bluetooth Version', yours: '5.2', competitor: '5.1', winner: 'yours' }
    ],
    keywordGaps: ['audiophile', 'airplane travel', 'multipoint connection'],
    priceComparison: {
      yours: 199.99,
      competitor: 329.00,
      gap: '-39%'
    },
    ratingComparison: {
      yours: 4.5,
      competitor: 4.8
    }
  };
};

export const getAIRecommendations = async () => {
  await delay(1000);
  return [
    { id: 1, priority: 'High', title: 'Add missing keywords to Headphone listing', description: 'Adding "multipoint connection" and "airplane travel" to backend search terms.', impactSeo: '+14%', impactConv: '+7%' },
    { id: 2, priority: 'High', title: 'Improve Product Title for Office Chair', description: 'Current title is too short. Add dimensions and material.', impactSeo: '+22%', impactConv: '+5%' },
    { id: 3, priority: 'Medium', title: 'Improve first image for Cotton Bed Sheets', description: 'Current main image has low brightness. Increase contrast by 15%.', impactSeo: '0%', impactConv: '+12%' },
    { id: 4, priority: 'Medium', title: 'Address packaging complaints', description: 'Update listing description to mention "Ships in reinforced packaging".', impactSeo: '0%', impactConv: '+4%' },
    { id: 5, priority: 'Low', title: 'Add A+ Content comparison chart', description: 'Compare your water bottle against standard plastic bottles.', impactSeo: '+3%', impactConv: '+8%' },
  ];
};
