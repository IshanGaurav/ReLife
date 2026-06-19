import { RecoveryProduct } from '../models/RecoveryProduct.js';
import { recoveryEngine } from '../engines/recoveryEngine.js';

export const recoveryService = {
  async evaluateRecovery(productId, returningCustomerId, conditionScore, productValue, logisticsCost) {
    const routing = recoveryEngine.route(conditionScore, productValue, logisticsCost);
    
    const recovery = await RecoveryProduct.create({
      productId,
      returningCustomerId,
      conditionScore,
      recoveryEligible: routing.eligible,
      productValue,
      logisticsCost,
      recoveryRatio: routing.ratio,
      routingDecision: routing.decision
    });
    
    return recovery;
  }
};
