import { StatusCodes } from 'http-status-codes';
import pick from '../utils/pick';
import ApiError from '../utils/ApiError';
import catchAsync from '../utils/catchAsync';
import { eventService } from '../services';

const createEvent = catchAsync(async (req, res) => {
    const { title, description, expiry_date, community } = req.body;
    let usr: any = req.user;

    const event = await eventService.createEvent(title, description, expiry_date, community, usr.wallet_address);
    res.status(StatusCodes.CREATED).send(event);
});

const getEvents = catchAsync(async (req, res) => {
    const filter = pick(req.query, ['id', 'unique_id', 'title', 'expiry_date', 'userID', 'createdAt', 'updatedAt']);
    const options = pick(req.query, ['sortBy', 'limit', 'page']);
    const result = await eventService.queryEvents(filter, options);
    res.send(result);
});

const getEvent = catchAsync(async (req, res) => {
    const event = await eventService.getEventById(req.params.eventId);
    if (!event) {
        throw new ApiError(StatusCodes.NOT_FOUND, 'Evet not found');
    }
    res.send(event);
});


export default {
    createEvent,
    getEvents,
    getEvent
};
