import { ObjectId } from 'mongodb';

import db from '../db.js'

export async function getProductById(req, res) {

    try {
        const { productId } = req.params;
        const product = await db.collection('products').findOne({  _id: new ObjectId(productId) });

        if (!product) {
            res.sendStatus(404);
            return;
        }

        return res.status(200).send(product);

    } catch (e) {
        console.log(e)
        res.status(500).send("Error getting product");
    }
}