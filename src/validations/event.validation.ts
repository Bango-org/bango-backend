import Joi from 'joi';

const createEvent = {
  body: Joi.object().keys({
    question: Joi.string().required(),
    description: Joi.string().required(),
    option_a: Joi.string().required(),
    option_b: Joi.string().required(),
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
    expiry_date: Joi.date(),
    community: Joi.array().items(Joi.string().min(1)),
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

export default {
  createEvent,
  getEvents,
  getEvent,
};
