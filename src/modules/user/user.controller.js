import { asyncHandler } from '#src/shared/utils/async-handler.js';
import { FAIL, SUCCESS } from '#src/shared/utils/response-status.js';
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
    const coords = req.user?.address?.coordinates;

    const technicians = await User.aggregate([
        {
            $geoNear: {
                near: {
                    type: 'Point',
                    coordinates: coords,
                },
                distanceField: 'distance',
                spherical: true,
                query: { role: 'technician' },
            },
        },
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
        },
    ]);

    res.json({
        status: SUCCESS,
        results: technicians.length,
        data: technicians,
    });
});
