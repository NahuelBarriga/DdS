import Joi from "joi";

export const pedidoSchema = Joi.object({
  clienteId: Joi.number().integer().required().messages({
    "number.base": "El ID del cliente debe ser un número.",
    "any.required": "El cliente es obligatorio."
  }),
  clienteNombre: Joi.string().max(30).allow("").required().messages({
    "any.required": "El cliente es obligatorio."
  }),
  mesaId: Joi.number().integer().required().messages({
    "number.base": "El ID de la mesa debe ser un número.",
    "any.required": "La mesa es obligatoria."
  }),
  items: Joi.array()
    .items(
      Joi.object({
        id: Joi.number().integer().required(),
        cantidad: Joi.number().integer().min(1).required()
      })
    )
    .min(1)
    .required()
    .messages({
      "array.min": "Debe haber al menos un ítem en el pedido.",
      "any.required": "Los ítems son obligatorios."
    }),
  comentario: Joi.string().max(255).allow("").optional(),
  timestamp: Joi.date().required(),
  total: Joi.number().positive().required(),
  estado: Joi.string().valid("pendiente", "confirmado", "rechazado", "pago", "finalizado").required(),
});
