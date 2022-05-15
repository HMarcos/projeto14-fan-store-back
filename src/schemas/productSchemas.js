import joi from "joi";

const productSchema = joi.object({
    productId: joi.string().required(),
    qty: joi.number().integer().required(),
    type: joi.string().valid("unique", "P", "M", "G").required()
});

export default productSchema;