export const decisionEngine = {
  decide(conditionScore) {
    if (conditionScore > 85) return 'Resell';
    if (conditionScore >= 65) return 'Refurbish';
    if (conditionScore >= 35) return 'Donate';
    return 'Recycle';
  }
};
