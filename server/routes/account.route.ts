import express, { NextFunction, Request, Response } from "express";
import { Account, AccountCreate } from "../models";

const router = express.Router();

// Get all accounts
router.get("/", (req: Request, res: Response, next: NextFunction) => {
  const db = req.app.locals.db;
  try {
    const accounts = db.prepare("SELECT * FROM accounts").all();
    res.json(accounts);
  } catch (error) {
    console.error("Error fetching accounts:", error);
    res.status(500).json({ error: "Failed to fetch accounts" });
  }
});

// Create a new account
router.post("/", (req: Request, res: Response, next: NextFunction) => {
  const db = req.app.locals.db;

  const account: AccountCreate = {
    ...req.body,
  };

  if (!account.name || !account.organizationId) {
    res.status(400).json({ error: "Name and organizationId are required" });
    return;
  }

  try {
    const result = db
      .prepare("INSERT INTO accounts (name, organization_id) VALUES (?, ?)")
      .run(account.name, account.organizationId);

    const newAccount: Account = db
      .prepare("SELECT * FROM accounts WHERE id = ?")
      .get(result.lastInsertRowid);

    res.status(201).json(newAccount);
  } catch (error) {
    console.error("Error creating account:", error);
    res.status(500).json({ error: "Failed to create account" });
  }
});

export default router;
