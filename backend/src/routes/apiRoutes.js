import express from 'express';
import {
  getAmazonProducts,
  getAmazonProductById,
  getRelifeProducts,
  getRelifeProductById,
  getRecommendationsForAsin,
  searchAllProducts,
  getCrossMarketRecommendations
} from '../controllers/productController.js';
import { getSellerDashboard } from '../controllers/sellerController.js';
import { checkout, getMyOrders } from '../controllers/orderController.js';
import { getLeaderboard } from '../controllers/leaderboardController.js';
import { getSustainabilityData } from '../controllers/sustainabilityController.js';
import { getTransactions, getCreditBalance } from '../controllers/creditController.js';
import { getCart, addToCart, removeFromCart, updateCartQuantity, clearCart } from '../controllers/cartController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Amazon Products
router.get('/products', getAmazonProducts);
router.get('/products/:id', getAmazonProductById);

// ReLife Products
router.get('/relife-products', getRelifeProducts);
router.get('/relife-products/:id', getRelifeProductById);

// Recommendations & Search
router.get('/recommendations/:asin', getRecommendationsForAsin);
router.get('/recommendations/cross-market/:productId', getCrossMarketRecommendations);
router.get('/search', searchAllProducts);

// Seller Dashboard
router.get('/seller/dashboard/:sellerId', getSellerDashboard);

// Orders & Sustainability
router.post('/orders/checkout', protect, checkout);
router.get('/orders/my-orders', protect, getMyOrders);
router.get('/sustainability/dashboard', protect, getSustainabilityData);

// Green Credits
router.get('/credits/transactions', protect, getTransactions);
router.get('/credits/balance', protect, getCreditBalance);

// Leaderboard
router.get('/leaderboard', getLeaderboard);

// Cart
router.get('/cart', protect, getCart);
router.post('/cart/add', protect, addToCart);
router.delete('/cart/:productId', protect, removeFromCart);
router.put('/cart/update', protect, updateCartQuantity);
router.delete('/cart', protect, clearCart);

export const apiRouter = router;
