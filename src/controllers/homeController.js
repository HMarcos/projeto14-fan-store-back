import db from '../db.js'

export async function getProducts(req, res) {
    const { category, franchise } = req.query;
    let match = {};

    if (category && franchise) {
        match = { $and: [{ idCategory: parseInt(category) }, { idFranchise: parseInt(franchise) }] };
    }
    else if (category) {
        match = { idCategory: parseInt(category) };
    }
    else if (franchise) {
        match = { idFranchise: parseInt(franchise) };
    }


    const queryStrings = req.query;

    try {
        const products = await db.collection('products').aggregate([
            {
                $match: match
            },
            {
                $lookup: {
                    from: "franchises",
                    localField: "idFranchise",
                    foreignField: "idFranchise",
                    as: "franchises"
                }
            }
        ]).toArray();

        //console.log(products);

        return res.status(200).send(products);
    } catch (e) {
        console.log(e);
        res.status(500).send("Error getting products");
    }
}

export async function getCategories(req, res) {
    try {
        const categories = await db.collection('categories').find({}).toArray();
        return res.status(200).send(categories);
    } catch {
        res.status(500).send("Error getting categories");
    }
}

export async function getFranchises(req, res) {
    try {
        const franchises = await db.collection('franchises').find({}).toArray();
        return res.status(200).send(franchises);
    } catch {
        res.status(500).send("Error getting franchises");
    }
}