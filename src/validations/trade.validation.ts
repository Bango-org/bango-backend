import Joi from 'joi';

const buyTrade = {
  body: Joi.object().keys({
    eventId: Joi.number().required(),
    outcomeId: Joi.number().required(),
    usdtAmount: Joi.number().required(),
  })
};

const sellTrade = {
    body: Joi.object().keys({
      eventId: Joi.number().required(),
      outcomeId: Joi.number().required(),
      sharesToSell: Joi.number().required(),
    })
};


const getTrades = {
  query: Joi.object().keys({
    id: Joi.number(),
    unique_id: Joi.string(),
    order_type: Joi.string().valid('BUY', 'SELL'),
    order_size: Joi.number(),
    eventID: Joi.number(),
    outcomeId: Joi.number(),
    userID:  Joi.number(),
    startDate: Joi.date(),
    endDate: Joi.date(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer()
  })
};


const getOutcomeShares = {
  params: Joi.object().keys({
    eventId: Joi.number().integer()
  })
};

const getOutcomePrices = {
  params: Joi.object().keys({
    eventId: Joi.number().integer()
  })
};

export default {
  buyTrade,
  sellTrade,
  getOutcomePrices,
  getOutcomeShares,
  getTrades
};
