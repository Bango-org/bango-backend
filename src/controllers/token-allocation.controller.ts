import { StatusCodes } from 'http-status-codes';
import pick from '../utils/pick';
import ApiError from '../utils/ApiError';
import catchAsync from '../utils/catchAsync';
import { tokenAllocationService } from '../services';

const getTokenAllocations = catchAsync(async (req, res) => {
    const filter = pick(req.query, ['id', 'amount', 'userId', 'outcomeId', 'createdAt', 'updatedAt']);
    const options = pick(req.query, ['sortBy', 'limit', 'page']);
    const result = await tokenAllocationService.queryTokenAllocation(filter, options);
    res.send(result);
});

const getTokenAllocation = catchAsync(async (req, res) => {
    const tokenAllocation = await tokenAllocationService.getTokenAllocationById(req.params.tokenAllocationId);
    if (!tokenAllocation) {
        throw new ApiError(StatusCodes.NOT_FOUND, 'User\'s Allocation not found');
    }
    res.send(tokenAllocation);
});


export default {
    getTokenAllocations,
    getTokenAllocation
};
