import joi from "joi";

export const registerSchema = joi.object({
    name: joi.string().required(),
    email: joi.string().email().required(),
    password: joi.string().min(8).required(),
    confirmationPassword: joi.string().valid(joi.ref('password')).required().messages(
        { 'any.only': '{{#label}} does not match' }
    ),
    cpf: joi.string().pattern(/^[0-9]{3}\.[0-9]{3}\.[0-9]{3}-[0-9]{2}$/).required(),
    phone: joi.string().pattern(/^\([0-9]{2}\)\s?[0-9]{4,5}-[0-9]{4}$/).required(),
    address: joi.object({
        cep: joi.string().pattern(/^[0-9]{5}-[0-9]{3}$/).required(),
        street: joi.string().required(),
        number: joi.string().required(),
        district: joi.string().required(),
        city: joi.string().required(),
        state: joi.string().required(),
        country: joi.string().required()
    }).required()
});

export const loginSchema = joi.object({
    email: joi.string().email().required(),
    password: joi.string().min(8).required()
})

