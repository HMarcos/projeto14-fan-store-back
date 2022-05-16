import { ObjectId } from "mongodb";
import db from "../db.js";

export async function updateProductCart(req, res) {
    // {productId, qty, type}
    const { cart } = res.locals;
    console.log(cart);

    const product = {
        ...req.body,
        qty: Number(req.body.qty),
        productId: new ObjectId(req.body.productId)
    }

    try {
        let operation = {
            $push: { products: product }
        };

        let query = {
            _id: cart._id
        }

        // Adicionando o objeto ao array de produtos no carrinho
        await db.collection("carts").updateOne(query, operation);

        // Atualizando o valor total do carrinho
        const purchasedProduct = await db.collection("products").findOne({ _id: product.productId });
        operation = {
            $inc: {
                totalValue: (purchasedProduct.price * product.qty)
            }
        };

        await db.collection("carts").updateOne(query, operation);

        // Atualizando o estoque do produto
        /*operation = selectProductOperation(product);
        await db.collection("products").updateOne({ _id: product.productId }, operation);*/

        res.status(200).send("Product added to the cart");


    } catch (error) {
        console.log("Server Internal error... \n", error);
        return res.sendStatus(500);
    }
}

function selectProductOperation (product){
    
    let operation = null;
    
    if (product.type.toUpperCase() === 'P') {
        operation = {
            $inc: {
                pQty: (-product.qty)
            }
        };
    }

    else if (product.type.toUpperCase() === 'M') {
        operation = {
            $inc: {
                mQty: (-product.qty)
            }
        };
    }

    else if (product.type.toUpperCase() === 'G') {
        operation = {
            $inc: {
                gQty: (-product.qty)
            }
        };
    }

    else {
        operation = {
            $inc: {
                uniqueQty: (-product.qty)
            }
        };
    }

    return operation;
}

export async function renderCart(req, res) {
    const { cart } = res.locals;
    console.log(cart);

    res.status(200).send(cart);

}