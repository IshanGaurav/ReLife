export const badgeRules = {
  badgeFor(balance) {
    if (balance >= 1000) return 'Gold Circular Citizen';
    if (balance >= 500) return 'Silver Circular Citizen';
    if (balance >= 100) return 'Bronze Circular Citizen';
    return null;
  },

  newlyEarned(prevBalance, newBalance) {
    const thresholds = [
      { tier: 'Bronze Circular Citizen', threshold: 100 },
      { tier: 'Silver Circular Citizen', threshold: 500 },
      { tier: 'Gold Circular Citizen', threshold: 1000 },
    ];
    
    return thresholds
      .filter(t => t.threshold > prevBalance && t.threshold <= newBalance)
      .map(t => t.tier);
  }
};
