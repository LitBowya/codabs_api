import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import dotenv from "dotenv";
import morgan from "morgan";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import connectDB from "./config/db.js";

// Routes
import authRoutes from "./routes/authRoutes.js";
import serviceRoutes from "./routes/serviceRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import subcategoryRoutes from "./routes/subcategoryRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";
import testimonialsRoutes from "./routes/testimonialRoutes.js";
import contactusRoutes from "./routes/contactusRoutes.js";
import blogRoutes from "./routes/blogRoutes.js";
import ourteamRoutes from "./routes/ourteamRoutes.js";
import analyticsRoutes from "./routes/analyticsRoutes.js";
import faqRoutes from "./routes/faqRoutes.js";
import appointmentRoutes from "./routes/appointmentRoutes.js";
import userRoutes from "./routes/userRoutes.js";

// Import middleware
import { errorHandler, notFound } from "./middlewares/errorMiddleware.js";
import { trackVisit } from "./middlewares/trackVisitMiddleware.js";

const app = express();

dotenv.config();
connectDB();

// Set trust proxy based on your deployment scenario
if (process.env.NODE_ENV === "production") {
  app.set("trust proxy", 1); // Trust first proxy if behind a reverse proxy
} else {
  app.set("trust proxy", false); // Disable trust proxy in development
}
app.use(cors());
app.use(cookieParser());
app.use(compression());
app.use(express.json({ limit: "100mb" }));
app.use(bodyParser.json({ limit: "100mb" }));
app.use(bodyParser.urlencoded({ limit: "100mb", extended: true }));
const limiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 500, // Limit each IP to 500 requests per windowMs
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

app.use(limiter);
app.use(helmet());
app.use(morgan("dev"));

app.get("/", trackVisit("page"), (req, res) => {
  res.status(200).json({ message: "API is running 🚀" });
});

app.use("/api/auth", authRoutes);
app.use("/api/service", serviceRoutes);
app.use("/api/category", categoryRoutes);
app.use("/api/subcategory", subcategoryRoutes);
app.use("/api/project", projectRoutes);
app.use("/api/testimonial", testimonialsRoutes);
app.use("/api/contact", contactusRoutes);
app.use("/api/blog", blogRoutes);
app.use("/api/team", ourteamRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/faq", faqRoutes);
app.use("/api/appointment", appointmentRoutes);
app.use("/api/user", userRoutes);

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 My server is running on port ${PORT}`));
