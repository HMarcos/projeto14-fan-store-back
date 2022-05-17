import db from "./../db.js";

export async function getPurchaseHistory(req, res) {
    const {user} = res.locals;

    try{
        let query = {$and: [{userId: user._id}, {status: "closed"}]};

        const carts = await db.collection("carts").find(query).toArray();
        
        let purchasedHistory = await Promise.all ( carts.map( async (cart) => {
            const purchased = await db.collection('purchases').findOne({cartId: cart._id});

            if (purchased) {
                const history = {...purchased, value: cart.totalValue};
                return history;
            } 

        }));

        purchasedHistory = purchasedHistory.filter((cart) => {
            return (
                !(cart === undefined)
            )
        });
        console.log(purchasedHistory);
        res.status(200).send(purchasedHistory);

    } catch(e){
        console.log("Server Internal error... \n", e);
        return res.sendStatus(500);
    }
}