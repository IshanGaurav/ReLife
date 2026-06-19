import { Product } from '../models/Product.js';

export const openBoxService = {
  async publishOpenBox(productId, discountPercentage) {
    const product = await Product.findById(productId);
    if (!product) throw new Error('Product not found');
    
    if (product.conditionScore < 65) {
      throw new Error('Condition score too low for Open Box');
    }

    product.openBox = true;
    product.price = product.price * (1 - discountPercentage / 100);
    await product.save();
    
    return product;
  }
};
