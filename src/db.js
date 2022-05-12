import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

let db = null;
const mongoClient = new MongoClient(process.env.MONGO_URI);

try {
    await mongoClient.connect();
    db = mongoClient.db(process.env.DATABASE);

    console.log("Conexão ao MongoDB bem sucessida...");
} catch (error) {
    console.log("Error ao conectar ao MongoDB...\n", error);
    process.exit();
}

export default db;