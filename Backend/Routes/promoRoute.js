import express from "express";
import { addPromo, listPromos, togglePromo, validatePromo } from "../Controllers/promoController.js";

const promoRouter = express.Router();

promoRouter.post("/add", addPromo);
promoRouter.get("/list", listPromos);
promoRouter.post("/toggle", togglePromo);
promoRouter.post("/validate", validatePromo);

export default promoRouter;
