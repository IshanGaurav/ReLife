import { amazonProducts, openBoxProducts, usedProducts } from '../data/mockData';

export const getRelifeAlternative = (amazonId) => {
  const amazonProduct = amazonProducts.find(p => p.id === amazonId);
  if (!amazonProduct) return null;

  const searchKeywords = amazonProduct.name.toLowerCase();
  
  // Combine all ReLife inventory
  const allRelifeInventory = [...openBoxProducts, ...usedProducts];
  
  // Find matches
  const matches = allRelifeInventory.filter(alternative => {
    const relifeName = alternative.name.toLowerCase();
    
    let isMatch = false;
    if (searchKeywords.includes('macbook air') && relifeName.includes('macbook air')) isMatch = true;
    if (searchKeywords.includes('echo dot') && relifeName.includes('echo dot')) isMatch = true;
    if (searchKeywords.includes('echo dot') && relifeName.includes('echo (4th gen)')) isMatch = true;
    if (searchKeywords.includes('kindle paperwhite') && relifeName.includes('kindle paperwhite')) isMatch = true;
    if (searchKeywords.includes('wh-1000xm4') && relifeName.includes('wh-1000xm4')) isMatch = true;
    
    return isMatch;
  });

  if (matches.length === 0) return null;

  // Return the one with highest condition score, or just the first one
  return matches.sort((a, b) => (b.conditionScore || 100) - (a.conditionScore || 100))[0];
};

export const getAmazonAlternative = (relifeId) => {
  const allRelifeInventory = [...openBoxProducts, ...usedProducts];
  const relifeProduct = allRelifeInventory.find(p => p.id === relifeId);
  if (!relifeProduct) return null;

  const searchKeywords = relifeProduct.name.toLowerCase();
  
  // Find matches in Amazon inventory
  const matches = amazonProducts.filter(alternative => {
    const amazonName = alternative.name.toLowerCase();
    
    let isMatch = false;
    if (searchKeywords.includes('macbook air') && amazonName.includes('macbook air')) isMatch = true;
    if (searchKeywords.includes('echo dot') && amazonName.includes('echo dot')) isMatch = true;
    if (searchKeywords.includes('echo (4th gen)') && amazonName.includes('echo dot')) isMatch = true;
    if (searchKeywords.includes('kindle paperwhite') && amazonName.includes('kindle paperwhite')) isMatch = true;
    if (searchKeywords.includes('wh-1000xm4') && amazonName.includes('wh-1000xm4')) isMatch = true;
    
    return isMatch;
  });

  if (matches.length === 0) return null;

  return matches[0];
};
