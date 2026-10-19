import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { env } from "./config/env";
import { apiLimiter } from "./middleware/rateLimit";
import healthRoutes from "./routes/health.routes";
import { errorHandler, notFound } from "./middleware/error";
import authRoutes from "./routes/auth.routes";
import requestRoutes from "./routes/request.routes";
import adminRoutes from "./routes/admin.routes";
import uploadRoutes from "./routes/upload.routes";

const app = express();

app.set("trust proxy", 1);

const allowedOrigins = env.CLIENT_URL.split(",").map((o) => o.trim());


app.use(helmet());
app.use(cors({ origin: allowedOrigins, credentials: true }));
app.use(express.json({ limit: "100kb" }));
if (env.NODE_ENV !== "test") app.use(morgan("dev"));

app.use("/api", apiLimiter);
app.use("/api/health", healthRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/requests", requestRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/uploads", uploadRoutes);
app.use(notFound);
app.use(errorHandler);

export default app;