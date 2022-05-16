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

export async function deleteProductCart(req, res) {
    const { cart } = res.locals;
    const { idProduct } = req.params;

    try {
        const teste = await db.collection('carts').updateOne(
            { _id: cart._id },
            { $pull: { products: { productId: new ObjectId(idProduct) } } },
            false,
            false,
        );

        updateCartTotal(cart._id)

        console.log('executando delete')
        console.log(teste)
        res.sendStatus(200);

    } catch (error) {
        console.log("Server Internal error... \n", error);
        return res.sendStatus(500);
    }
}

async function updateCartTotal(cartId) {

    try {
        const cart = await db.collection('carts').findOne({ _id: cartId });
        const { products } = cart;

        const prices = await Promise.all(products.map(async (product) => {
            const { productId, qty } = product;

            const query = {
                _id: productId
            };

            const filter = {
                _id: 0,
                price: 1,
            };

            try {
                const productData = await db.collection("products").findOne(query, filter);

                const price = Number(qty) * productData.price;
                
                return price;

            } catch (error) {
                console.log("Server Internal error... \n", error);
                return res.sendStatus(500);
            }
        }));

        console.log(prices);

        const sum = prices.reduce((partialSum, a) => partialSum + a, 0);

        const operation = {
            $set: {
                totalValue: Number(sum)
            }
        };

        await db.collection("carts").updateOne({_id: cartId }, operation);

    } catch (error) {
        console.log("Server Internal error... \n", error);
        return res.sendStatus(500);
    }
}

export async function getInfoPayment(req, res) {
    const { cart } = res.locals;
    const { user } = res.locals;

    console.log(cart);

    const { products } = cart;
    const { address } = user;

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
                    qty,
                    name: productData.name,
                    price: productData.price,
                    
                }

                return infoProduct;

            } catch (error) {
                console.log("Server Internal error... \n", error);
                return res.sendStatus(500);
            }
        })
        );

        const paymentInfo = {
            products: infoProducts,
            userAddress: address,
            totalValue: cart.totalValue,
        }

        console.log(paymentInfo);

        res.status(200).send(paymentInfo);

    } catch (error) {
        console.log("Server Internal error... \n", error);
        return res.sendStatus(500);
    }
}