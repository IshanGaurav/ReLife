export const recoveryEngine = {
  route(conditionScore, productValue, logisticsCost, threshold = 2.0) {
    if (logisticsCost <= 0) throw new Error('Logistics cost must be positive');
    
    if (conditionScore < 90) {
      return { eligible: false, decision: 'Return To Seller', ratio: null };
    }

    const ratio = productValue / logisticsCost;
    const decision = ratio >= threshold ? 'Return To Seller' : 'Nearby Recovery Hub';
    
    return { eligible: true, decision, ratio };
  }
};
