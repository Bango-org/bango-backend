import { StatusCodes } from 'http-status-codes';
import pick from '../utils/pick';
import ApiError from '../utils/ApiError';
import catchAsync from '../utils/catchAsync';
import { threadService } from '../services';

const createThread = catchAsync(async (req, res) => {
    const { message, eventID, image } = req.body;
    let usr: any = req.user;

    const event = await threadService.createThread(message, eventID, usr.wallet_address, image);
    res.status(StatusCodes.CREATED).send(event);
});

const getThreads = catchAsync(async (req, res) => {
    const filter = pick(req.query, ['id', 'unique_id', 'eventID', 'userID', 'createdAt']);
    const options = pick(req.query, ['sortBy', 'limit', 'page']);
    const result = await threadService.queryTreads(filter, options);
    res.send(result);
});

const getThread = catchAsync(async (req, res) => {
    const thread = await threadService.getThreadById(req.params.threadId);
    if (!thread) {
        throw new ApiError(StatusCodes.NOT_FOUND, 'Thread not found');
    }
    res.send(thread);
});


export default {
    createThread,
    getThreads,
    getThread
};
