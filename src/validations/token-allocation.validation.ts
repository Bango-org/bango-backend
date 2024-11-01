import Joi from 'joi';

const getTokenAllocations = {
  query: Joi.object().keys({
    id: Joi.number(),
    amount: Joi.number(),
    userId: Joi.number(),
    outcomeId: Joi.number(),
    updatedAt: Joi.date(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer()
  })
};

const getTokenAllocation = {
  params: Joi.object().keys({
    tokenAllocationId: Joi.number().integer()
  })
};

export default {
  getTokenAllocations,
  getTokenAllocation,
};
