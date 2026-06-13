import { geminiVisionAdapter } from '../adapters/geminiVisionAdapter.js';
import { decisionEngine } from '../engines/decisionEngine.js';
import { productService } from './productService.js';
import { ValidationError } from '../errors/index.js';

export const inspectionService = {
  async performInspection(productId) {
    const product = await productService.getProduct(productId);
    
    if (!product.media || product.media.length === 0) {
      throw new ValidationError('No media available for inspection');
    }

    try {
      const analysis = await geminiVisionAdapter.analyze(product.media);
      
      let conditionScore = Math.round(analysis.score);
      if (conditionScore < 0) conditionScore = 0;
      if (conditionScore > 100) conditionScore = 100;
      
      const disposition = decisionEngine.decide(conditionScore);
      const inspectionReportId = `REP-${Date.now()}`;

      const updated = await productService.updateProductStatus(productId, {
        conditionScore,
        disposition,
        inspectionStatus: 'Completed',
        inspectionReportId
      });

      return { product: updated, analysis };
    } catch (error) {
       await productService.updateProductStatus(productId, {
        inspectionStatus: 'Failed'
      });
      throw error;
    }
  }
};
