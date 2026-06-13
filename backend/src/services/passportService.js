import { ProductPassport } from '../models/ProductPassport.js';
import { NotFoundError } from '../errors/index.js';
import { productService } from './productService.js';

export const passportService = {
  async generatePassport(productId) {
    const product = await productService.getProduct(productId);
    
    const passport = await ProductPassport.create({
      productId: product._id,
      productName: product.name,
      category: product.category,
      ownershipHistory: [{ ownerId: product.ownerId, date: new Date() }],
      repairHistory: [],
      inspectionReport: product.inspectionReportId || 'None',
      conditionScore: product.conditionScore || 0,
      expectedLifespanMonths: 36
    });
    
    await productService.updateProductStatus(productId, { passportId: passport._id });
    
    return passport;
  },

  async getPassportByProductId(productId) {
    const passport = await ProductPassport.findOne({ productId });
    if (!passport) throw new NotFoundError('Passport not found for this product');
    return passport;
  }
};
