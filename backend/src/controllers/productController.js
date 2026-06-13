import { AmazonProduct } from '../models/AmazonProduct.js';
import { RelifeProduct } from '../models/RelifeProduct.js';

export const getAmazonProducts = async (req, res) => {
  try {
    const products = await AmazonProduct.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAmazonProductById = async (req, res) => {
  try {
    let product = await AmazonProduct.findOne({ originalId: req.params.id });
    if (!product) {
      if (req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
         console.log("Fallback finding by ID:", req.params.id);
         product = await AmazonProduct.findOne({ _id: req.params.id });
         console.log("Fallback result:", product ? "FOUND" : "NOT FOUND");
      }
    }
    if (!product) {
       console.log("Returning 404 for:", req.params.id);
       return res.status(404).json({ message: 'Amazon Product not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getRelifeProducts = async (req, res) => {
  try {
    const isUsed = req.query.type === 'used' ? true : req.query.type === 'openbox' ? false : undefined;
    const filter = isUsed !== undefined ? { isUsed } : {};
    const products = await RelifeProduct.find(filter);
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getRelifeProductById = async (req, res) => {
  try {
    // Attempt originalId first (e.g. 'u1', 'o1') then fallback to MongoDB _id if needed
    let product = await RelifeProduct.findOne({ originalId: req.params.id });
    if (!product) {
      if (req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
         product = await RelifeProduct.findById(req.params.id);
      }
    }
    if (!product) return res.status(404).json({ message: 'ReLife Product not found' });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getRecommendationsForAsin = async (req, res) => {
  try {
    const { asin } = req.params;
    
    // Find all relife products that correspond to this Amazon ASIN (originalId)
    const alternatives = await RelifeProduct.find({ originalAsin: asin });
    
    if (!alternatives || alternatives.length === 0) {
      return res.status(404).json({ message: 'No recommendations found' });
    }

    // Condition-First Logic: Find the absolute best unit across all matching RelifeProducts
    let bestProduct = null;
    let bestUnit = null;
    let highestCondition = -1;

    alternatives.forEach(product => {
      if (product.availableUnits && product.availableUnits.length > 0) {
        product.availableUnits.forEach(unit => {
          if (unit.conditionScore > highestCondition) {
            highestCondition = unit.conditionScore;
            bestUnit = unit;
            bestProduct = product;
          }
        });
      }
    });

    if (!bestProduct || !bestUnit) {
      return res.status(404).json({ message: 'No available units found' });
    }

    res.json({
      product: bestProduct,
      unit: bestUnit
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const searchAllProducts = async (req, res) => {
  try {
    const { q, mode } = req.query;
    if (!q) return res.json({ amazon: [], relife: [] });

    const regex = new RegExp(q, 'i');
    const result = { amazon: [], relife: [] };

    if (!mode || mode === 'amazon') {
      result.amazon = await AmazonProduct.find({ name: regex });
    }
    
    if (!mode || mode === 'relife') {
      result.relife = await RelifeProduct.find({ name: regex });
    }

    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getCrossMarketRecommendations = async (req, res) => {
  try {
    const { productId } = req.params;
    
    let currentProduct = null;
    let isAmazon = true;
    
    if (productId.match(/^[0-9a-fA-F]{24}$/)) {
      currentProduct = await AmazonProduct.findById(productId);
      if (!currentProduct) {
        currentProduct = await RelifeProduct.findById(productId);
        isAmazon = false;
      }
    } else {
      currentProduct = await AmazonProduct.findOne({ originalId: productId });
      if (!currentProduct) {
        currentProduct = await RelifeProduct.findOne({ originalId: productId });
        isAmazon = false;
      }
    }

    if (!currentProduct) {
      return res.status(404).json({ message: 'Product not found in either marketplace' });
    }

    const brandStr = currentProduct.brand || (currentProduct.specs && currentProduct.specs.get ? currentProduct.specs.get('Brand') : '') || '';
    const categoryStr = currentProduct.category || '';
    const searchText = `${brandStr} ${currentProduct.name} ${categoryStr}`.trim();
    
    let similarProducts = [];

    if (isAmazon) {
      let exactMatches = [];
      if (currentProduct.originalId) {
        exactMatches = await RelifeProduct.find({ originalAsin: currentProduct.originalId });
      }
      
      const fuzzyMatches = await RelifeProduct.find(
        { $text: { $search: searchText } },
        { score: { $meta: "textScore" } }
      ).sort({ score: { $meta: "textScore" } }).limit(5);

      const seen = new Set();
      const combined = [...exactMatches, ...fuzzyMatches].filter(p => {
        if (seen.has(p._id.toString())) return false;
        seen.add(p._id.toString());
        return true;
      });

      similarProducts = combined.filter(p => p.availableUnits && p.availableUnits.length > 0);
      
      similarProducts.sort((a, b) => {
        if (a.originalAsin === currentProduct.originalId && b.originalAsin !== currentProduct.originalId) return -1;
        if (b.originalAsin === currentProduct.originalId && a.originalAsin !== currentProduct.originalId) return 1;
        
        const bestCondA = Math.max(...a.availableUnits.map(u => u.conditionScore || 0));
        const bestCondB = Math.max(...b.availableUnits.map(u => u.conditionScore || 0));
        return bestCondB - bestCondA;
      });

    } else {
      let exactMatches = [];
      if (currentProduct.originalAsin) {
        exactMatches = await AmazonProduct.find({ originalId: currentProduct.originalAsin });
      }

      const fuzzyMatches = await AmazonProduct.find(
        { $text: { $search: searchText } },
        { score: { $meta: "textScore" } }
      ).sort({ score: { $meta: "textScore" } }).limit(5);

      const seen = new Set();
      const combined = [...exactMatches, ...fuzzyMatches].filter(p => {
        if (seen.has(p._id.toString())) return false;
        seen.add(p._id.toString());
        return true;
      });

      similarProducts = combined;

      similarProducts.sort((a, b) => {
        if (a.originalId === currentProduct.originalAsin && b.originalId !== currentProduct.originalAsin) return -1;
        if (b.originalId === currentProduct.originalAsin && a.originalId !== currentProduct.originalAsin) return 1;
        return 0;
      });
    }

    res.json({
      currentProduct,
      isAmazon,
      similarProducts
    });
  } catch (error) {
    console.error("Cross-market rec error:", error);
    res.status(500).json({ message: error.message });
  }
};
