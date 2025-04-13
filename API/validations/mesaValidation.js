import Joi from "joi";

export const mesaSchema = Joi.object({
  numero: Joi.number().integer().positive().required(),
  piso: Joi.number().integer().positive().required(),
  locacion: Joi.object({
      x: Joi.number().integer().positive().required(),
      y: Joi.number().integer().positive().required()
    })
    .required()
    .messages({
    "any.required": "La locacion es obligatoria."
    }),
  size: Joi.object({
    width: Joi.number().integer().positive().required(),
    height: Joi.number().integer().positive().required()
  })
  .required()
  .messages({
  "any.required": "La tamaño es obligatorio."
  }),
  estado: Joi.string().valid("disponible", "ocupada", "reservada", "no disponible").required().messages({"tag.validate": "Debe pertenecer a un estado valido." }),
  descripcion: Joi.string().max(255).allow("").required(),
  tipo: Joi.string().messages({"tag.validate": "Debe pertenecer a un tag valido." }),
});
