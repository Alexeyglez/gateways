import "dotenv/config";
import "express-async-errors";
//express
import express from "express";
const app = express();
//rest of packages
import morgan from "morgan";
import helmet from "helmet";
import cors from "cors";
import xss from "xss-clean";
import mongoSanitize from "express-mongo-sanitize";

//database
import connectdb from "./db/connectdb.js";

//Import Routes
import gatewayRouter from "./routes/gatewayRoute.js";
import peripheralRouter from "./routes/peripheralRoute.js";

//middlewares
import errorHandlerMiddleware from "./middlewares/error-handler.js";
import notFoundMiddleware from "./middlewares/not-found.js";

if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

app.use(helmet());
app.use(cors());
app.use(xss());
app.use(mongoSanitize());

app.use(express.json());

//Routes
app.use("/api/v1/gateways", gatewayRouter);
app.use("/api/v1/peripherals", peripheralRouter);

app.use(errorHandlerMiddleware);
app.use(notFoundMiddleware);

const port = process.env.PORT || 5000;

const start = async () => {
  try {
    await connectdb(process.env.MONGO_URL);
    app.listen(port, () => {
      console.log(`Server listen on port ${port}`);
    });
  } catch (error) {
    console.log(error);
  }
};

start();

// export for jest tests
export default app;
