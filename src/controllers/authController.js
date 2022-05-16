import bcrypt from "bcrypt"
import { v4 as uuid_v4 } from "uuid";

import db from "./../db.js";

const SALT_ROUNDS = 10;

export async function singUp(req, res) {

    let register = req.body;

    delete register.confirmationPassword;

    register = { ...register, password: bcrypt.hashSync(req.body.password, SALT_ROUNDS) };

    try {
        await db.collection("users").insertOne(register);

        console.log("User registered succesfully...");
        return res.status(201).send("User registered succesfully...");

    } catch (error) {
        console.log("Server Internal error... \n"), e;
        return res.sendStatus(500);
    }
}

export async function singIn(req, res) {

    const { user } = res.locals;

    const token = uuid_v4();

    try {

        let query = {
            userId: user._id,
            status: "opened",
            products: [],
            totalValue: 0
        }

        await db.collection("carts").insertOne(query);
        console.log("Cart created succesfully...");

        query = {
            token,
            userId: user._id,
            status: "active"
        }

        await db.collection("sessions").insertOne(query);
        console.log("Session registered succesfully...");

        const responseObject = {
            token
        };

        return res.status(200).send(responseObject);

    } catch (error) {
        console.log("Server Internal error... \n", error);
        return res.sendStatus(500);
    }

}
export async function logout(req, res) {
    const { cart } = res.locals;

    const { authorization } = req.headers;
    const token = authorization.replace("Bearer", "").trim();

    try {
        let query = { token };
        await db.collection("sessions").updateOne(query, {
            $set: { status: "inactive" }
        });

        query = { _id: cart._id }
        await db.collection("carts").updateOne(query, {
            $set: { status: "closed" }
        })

        console.log("Logout: Session finished...");

        return res.status(200).send("Logged out user...");

    } catch (error) {
        console.log("Server Internal error... \n", error);
        return res.sendStatus(500);
    }
}