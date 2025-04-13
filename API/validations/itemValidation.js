import Joi from "joi";

export const itemSchema = Joi.object({
  nombre: Joi.string().max(255).allow("").optional(),
  categoriaId: Joi.number().integer().required().messages({
    "number.base": "El ID de la categoria debe ser un número.",
    "any.required": "La categoria es obligatorio."
  }),
  stock: Joi.boolean().optional(), 
  imagen: Joi.string().max(255).allow("").optional(),
  descripcion: Joi.string().max(255).allow("").optional(),
  precio: Joi.number().positive().required(),
  tag: Joi.string().valid("GF", "Veg", "V", "").optional(),
});
