import Joi from 'joi';

const getUsers = {
  query: Joi.object().keys({
    username: Joi.string(),
    wallet_address: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer()
  })
};

const getUser = {
  params: Joi.object().keys({
    wallet_address: Joi.string().required()
  })
};

const updateUser = {
  params: Joi.object().keys({
    wallet_address: Joi.string().required()
  }),
  body: Joi.object()
    .keys({
      about: Joi.string(),
      profile_pic: Joi.string().required(),
    })
    .min(1)
};


export default {
  getUsers,
  getUser,
  updateUser,
};
