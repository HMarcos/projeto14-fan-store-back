import bcrypt from "bcrypt";

import db from "../db.js";

import { registerSchema, loginSchema } from "../schemas/authSchemas.js";


export async function valitateRegister(req, res, next) {

    const register = req.body;

    const registerValidation = registerSchema.validate(register, { abortEarly: false });

    if (registerValidation.error) {
        const validationErrors = registerValidation.error.details.map(detail => detail.message);
        console.log(`Validation errors: `, validationErrors);
        return res.status(422).send(validationErrors);
    }

    try {
        let query = { email: register.email };
        let user = await db.collection("users").findOne(query);

        if (user) {
            console.log("User already registered...");
            return res.status(409).send("User already registered");
        }

        query = { cpf: register.cpf };
        user = await db.collection("users").findOne(query);

        if (user) {
            console.log("User already registered...");
            return res.status(409).send("User already registered");
        }

        next();

    } catch (e) {
        console.log("Server Internal error... \n", e);
        return res.sendStatus(500);
    }
}

export async function validateLogin(req, res, next) {

    const login = req.body;

    const loginValidation = loginSchema.validate(login, { abortEarly: false });

    if (loginValidation.error) {
        const validationErros = loginValidation.error.details.map(detail => detail.message);

        console.log("Validation errors: ", validationErros);
        return res.status(422).send(validationErros);
    }

    try {
        const query = { email: login.email };
        const user = await db.collection("users").findOne(query);

        if (!user) {
            console.log("User is incorrect...");
            return res.status(404).send("User is incorrect");
        }

        if (user && !bcrypt.compareSync(login.password, user.password)) {
            console.log("Password is incorrect...");
            return res.status(404).send("Password is incorrect");
        }

        res.locals.user = user;

        next();
    } catch (e) {
        console.log("Server Internal error... \n", e);
        return res.sendStatus(500);
    }
}
