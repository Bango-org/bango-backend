import { StatusCodes } from 'http-status-codes';
import pick from '../utils/pick';
import ApiError from '../utils/ApiError';
import catchAsync from '../utils/catchAsync';
import { eventService } from '../services';
import prisma from '../client';
import { EventStatus } from '@prisma/client';

const createEvent = catchAsync(async (req, res) => {
    const { question, description, outcomes, resolution_criteria, image, expiry_date, community } = req.body;
    let usr: any = req.user;

    const event = await eventService.createEvent(question, description, outcomes, resolution_criteria, image, expiry_date, community, usr.wallet_address);
    res.status(StatusCodes.CREATED).send(event);
});

const getEvents = catchAsync(async (req, res) => {
    const filter = pick(req.query, ['id', 'unique_id', 'question', 'expiry_date', 'userID', 'status', 'createdAt', 'updatedAt']);
    const options = pick(req.query, ['sortBy', 'limit', 'page']);
    const result = await eventService.queryEvents(filter, options);
    res.send(result);
});

const getEvent = catchAsync(async (req, res) => {
    const event = await eventService.getEventById(req.params.eventId);
    if (!event) {
        throw new ApiError(StatusCodes.NOT_FOUND, 'Event not found');
    }
    res.send(event);
});

const closeEvent = catchAsync(async (req, res) => {
    
    const usr: any = req.user;
    const { eventId, outcomeWonId } = req.body;

    let event = await prisma.event.findFirst({
        where: {
            id: eventId
        }
    })
    
    if (event === null) {
        res.status(404).send("Event not found");
        return;
    }
    
    if (usr.id !== event?.userID) {
        res.status(400).send("Don't have permission to close the event");
        return;
    }
    
    let outcome = await prisma.outcome.findFirst({
        where: {
            id: outcomeWonId,
            event: {
                id: eventId
            }
        }
    })
    
    if (outcome === null) {
        res.status(404).send("Outcome not found in event");
        return;
    }
    
    
    
    event = await prisma.event.update({
        where: {id: eventId},
        data: {
            status: EventStatus.CLOSED,
            outcomeWon: outcomeWonId
        }
    })

    res.status(200).send("Event Closed");
});

export default {
    createEvent,
    getEvents,
    getEvent,
    closeEvent
};
