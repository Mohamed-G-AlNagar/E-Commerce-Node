import express from "express";
import cors from "cors";

import main from "./src/controllers/main.js";
import userRouter from "./src/routers/userRouter.js";
import productRouter from "./src/routers/productRouter.js";
import categoryRouter from "./src/routers/categoryRouter.js";
import cartRouter from "./src/routers/cardRouter.js";
import couponRouter from "./src/routers/couponRouter.js";
import orderRouter from "./src/routers/orderRouter.js";

const server = express();

server.use(express.json());
server.use(cors());

server.get("/", main);
server.use("/api/v1/users", userRouter);
server.use("/api/v1/carts", cartRouter);
server.use("/api/v1/products", productRouter);
server.use("/api/v1/categories", categoryRouter);
server.use("/api/v1/coupones", couponRouter);
server.use("/api/v1/orders", orderRouter);

//working on remaining routes
server.all("*", (req, res, next) => {
  res.status(404).json({
    status: " failed to find the page",
    message: `Can't find the requested page ${req.originalUrl}`,
  });
});

server.options("*", cors());

export default server;
