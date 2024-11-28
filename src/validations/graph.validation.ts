import Joi from "joi";

const getEventGraph = {
    query: Joi.object().keys({
        eventID: Joi.number(),
        startDate: Joi.date(),
        endDate: Joi.date(),
    })
};



export default {
    getEventGraph,
};
  