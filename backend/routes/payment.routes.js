import express from "express";
import { createPaymentIntent2 } from "../controllers/payment.controller.js";

const paymentRouter = express.Router();

paymentRouter.post("/create-payment-intent", createPaymentIntent2);

export default paymentRouter;
