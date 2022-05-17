import db from "../db.js";
import productSchema from "../schemas/productSchemas.js";

export function validateProduct(req, res, next) {
    const product = req.body;

    const productValidation = productSchema.validate(product, { abortEarly: false });

    if (productValidation.error) {
        const validationErrors = productValidation.error.details.map(detail => detail.message);
        console.log(`Validation errors: `, validationErrors);
        return res.status(422).send(validationErrors);
    }

    next();

}

export async function getUserCart(req, res, next) {
    const { user } = res.locals;

    try {
        let query = { $and: [{ userId: user._id }, { status: "opened" }] };

        const cart = await db.collection("carts").findOne(query);

        if (!cart) {
            console.log("Couldn't find a valid cart...");
            return res.status(404).send("Couldn't find a valid cart...");
        }

        res.locals.cart = cart;

        next();
    }
    catch (e) {
        console.log("Server Internal error... \n", e);
        return res.sendStatus(500);
    }
}


