import express from "express";
import cors from "cors";
import initializeDatabase from "./db";
import organizationRoutes from "./routes/organization.route";
import dealRoutes from "./routes/deal.route";
import accountRoutes from "./routes/account.route";

const app = express();
const port = process.env.PORT || 3000;

/**
 * Welcome to the Fullstack Challenge for the Server!
 *
 * This is a basic express server.
 * You can customize and organize it to your needs.
 * Good luck!
 */
const db = initializeDatabase();

// Make the database available to all route handlers
app.locals.db = db;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// API routes
app.use("/api/organizations", organizationRoutes);
app.use("/api/deals", dealRoutes);
app.use("/api/accounts", accountRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
