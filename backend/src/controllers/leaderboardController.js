import { User } from '../models/User.js';

export const getLeaderboard = async (req, res) => {
  try {
    const { limit = 100, period = 'alltime', region = 'national', stateName, cityName } = req.query;

    let dateMatch = {};
    if (period !== 'alltime') {
      const now = new Date();
      let start = new Date();
      if (period === 'daily') {
        start.setHours(0, 0, 0, 0);
      } else if (period === 'weekly') {
        start.setDate(now.getDate() - now.getDay());
        start.setHours(0, 0, 0, 0);
      } else if (period === 'monthly') {
        start.setDate(1);
        start.setHours(0, 0, 0, 0);
      }
      dateMatch = { createdAt: { $gte: start } };
    }

    const userMatch = { role: 'customer' };
    if (region === 'state' && stateName) userMatch.state = stateName;
    if (region === 'city' && cityName) userMatch.city = cityName;

    const users = await User.aggregate([
      { $match: userMatch },
      {
        $lookup: {
          from: 'greencredittransactions',
          localField: '_id',
          foreignField: 'userId',
          pipeline: [
            { $match: dateMatch }
          ],
          as: 'transactions'
        }
      },
      {
        $addFields: {
          credits: {
            $sum: {
              $map: {
                input: "$transactions",
                as: "tx",
                in: {
                  $cond: [
                    { $eq: ["$$tx.type", "REDEEM"] },
                    { $multiply: ["$$tx.credits", -1] },
                    "$$tx.credits"
                  ]
                }
              }
            }
          },
          co2Saved: { $sum: "$transactions.co2Saved" },
          itemsReused: {
            $size: {
              $filter: {
                input: "$transactions",
                as: "tx",
                cond: { $eq: ["$$tx.type", "PURCHASE"] }
              }
            }
          }
        }
      },
      {
        $project: {
          _id: 1,
          name: 1,
          profileImage: "$avatar",
          city: { $ifNull: ["$city", "Unknown"] },
          state: { $ifNull: ["$state", "Unknown"] },
          credits: 1,
          co2Saved: 1,
          itemsReused: 1
        }
      },
      { $sort: { credits: -1, co2Saved: -1, itemsReused: -1 } },
      { $limit: parseInt(limit) }
    ]);

    const leaderboard = users.map((u, index) => {
      let badge = 'Bronze';
      if (u.credits >= 5000) badge = 'Platinum';
      else if (u.credits >= 1500) badge = 'Gold';
      else if (u.credits >= 500) badge = 'Silver';

      return {
        _id: u._id,
        userId: u._id,
        rank: index + 1,
        name: u.name,
        profileImage: u.profileImage,
        greenCredits: u.credits,
        co2Saved: u.co2Saved,
        itemsReused: u.itemsReused,
        badge: badge,
        city: u.city,
        state: u.state
      };
    });

    res.json({
      success: true,
      leaderboard
    });

  } catch (error) {
    console.error('LEADERBOARD ERROR:', error);
    res.status(500).json({ message: 'Failed to fetch leaderboard' });
  }
};
