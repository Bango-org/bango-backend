import Joi from 'joi';

const createThread = {
  body: Joi.object().keys({
    message: Joi.string().allow(""),
    eventID: Joi.number().required(),
    image: Joi.string().allow(""),
  }).custom((value, helpers) => {
    if (!value.message && !value.image) {
      return helpers.error('any.custom', { message: 'At least one of message or image is required' });
    }
    return value;
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
