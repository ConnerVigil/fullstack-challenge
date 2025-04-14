import express, { Request, Response, NextFunction } from "express";
import { Organization } from "../models";

const router = express.Router();

// Get all organizations
router.get("/", (req: Request, res: Response, next: NextFunction): void => {
  const db = req.app.locals.db;
  try {
    const organizations: Organization[] = db
      .prepare("SELECT * FROM organizations")
      .all();
    res.json(organizations);
  } catch (error) {
    console.error("Error fetching organizations:", error);
    res.status(500).json({ error: "Failed to fetch organizations" });
  }
});

// Get organization by ID
router.get("/:id", (req: Request, res: Response, next: NextFunction): void => {
  const db = req.app.locals.db;
  try {
    const organization: Organization | undefined = db
      .prepare("SELECT * FROM organizations WHERE id = ?")
      .get(req.params.id);

    if (!organization) {
      res.status(404).json({ error: "Organization not found" });
      return;
    }
    res.json(organization);
  } catch (error) {
    console.error("Error fetching organization:", error);
    res.status(500).json({ error: "Failed to fetch organization" });
  }
});

// Create a new organization
router.post("/", (req: Request, res: Response, next: NextFunction): void => {
  const db = req.app.locals.db;
  const { name } = req.body;

  if (!name) {
    res.status(400).json({ error: "Organization name is required" });
    return;
  }

  try {
    const result = db
      .prepare("INSERT INTO organizations (name) VALUES (?)")
      .run(name);

    const newOrganization: Organization = db
      .prepare("SELECT * FROM organizations WHERE id = ?")
      .get(result.lastInsertRowid);

    res.status(201).json(newOrganization);
  } catch (error) {
    console.error("Error creating organization:", error);
    res.status(500).json({ error: "Failed to create organization" });
  }
});

// Update an organization
router.put("/:id", (req: Request, res: Response, next: NextFunction): void => {
  const db = req.app.locals.db;
  const { name } = req.body;
  const { id } = req.params;

  if (!name) {
    res.status(400).json({ error: "Organization name is required" });
    return;
  }

  try {
    const existingOrg: Organization | undefined = db
      .prepare("SELECT * FROM organizations WHERE id = ?")
      .get(id);

    if (!existingOrg) {
      res.status(404).json({ error: "Organization not found" });
      return;
    }

    db.prepare(
      "UPDATE organizations SET name = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?"
    ).run(name, id);

    const updatedOrganization: Organization = db
      .prepare("SELECT * FROM organizations WHERE id = ?")
      .get(id);
    res.json(updatedOrganization);
  } catch (error) {
    console.error("Error updating organization:", error);
    res.status(500).json({ error: "Failed to update organization" });
  }
});

// Delete an organization
router.delete(
  "/:id",
  (req: Request, res: Response, next: NextFunction): void => {
    const db = req.app.locals.db;
    const { id } = req.params;

    try {
      const existingOrg: Organization | undefined = db
        .prepare("SELECT * FROM organizations WHERE id = ?")
        .get(id);

      if (!existingOrg) {
        res.status(404).json({ error: "Organization not found" });
        return;
      }

      db.prepare("DELETE FROM organizations WHERE id = ?").run(id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting organization:", error);
      res.status(500).json({ error: "Failed to delete organization" });
    }
  }
);

export default router;
