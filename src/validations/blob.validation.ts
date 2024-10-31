import Joi from 'joi';

const createBlob = Joi.object({
    image: Joi.any().required().label("Image file"), // Placeholder to ensure 'image' field exists
    type: Joi.string()
    .valid('users', 'threads')
    .required()
    .label("Type") 
});

export default {
    createBlob,
};
