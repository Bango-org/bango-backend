import { StatusCodes } from 'http-status-codes';
import pick from '../utils/pick';
import ApiError from '../utils/ApiError';
import catchAsync from '../utils/catchAsync';
import { outcomeService } from '../services';

const getOutcomes = catchAsync(async (req, res) => {
    const filter = pick(req.query, ['id', 'outcome_title', 'current_supply', 'total_liquidity', 'eventID', 'createdAt', 'updatedAt']);
    const options = pick(req.query, ['sortBy', 'limit', 'page']);
    const result = await outcomeService.queryOutcome(filter, options);
    res.send(result);
});

const getOutcome = catchAsync(async (req, res) => {
    const outcome = await outcomeService.getOutcomeById(req.params.outcomeId);
    if (!outcome) {
        throw new ApiError(StatusCodes.NOT_FOUND, 'Outcome not found');
    }
    res.send(outcome);
});


export default {
    getOutcomes,
    getOutcome
};
