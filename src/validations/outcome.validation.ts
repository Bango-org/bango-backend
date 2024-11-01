import Joi from 'joi';

const getOutcomes = {
  query: Joi.object().keys({
    id: Joi.number(),
    outcome_title: Joi.string(),
    current_supply: Joi.date(),
    total_liquidity: Joi.array().items(Joi.string().min(1)),
    eventID: Joi.number(),
    updatedAt: Joi.date(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer()
  })
};

const getOutcome = {
  params: Joi.object().keys({
    outcomeId: Joi.number().integer()
  })
};

export default {
  getOutcomes,
  getOutcome,
};
