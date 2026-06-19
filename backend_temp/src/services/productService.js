import { Product } from '../models/Product.js';
import { ValidationError, NotFoundError } from '../errors/index.js';

export const productService = {
  async submitProduct(ownerId, data) {
    if (!data.name || !data.category || data.price == null) {
      throw new ValidationError('Missing required product fields');
    }
    
    const product = await Product.create({
      ...data,
      ownerId,
      conditionScore: null,
      disposition: null,
      inspectionStatus: 'Pending',
    });
    
    return product;
  },

  async getProduct(productId) {
    const product = await Product.findById(productId);
    if (!product) throw new NotFoundError('Product not found');
    return product;
  },

  async updateProductStatus(productId, update) {
    const product = await Product.findByIdAndUpdate(productId, update, { new: true });
    if (!product) throw new NotFoundError('Product not found');
    return product;
  }
};
