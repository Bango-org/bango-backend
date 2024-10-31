import Joi from 'joi';

const createThread = {
  body: Joi.object().keys({
    message: Joi.string().required(),
    eventID: Joi.number().required(),
    image: Joi.string(),
  })
};

const getThreads = {
  query: Joi.object().keys({
    id: Joi.number(),
    unique_id: Joi.string(),
    message: Joi.string(),
    eventID: Joi.number(),
    userID: Joi.number(),
    createdAt: Joi.date(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer()
  })
};

const getThread = {
  params: Joi.object().keys({
    threadId: Joi.number().integer()
  })
};

export default {
  createThread,
  getThreads,
  getThread,
};
