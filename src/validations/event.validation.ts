import Joi from 'joi';

const createEvent = {
  body: Joi.object().keys({
    unique_id: Joi.string().required(),
    question: Joi.string().required(),
    description: Joi.string().required(),
    outcomes: Joi.array().items(Joi.string().min(1)).min(2),
    resolution_criteria: Joi.string().required(),
    image: Joi.string().required(),
    expiry_date:Joi.date().required(),
    community: Joi.array().items(Joi.string().min(1))
  })
};

const getEvents = {
  query: Joi.object().keys({
    id: Joi.number(),
    question: Joi.string(),
    status: Joi.string().valid('ACTIVE', 'EXPIRED', 'CLOSED'),
    community: Joi.string().optional(),
    userID: Joi.number(),
    updatedAt: Joi.date(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer()
  })
};

const getEvent = {
  params: Joi.object().keys({
    eventId: Joi.number().integer()
  })
};

const closeEvent = {
  params: Joi.object().keys({
    eventId: Joi.number().integer()
  })
};

export default {
  createEvent,
  getEvents,
  getEvent,
  closeEvent
};
