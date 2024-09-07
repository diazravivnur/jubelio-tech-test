const Joi = require('joi');

const productSchema = Joi.object({
  title: Joi.string().required(),
  price: Joi.number().precision(2).required(),
  sku: Joi.string().required(),
  image: Joi.string().uri().required(),
  description: Joi.string().required()
});

const productUpdateSchema = productSchema.append({
  id: Joi.number().integer().required()
});

const productIdSchema = Joi.object({
  id: Joi.number().integer().required()
});

module.exports = { productSchema, productUpdateSchema, productIdSchema };
