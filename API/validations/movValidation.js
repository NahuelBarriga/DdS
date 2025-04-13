import Joi from "joi";

export const movSchema = Joi.object({
  monto: Joi.number().positive().required(),
  timestamp: Joi.date().required(),
  clienteNombre: Joi.string().max(30).allow("").required().messages({ "any.required": "El cliente es obligatorio."}),
  descripcion: Joi.string().max(255).allow("").required(),
  tag: Joi.string().valid("B", "N").required.messages({"tag.validate": "Debe pertenecer a un tag valido." }),
});
