import Joi from 'joi';

const sendBitcoin = {
  body: Joi.object().keys({
    walletAddress: Joi.string().required(),
    signature: Joi.string().required(),
  })
};
export default {
    sendBitcoin
};
