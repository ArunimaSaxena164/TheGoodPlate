const Joi = require("joi");

const listingValidationSchema = Joi.object({
  address: Joi.string().required(),
  coordinates: Joi.object({
    lat: Joi.number().required(),
    lng: Joi.number().required(),
  }).required(),
  foodDetails: Joi.array()
    .items(
      Joi.object({
        name: Joi.string().required(),
        quantity: Joi.number().required(),
        unit: Joi.string().required(),
        shelfLife: Joi.string()
          .pattern(/^\d+\s*(day|hour|minute|days|hours|minutes)$/i)
          .required(),
        description: Joi.string().allow("", null),
      })
    )
    .min(1)
    .required(),
});

module.exports = listingValidationSchema;
