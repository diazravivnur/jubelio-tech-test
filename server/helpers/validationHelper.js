const Joi = require('joi');

const productSchema = Joi.object({
  id: Joi.string().optional().allow(''),
  title: Joi.string().required(),
  price: Joi.number().precision(2).required(),
  sku: Joi.string().required(),
  image: Joi.string().uri().required(),
  description: Joi.string().required()
});

const productUpdateSchema = productSchema.append({
  id: Joi.string().required()
});

const productIdSchema = Joi.object({
  id: Joi.string().required()
});

module.exports = { productSchema, productUpdateSchema, productIdSchema };
