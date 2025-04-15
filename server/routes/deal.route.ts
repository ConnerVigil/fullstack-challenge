import express, { Request, Response, NextFunction } from "express";
import { Deal, DealCreate } from "../models";

const router = express.Router();

// Get all deals
router.get("/", (req: Request, res: Response, next: NextFunction): void => {
  const db = req.app.locals.db;
  try {
    const deals: Deal[] = db.prepare("SELECT * FROM deals").all();
    res.json(deals);
  } catch (error) {
    console.error("Error fetching deals:", error);
    res.status(500).json({ error: "Failed to fetch deals" });
  }
});

// Create a new deal
router.post("/", (req: Request, res: Response, next: NextFunction): void => {
  const db = req.app.locals.db;

  const deal: DealCreate = {
    ...req.body,
  };

  try {
    const result = db
      .prepare(
        "INSERT INTO deals (account_id, organization_id, start_date, end_date, value, status) VALUES (?, ?, ?, ?, ?, ?)"
      )
      .run(
        deal.accountId,
        deal.organizationId,
        deal.startDate,
        deal.endDate,
        deal.value,
        deal.status
      );

    const newDeal: Deal = db
      .prepare("SELECT * FROM deals WHERE id = ?")
      .get(result.lastInsertRowid);

    res.status(201).json(newDeal);
  } catch (error) {
    console.error("Error creating deal:", error);
    res.status(500).json({ error: "Failed to create deal" });
  }
});

// Get all deals by organization ID
router.get(
  "/organization/:id",
  (req: Request, res: Response, next: NextFunction): void => {
    const db = req.app.locals.db;
    const { id } = req.params;
    const { status, year } = req.query;

    try {
      let query = "SELECT * FROM deals WHERE organization_id = ?";
      const params: any[] = [id];

      if (status) {
        query += " AND status = ?";
        params.push(status);
      }

      if (year) {
        // Filter by deals that overlap with the specified year
        const yearStart = `${year}-01-01`;
        const yearEnd = `${year}-12-31`;
        query += " AND start_date <= ? AND end_date >= ?";
        params.push(yearEnd, yearStart);
      }

      const deals: Deal[] = db.prepare(query).all(...params);

      res.json(deals);
    } catch (error) {
      console.error("Error fetching deals:", error);
      res.status(500).json({ error: "Failed to fetch deals" });
    }
  }
);

export default router;
