import Joi from 'joi';

const createEvent = {
  body: Joi.object().keys({
    title: Joi.string().required(),
    description: Joi.string().required(),
    expiry_date:Joi.date().required(),
    community: Joi.array().items(Joi.string().min(1))
  })
};

const getEvents = {
  query: Joi.object().keys({
    id: Joi.number(),
    unique_id: Joi.string(),
    title: Joi.string(),
    expiry_date: Joi.date(),
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
