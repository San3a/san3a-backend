import User from '#src/modules/user/user.model.js';
import { asyncHandler } from '#src/shared/utils/async-handler.js';
import { SUCCESS } from '#src/shared/utils/response-status.js';
import {
    getAllUsers,
    getUserById,
    updateMe,
    deleteMe,
    getMyPastWork,
    getMyReviews,
} from './user.service.js';
export { getAllUsers, getUserById, updateMe, deleteMe, getMyPastWork, getMyReviews };

export const getTopTechniciansNearby = asyncHandler(async (req, res) => {
    const coords = req.user?.location?.coordinates;

    let pipeline = [];

    if (coords && coords.length === 2) {
        pipeline.push({
            $geoNear: {
                near: {
                    type: 'Point',
                    coordinates: coords,
                },
                distanceField: 'distance',
                spherical: true,
                query: { role: 'technician' },
            },
        });
    } else {
        pipeline.push({
            $match: { role: 'technician' },
        });
    }

    pipeline.push(
        { $sort: { rating: -1 } },
        { $limit: 5 },
        {
            $project: {
                name: 1,
                rating: 1,
                distance: 1,
                address: 1,
                image: 1,
            },
        }
    );

    const technicians = await User.aggregate(pipeline);

    res.json({
        status: SUCCESS,
        results: technicians.length,
        data: technicians,
    });
});
