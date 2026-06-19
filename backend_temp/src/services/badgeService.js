import { Badge } from '../models/Badge.js';
import { User } from '../models/User.js';
import { badgeRules } from '../engines/badgeRules.js';

export const badgeService = {
  async evaluateBadges(userId, prevBalance, newBalance) {
    const newlyEarned = badgeRules.newlyEarned(prevBalance, newBalance);
    
    if (newlyEarned.length > 0) {
      const highestTier = badgeRules.badgeFor(newBalance);
      
      await User.findByIdAndUpdate(userId, { highestBadge: highestTier });

      for (const tier of newlyEarned) {
        try {
          await Badge.create({
            userId,
            tier,
            thresholdAt: newBalance
          });
        } catch (err) {
          if (err.code !== 11000) throw err;
        }
      }
    }
    
    return newlyEarned;
  }
};
