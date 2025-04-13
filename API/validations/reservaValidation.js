import Joi from "joi";

export const reservaSchema = Joi.object({
  clienteId: Joi.number().integer().required().messages({
      "number.base": "El ID del cliente debe ser un número.",
      "any.required": "El cliente es obligatorio."
    }),
  clienteNombre: Joi.string().max(30).allow("").required().messages({
    "any.required": "El nombre del cliente es obligatorio."
  }),
  clienteTelefono: Joi.string().pattern(/^[0-9]+$/).messages({
    "string.pattern.base": "El teléfono del cliente debe contener solo números.",
    "any.required": "El teléfono del cliente es obligatorio."
  }),
  fecha: Joi.date().required(),
  comentario: Joi.string().max(255).allow("").optional(),
  cantPersonas: Joi.number().integer().min(1).required(),
  mesaId: Joi.number().integer(),
  estado: Joi.string().valid("pendiente", "aceptada", "rechazada").required(),
});
