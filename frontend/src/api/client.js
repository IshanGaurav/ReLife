import axios from 'axios';

const api = axios.create({ 
  baseURL: 'http://localhost:5000/api' // Changed to base /api so auth works from /api/auth and others from /api/v2
});

// Interceptor to add JWT token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('relife_jwt');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth Endpoints
export const loginUserApi = (email, password, role) => api.post('/auth/login', { email, password, role }).then(res => res.data);
export const registerUserApi = (name, email, password, role) => api.post('/auth/register', { name, email, password, role }).then(res => res.data);
export const getMeApi = () => api.get('/auth/me').then(res => res.data);

// Cart Endpoints
export const getCartApi = () => api.get('/v2/cart').then(res => res.data);
export const addToCartApi = (item) => api.post('/v2/cart/add', item).then(res => res.data);
export const removeFromCartApi = (productId) => api.delete(`/v2/cart/${productId}`).then(res => res.data);
export const updateCartQuantityApi = (productId, quantity) => api.put(`/v2/cart/update`, { productId, quantity }).then(res => res.data);
export const clearCartApi = () => api.delete('/v2/cart').then(res => res.data);

// V2 Endpoints
export const getAmazonProducts = () => api.get('/v2/products').then(res => res.data);
export const getAmazonProduct = (id) => api.get(`/v2/products/${id}`).then(res => res.data);

export const getUsedProducts = () => api.get('/v2/relife-products?type=used').then(res => res.data);
export const getOpenBoxProducts = () => api.get('/v2/relife-products?type=openbox').then(res => res.data);
export const getRelifeProduct = (id) => api.get(`/v2/relife-products/${id}`).then(res => res.data);

export const searchProducts = (q, mode) => api.get(`/v2/search`, { params: { q, mode } }).then(res => res.data);
export const getRecommendation = (asin) => api.get(`/v2/recommendations/${asin}`).then(res => res.data);
export const getCrossMarketRecommendations = (productId) => api.get(`/v2/recommendations/cross-market/${productId}`).then(res => res.data);

export const getSellerDashboard = (sellerId) => api.get(`/v2/seller/dashboard/${sellerId}`).then(res => res.data);

// Orders & Sustainability
export const placeOrderApi = (cartItems, shippingData, paymentMethod) => api.post('/v2/orders/checkout', { cartItems, shippingData, paymentMethod }).then(res => res.data);
export const getMyOrdersApi = async () => {
  try {
    const res = await api.get('/v2/orders/my-orders');
    return res.data;
  } catch (error) {
    console.error('getMyOrdersApi error', error);
    return null;
  }
};

export const getTransactionsApi = async () => {
  try {
    const res = await api.get('/v2/credits/transactions');
    return res.data;
  } catch (error) {
    console.error('getTransactionsApi error', error);
    return null;
  }
};

export const getCreditBalanceApi = async () => {
  try {
    const res = await api.get('/v2/credits/balance');
    return res.data;
  } catch (error) {
    console.error('getCreditBalanceApi error', error);
    return null;
  }
};
export const getLeaderboardApi = async (period = 'daily', region = 'national', stateName = '', cityName = '') => {
  try {
    const res = await api.get(`/v2/leaderboard`, {
      params: { period, region, stateName, cityName, limit: 100 }
    });
    return res.data;
  } catch (error) {
    console.error('getLeaderboardApi error', error);
    return null;
  }
};

export const getSustainabilityApi = async () => {
  try {
    const res = await api.get(`/v2/sustainability/dashboard`);
    return res.data;
  } catch (error) {
    console.error('getSustainabilityApi error', error);
    return null;
  }
};
