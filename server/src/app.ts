import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { env } from "./config/env";
import healthRoutes from "./routes/health.routes";
import { errorHandler, notFound } from "./middleware/error";

const app = express();

app.use(helmet());
app.use(cors({ origin: env.CLIENT_URL, credentials: true }));
app.use(express.json());
if (env.NODE_ENV !== "test") app.use(morgan("dev"));

app.use("/api/health", healthRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;