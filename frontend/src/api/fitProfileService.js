const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Mock User Fit Profile
let userProfile = {
  height: 175, // cm
  weight: 72, // kg
  gender: 'Male',
  ageGroup: '25-34',
  chest: 98, // cm
  waist: 82, // cm
  hip: 95, // cm
  preferredFit: 'Regular'
};

export const getUserFitProfile = async () => {
  await delay(800);
  return userProfile;
};

export const updateUserFitProfile = async (newProfile) => {
  await delay(1000);
  userProfile = { ...userProfile, ...newProfile };
  return userProfile;
};

// Mock Purchase History
export const getPurchaseHistory = async () => {
  await delay(600);
  return [
    { productId: 'p1', title: 'Nike Air Max 270', category: 'Shoes', size: 'UK 8', kept: true, returned: false, brand: 'Nike', date: '2023-09-15' },
    { productId: 'p2', title: 'Adidas Ultraboost', category: 'Shoes', size: 'UK 8.5', kept: false, returned: true, returnReason: 'Too large', brand: 'Adidas', date: '2023-08-10' },
    { productId: 'p3', title: 'Levi\'s 501 Original', category: 'Clothing', size: '32x32', kept: true, returned: false, brand: 'Levis', date: '2023-07-22' },
    { productId: 'p4', title: 'Puma Essentials Tee', category: 'Clothing', size: 'L', kept: false, returned: true, returnReason: 'Too tight', brand: 'Puma', date: '2023-06-05' },
    { productId: 'p5', title: 'Puma Classics Hoodie', category: 'Clothing', size: 'XL', kept: true, returned: false, brand: 'Puma', date: '2023-06-20' },
  ];
};

export const getBrandPreferences = async () => {
  await delay(500);
  return [
    { brand: 'Nike', preferredSize: 'UK 8', successRate: 95 },
    { brand: 'Adidas', preferredSize: 'UK 8', successRate: 80 },
    { brand: 'Puma', preferredSize: 'XL', successRate: 85 },
    { brand: 'Levis', preferredSize: '32 Waist', successRate: 100 },
  ];
};
