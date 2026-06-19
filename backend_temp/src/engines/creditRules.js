export const creditRules = {
  creditsFor(action) {
    switch (action) {
      case 'Resell': return 100;
      case 'Donate': return 150;
      case 'Recycle': return 75;
      case 'BuyRefurbished': return 50;
      case 'Return': return 0;
      default: return 0;
    }
  },

  applyAction(balance, action) {
    return balance + this.creditsFor(action);
  }
};
