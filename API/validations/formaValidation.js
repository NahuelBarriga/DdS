import Joi from "joi";

export const formaSchema = Joi.object({
    start: Joi.object({
        x: Joi.number().integer().positive().required(),
        y: Joi.number().integer().positive().required()
    })
     .required()
     .messages({
     "any.required": "La locacion de inicio es obligatoria."
    }),
    end: Joi.object({
        x: Joi.number().integer().positive().required(),
        y: Joi.number().integer().positive().required()
    })
     .required()
     .messages({
     "any.required": "La locacion de fin es obligatoria."
    }),
    fill: Joi.boolean().required().messages({"tag.validate": "Debe ser un booleano." }),
    tipo: Joi.string().valid("line", "rect", "circle").required().messages({"tag.validate": "Debe pertenecer a una forma valida." }),
});
