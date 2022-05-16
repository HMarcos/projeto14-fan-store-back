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

function selectProductOperation(product) {

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

    const { products } = cart;

    try {
        const infoProducts = await Promise.all(products.map(async (product) => {
            const { productId, qty, type } = product;

            const query = {
                _id: productId
            };

            const filter = {
                _id: 0,
                name: 1,
                price: 1,
                url: 1
            };

            try {
                const productData = await db.collection("products").findOne(query, filter);

                const infoProduct = {
                    productId,
                    type,
                    qty,
                    name: productData.name,
                    price: productData.price,
                    url: productData.url
                }

                return infoProduct;

            } catch (error) {
                console.log("Server Internal error... \n", error);
                return res.sendStatus(500);
            }
        })
        );

        const finalCart = {
            ...cart,
            products: infoProducts
        }

        console.log(finalCart);

        res.status(200).send(finalCart);

    } catch (error) {
        console.log("Server Internal error... \n", error);
        return res.sendStatus(500);
    }
}

/*const cart = {
    userId: "627df3e2ccb008e40e3b0c44",
    status: "opened",
    products: [{
        productId: "627c25764fe14e657acaa975",
        qty: 1,
        type: "P",
        name: "Camiseta Spider Man super maneira com silk etc e tal",
        price: 50,
        url: "https://m.media-amazon.com/images/I/41rmhM8oA-L._AC_.jpg"
    },
    totalValue: 78
]*/