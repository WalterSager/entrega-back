import express from "express";
import config from "./config/index.js";
import viewsRouter from "./routes/views.router.js";
import hbs from "express-handlebars";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import passport from "passport";
import initializedPassport from "./config/passport/config.js";
import path from "path"; 
import { fileURLToPath } from "url"; //Convierte la metaUrl en un path correcto 
import cors from "cors";
import indexRouter from "./routes/index.router.js";
import ticketModel from "./daos/mongo/models/ticket.model.js";
const __filename = fileURLToPath(import.meta.url); //Rescata la URL base del proyecto 
const __dirname = path.dirname(__filename); 



const { PORT, MONGO_URI } = config;
const server = express();

server.engine("handlebars", hbs.engine()); 
server.set("views", __dirname + "/views"); 
server.set("view engine", "handlebars");

server.use(cookieParser());
server.use(express.json());
server.use(express.urlencoded({ extended: true }));
server.use(cors());
initializedPassport();
server.use(passport.initialize());

server.use(express.static(path.join(__dirname, "../public")));
server.use("/", viewsRouter);
server.use("/api", indexRouter);



server.listen(PORT, () => console.log(`http://localhost:${PORT}`))

mongoose.connect(MONGO_URI, { dbName: "integrative_practice" })
  .then(() => console.log("Conectado a mongoDB"))
  .catch((err) => {
    console.error({ error: err.message })
    process.exit(1)
  })
