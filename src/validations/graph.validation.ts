import Joi from "joi";

const getEventGraph = {
    query: Joi.object().keys({
        eventID: Joi.number(),
        startDate: Joi.date(),
        endDate: Joi.date(),
        type: Joi.string()
            .valid('hour', 'day', 'month','year','all')
            .default('hour')
    })
};



export default {
    getEventGraph,
};
