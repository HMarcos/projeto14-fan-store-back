import db from '../db.js'

export async function getProducts(req,res) {

    try {
        const products = await db.collection('products').find({}).toArray();
        console.log(products);
        return res.status(200).send(products);
    } catch (error) {
        res.status(500).send("Error getting products");
    }
}