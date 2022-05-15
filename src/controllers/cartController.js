import db from "../db.js";

export async function postProductCart(req, res) {
    try {
        let cart = req.body;

        await db.collection('carts').insertOne(cart);

        console.log("Product added successfully...");
        return res.status(201).send("Product added successfully...");

    } catch (error) {
        console.log("Server Internal error... \n"), e;
        return res.sendStatus(500);
    }
}