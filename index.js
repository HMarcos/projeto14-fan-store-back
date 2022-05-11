import express, {json} from "express";
import cors from "cors";
import dotenv from "dotenv";

import db from "./db.js";

dotenv.config();


const app = express();
app.use(cors());
app.use(json())

// Executando a aplicação
const PORTA = process.env.PORT || 5500;

app.listen(PORTA, () => {
    console.log(`Execuntado a aplicação na porta ${PORTA} ...`);
})
