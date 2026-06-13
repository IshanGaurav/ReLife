import { Credit } from '../models/Credit.js';
import { User } from '../models/User.js';
import { creditRules } from '../engines/creditRules.js';
import { badgeService } from './badgeService.js';

export const creditsService = {
  async awardCredits(userId, action) {
    const delta = creditRules.creditsFor(action);
    if (delta <= 0) return null;

    const user = await User.findById(userId);
    if (!user) throw new Error('User not found');

    const newBalance = creditRules.applyAction(user.greenCredits, action);
    
    const credit = await Credit.create({
      userId,
      action,
      amount: delta,
      balanceAfter: newBalance
    });

    user.greenCredits = newBalance;
    await user.save();

    await badgeService.evaluateBadges(user._id, newBalance - delta, newBalance);

    return credit;
  }
};
