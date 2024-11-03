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
      usdtAmount: Joi.number().required(),
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
};
