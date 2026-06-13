import { getUserFitProfile, getPurchaseHistory } from './fitProfileService';

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const getAIRecommendation = async (productId, brand, category) => {
  await delay(1200);
  
  // Note: In a real system, this would make an API call to a Python ML backend
  // passing the user's profile, history, and the product ID to run inference.
  
  const profile = await getUserFitProfile();
  
  // Mock Logic Based on Brand/Category
  let recommendedSize = 'M';
  let confidence = 85;
  let fitScore = 80;
  let returnRisk = 'Medium';
  let reasoning = 'Based on general sizing algorithms.';
  let similarCustomerSuccess = 82;
  
  if (category === 'Shoes') {
    if (brand === 'Nike') {
      recommendedSize = 'UK 8';
      confidence = 94;
      fitScore = 96;
      returnRisk = 'Low';
      reasoning = `Customers with a similar profile (Height ${profile.height}cm, Weight ${profile.weight}kg) successfully kept this size. You also have a 95% keep rate with Nike size UK 8.`;
      similarCustomerSuccess = 91;
    } else if (brand === 'Adidas') {
      recommendedSize = 'UK 8';
      confidence = 88;
      fitScore = 85;
      returnRisk = 'Medium';
      reasoning = `This brand runs slightly larger. Your previous purchases indicate you returned UK 8.5. We recommend sizing down to UK 8.`;
      similarCustomerSuccess = 85;
    } else {
      recommendedSize = 'UK 8.5';
    }
  } else if (category === 'Clothing') {
    if (brand === 'Puma') {
      recommendedSize = 'XL';
      confidence = 92;
      fitScore = 90;
      returnRisk = 'Low';
      reasoning = `You previously returned Puma size L because it ran small. Customers matching your preferred fit (${profile.preferredFit}) prefer XL.`;
      similarCustomerSuccess = 89;
    } else {
      recommendedSize = 'L';
      confidence = 89;
      fitScore = 88;
      returnRisk = 'Low';
      reasoning = `Based on your chest (${profile.chest}cm) and preferred fit (${profile.preferredFit}), L provides the best match.`;
      similarCustomerSuccess = 88;
    }
  }

  // Sustainability Impact logic
  // Estimate CO2 savings if they don't return. 
  // Standard return logistics estimate: 1.5 - 3 kg CO2 per return
  const co2Saved = 2.3; // kg

  return {
    recommendedSize,
    confidence,
    fitScore,
    returnRisk,
    reasoning,
    similarCustomerSuccess,
    co2Saved,
    profileSnippet: {
      height: profile.height,
      weight: profile.weight,
      preferredFit: profile.preferredFit
    }
  };
};

export const getPurchaseAssistantDashboardData = async () => {
  await delay(1500);
  
  return {
    totalPurchasesAnalyzed: 45,
    returnsAvoided: 8,
    co2SavedTotal: 18.4, // kg
    fitAccuracy: 92, // %
    riskDistribution: [
      { name: 'Low Risk', value: 75, color: '#10b981' },
      { name: 'Medium Risk', value: 15, color: '#f59e0b' },
      { name: 'High Risk', value: 10, color: '#ef4444' }
    ]
  };
};
