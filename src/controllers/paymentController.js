import db from '../db.js'
import dayjs from 'dayjs';

export async function getInfoPayment(req, res) {
    const { cart } = res.locals;
    const { user } = res.locals;

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

export async function finishPayment(req, res) {
    const { cart } = res.locals;

    const { products } = cart;
    const { paymentType } = req.body;

    console.log(cart);
    console.log('--------------------');
    console.log(products);

    const time = dayjs().format("YYYY-MM-DD HH:mm:ss");
    console.log(time);

    const finalPayment = {
        cartId: cart._id,
        paymentType: paymentType,
        time: time,
    };

    console.log(finalPayment);

    try {

        await db.collection('purchases').insertOne(finalPayment);

        await Promise.all(products.map(async (product) => {

            const operation = selectProductOperation(product);
            await db.collection("products").updateOne({ _id: product.productId }, operation);
        }));


        // Atualizando o estoque do produto
        /*operation = selectProductOperation(product);
        await db.collection("products").updateOne({ _id: product.productId }, operation);*/

    } catch (error) {

        console.log("Server Internal error... \n", error);

        return res.sendStatus(500);

    }

    res.sendStatus(200);
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