import db from "./../db.js";

export async function postProductChart(req, res) {
    try {
        let chart = req.body;

        await db.collection('charts').insertOne(chart);

        console.log("Product added successfully...");
        return res.status(201).send("Product added successfully...");

    } catch (error) {
        console.log("Server Internal error... \n"), e;
        return res.sendStatus(500);
    }
}