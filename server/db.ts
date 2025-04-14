import Database from "better-sqlite3";

function initializeDatabase() {
  const db = new Database("./database.sqlite", { verbose: console.log });
  db.prepare(
    `
    CREATE TABLE IF NOT EXISTS organizations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `
  ).run();

  db.prepare(
    `
    CREATE TABLE IF NOT EXISTS accounts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      organization_id INTEGER NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (organization_id) REFERENCES organizations(id)
    );
  `
  ).run();

  db.prepare(
    `
    CREATE TABLE IF NOT EXISTS deals (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      account_id INTEGER NOT NULL,
      organization_id INTEGER NOT NULL,
      start_date DATE NOT NULL,
      end_date DATE NOT NULL,
      value REAL NOT NULL,
      status TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (account_id) REFERENCES accounts(id),
      FOREIGN KEY (organization_id) REFERENCES organizations(id)
    );
  `
  ).run();

  // Seed data
  seedDatabase(db);

  return db;
}

function seedDatabase(db: Database.Database) {
  // Clear existing data
  db.prepare("DELETE FROM deals").run();
  db.prepare("DELETE FROM accounts").run();
  db.prepare("DELETE FROM organizations").run();

  // Reset auto-increment counters
  db.prepare(
    "DELETE FROM sqlite_sequence WHERE name IN ('organizations', 'accounts', 'deals')"
  ).run();

  // Insert organizations
  const organizations = [
    { name: "Acme Corporation" },
    { name: "Globex Industries" },
    { name: "Stark Enterprises" },
    { name: "Wayne Industries" },
    { name: "Umbrella Corporation" },
  ];

  const insertOrg = db.prepare("INSERT INTO organizations (name) VALUES (?)");
  organizations.forEach((org) => {
    insertOrg.run(org.name);
  });

  // Insert accounts with relationship to organizations
  const accounts = [
    { name: "Acme Sales", organization_id: 1 },
    { name: "Acme Marketing", organization_id: 1 },
    { name: "Globex Research", organization_id: 2 },
    { name: "Globex Development", organization_id: 2 },
    { name: "Stark Innovation", organization_id: 3 },
    { name: "Stark Defense", organization_id: 3 },
    { name: "Wayne Technology", organization_id: 4 },
    { name: "Wayne Philanthropy", organization_id: 4 },
    { name: "Umbrella Biotech", organization_id: 5 },
    { name: "Umbrella Security", organization_id: 5 },
  ];

  const insertAccount = db.prepare(
    "INSERT INTO accounts (name, organization_id) VALUES (?, ?)"
  );
  accounts.forEach((account) => {
    insertAccount.run(account.name, account.organization_id);
  });

  // Insert deals with relationships to accounts and organizations
  const dealStatuses = [
    "prospecting",
    "qualified",
    "proposal",
    "negotiation",
    "closed-won",
    "closed-lost",
  ];

  const deals = [
    {
      account_id: 1,
      organization_id: 1,
      start_date: "2023-01-01",
      end_date: "2023-12-31",
      value: 50000,
      status: "closed-won",
    },
    {
      account_id: 1,
      organization_id: 1,
      start_date: "2023-06-01",
      end_date: "2024-05-31",
      value: 75000,
      status: "negotiation",
    },
    {
      account_id: 2,
      organization_id: 1,
      start_date: "2023-03-15",
      end_date: "2023-09-15",
      value: 30000,
      status: "closed-won",
    },
    {
      account_id: 3,
      organization_id: 2,
      start_date: "2023-01-01",
      end_date: "2024-01-01",
      value: 100000,
      status: "proposal",
    },
    {
      account_id: 4,
      organization_id: 2,
      start_date: "2023-07-01",
      end_date: "2024-12-31",
      value: 250000,
      status: "qualified",
    },
    {
      account_id: 5,
      organization_id: 3,
      start_date: "2023-02-15",
      end_date: "2024-02-14",
      value: 500000,
      status: "closed-won",
    },
    {
      account_id: 6,
      organization_id: 3,
      start_date: "2023-09-01",
      end_date: "2024-08-31",
      value: 750000,
      status: "negotiation",
    },
    {
      account_id: 7,
      organization_id: 4,
      start_date: "2023-03-01",
      end_date: "2023-12-31",
      value: 125000,
      status: "closed-won",
    },
    {
      account_id: 8,
      organization_id: 4,
      start_date: "2023-05-15",
      end_date: "2024-05-14",
      value: 200000,
      status: "proposal",
    },
    {
      account_id: 9,
      organization_id: 5,
      start_date: "2023-04-01",
      end_date: "2023-10-31",
      value: 150000,
      status: "closed-lost",
    },
    {
      account_id: 10,
      organization_id: 5,
      start_date: "2023-08-15",
      end_date: "2024-08-14",
      value: 300000,
      status: "prospecting",
    },
  ];

  const insertDeal = db.prepare(
    "INSERT INTO deals (account_id, organization_id, start_date, end_date, value, status) VALUES (?, ?, ?, ?, ?, ?)"
  );
  deals.forEach((deal) => {
    insertDeal.run(
      deal.account_id,
      deal.organization_id,
      deal.start_date,
      deal.end_date,
      deal.value,
      deal.status
    );
  });
}

export default initializeDatabase;
