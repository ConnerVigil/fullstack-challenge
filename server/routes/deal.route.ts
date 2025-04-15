import express, { Request, Response, NextFunction } from "express";
import { Deal, DealCreate, DealRow } from "../models";

const router = express.Router();

// Utility function to map database row to Deal interface
const mapDealRowToDeal = (deal: DealRow): Deal => ({
  id: deal.id,
  accountId: deal.account_id,
  organizationId: deal.organization_id,
  startDate: new Date(deal.start_date),
  endDate: new Date(deal.end_date),
  value: deal.value,
  status: deal.status,
  createdAt: new Date(deal.created_at),
  updatedAt: new Date(deal.updated_at),
});

// Get all deals
router.get("/", (req: Request, res: Response, next: NextFunction): void => {
  const db = req.app.locals.db;
  try {
    const dealRows: DealRow[] = db.prepare("SELECT * FROM deals").all();
    const deals: Deal[] = dealRows.map(mapDealRowToDeal);
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

    const newDealRow: DealRow = db
      .prepare("SELECT * FROM deals WHERE id = ?")
      .get(result.lastInsertRowid);

    const newDeal: Deal = mapDealRowToDeal(newDealRow);

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

      const deals: DealRow[] = db.prepare(query).all(...params);
      const mappedDeals: Deal[] = deals.map(mapDealRowToDeal);

      res.json(mappedDeals);
    } catch (error) {
      console.error("Error fetching deals:", error);
      res.status(500).json({ error: "Failed to fetch deals" });
    }
  }
);

export default router;
