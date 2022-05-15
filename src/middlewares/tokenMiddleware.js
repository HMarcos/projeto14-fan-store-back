import db from "./../db.js";


export default async function validateToken(req, res, next) {
    const { authorization } = req.headers;
    const token = authorization?.replace("Bearer", "").trim();

    if (!token) {
        console.log("Could not parse token...");
        return res.status(401).send("Could not validate user, no token");
    }

    try {
        let query = { $and: [{ token }, { status: "active" }] };
        const session = await db.collection("sessions").findOne(query);

        if (!session) {
            console.log("Could not find a session...");
            return res.status(401).send("Could not validate user, invalid token");
        }

        query = { _id: session.userId };
        const user = await db.collection("users").findOne(query);

        if (!user) {
            console.log("Could not find a user...");
            return res.status(404).send("Could not validate user, invalid user");
        }

        res.locals.user = user;
        console.log("Token is valid...");
        next();

    } catch (e) {
        console.log("Server Internal error... \n", e);
        return res.sendStatus(500);
    }

};

