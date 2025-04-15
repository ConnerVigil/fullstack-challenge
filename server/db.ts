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

  seedDatabase(db);

  return db;
}

function seedDatabase(db: Database.Database) {
  db.prepare("DELETE FROM deals").run();
  db.prepare("DELETE FROM accounts").run();
  db.prepare("DELETE FROM organizations").run();

  // Reset auto-increment counters
  db.prepare(
    "DELETE FROM sqlite_sequence WHERE name IN ('organizations', 'accounts', 'deals')"
  ).run();

  const organizations = [
    { name: "Acme Corporation" },
    { name: "Globex Industries" },
    { name: "Stark Enterprises" },
    { name: "Wayne Industries" },
    { name: "Umbrella Corporation" },
    { name: "Wayne Enterprises" },
  ];

  const insertOrg = db.prepare("INSERT INTO organizations (name) VALUES (?)");
  organizations.forEach((org) => {
    insertOrg.run(org.name);
  });

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

  const deals = [
    {
      account_id: 1,
      organization_id: 1,
      start_date: "2022-01-01",
      end_date: "2023-12-31",
      value: 50000,
      status: "closed-won",
    },
    {
      account_id: 1,
      organization_id: 1,
      start_date: "2021-06-01",
      end_date: "2022-05-31",
      value: 75000,
      status: "negotiation",
    },
    {
      account_id: 2,
      organization_id: 1,
      start_date: "2024-03-15",
      end_date: "2025-09-15",
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
      start_date: "2025-07-01",
      end_date: "2026-12-31",
      value: 250000,
      status: "qualified",
    },
    {
      account_id: 5,
      organization_id: 3,
      start_date: "2020-02-15",
      end_date: "2021-02-14",
      value: 500000,
      status: "closed-won",
    },
    {
      account_id: 6,
      organization_id: 3,
      start_date: "2027-09-01",
      end_date: "2028-08-31",
      value: 750000,
      status: "negotiation",
    },
    {
      account_id: 7,
      organization_id: 4,
      start_date: "2026-03-01",
      end_date: "2027-12-31",
      value: 125000,
      status: "closed-won",
    },
    {
      account_id: 8,
      organization_id: 4,
      start_date: "2021-05-15",
      end_date: "2022-05-14",
      value: 200000,
      status: "proposal",
    },
    {
      account_id: 9,
      organization_id: 5,
      start_date: "2029-04-01",
      end_date: "2030-10-31",
      value: 150000,
      status: "closed-lost",
    },
    {
      account_id: 10,
      organization_id: 5,
      start_date: "2024-08-15",
      end_date: "2025-08-14",
      value: 300000,
      status: "prospecting",
    },
    // Additional deals for Acme Corporation (org_id: 1)
    {
      account_id: 1,
      organization_id: 1,
      start_date: "2022-02-10",
      end_date: "2023-08-10",
      value: 45000,
      status: "closed-won",
    },
    {
      account_id: 2,
      organization_id: 1,
      start_date: "2025-04-01",
      end_date: "2026-10-01",
      value: 28500,
      status: "closed-won",
    },
    {
      account_id: 1,
      organization_id: 1,
      start_date: "2028-07-15",
      end_date: "2029-01-15",
      value: 62000,
      status: "negotiation",
    },
    {
      account_id: 2,
      organization_id: 1,
      start_date: "2020-05-20",
      end_date: "2021-05-19",
      value: 95000,
      status: "proposal",
    },
    {
      account_id: 1,
      organization_id: 1,
      start_date: "2027-08-01",
      end_date: "2028-07-31",
      value: 110000,
      status: "qualified",
    },
    {
      account_id: 2,
      organization_id: 1,
      start_date: "2023-09-10",
      end_date: "2024-03-10",
      value: 42000,
      status: "prospecting",
    },
    {
      account_id: 1,
      organization_id: 1,
      start_date: "2024-10-15",
      end_date: "2025-04-15",
      value: 67500,
      status: "negotiation",
    },
    {
      account_id: 2,
      organization_id: 1,
      start_date: "2026-11-01",
      end_date: "2027-11-01",
      value: 82000,
      status: "proposal",
    },
    {
      account_id: 1,
      organization_id: 1,
      start_date: "2029-12-01",
      end_date: "2030-06-01",
      value: 55000,
      status: "qualified",
    },
    {
      account_id: 2,
      organization_id: 1,
      start_date: "2022-01-10",
      end_date: "2023-07-10",
      value: 38000,
      status: "prospecting",
    },
    {
      account_id: 1,
      organization_id: 1,
      start_date: "2025-03-05",
      end_date: "2026-09-05",
      value: 29500,
      status: "closed-won",
    },
    {
      account_id: 2,
      organization_id: 1,
      start_date: "2021-02-20",
      end_date: "2022-08-20",
      value: 33500,
      status: "closed-lost",
    },
    // Additional deals for Globex Industries (org_id: 2)
    {
      account_id: 3,
      organization_id: 2,
      start_date: "2028-02-01",
      end_date: "2029-12-01",
      value: 85000,
      status: "closed-won",
    },
    {
      account_id: 4,
      organization_id: 2,
      start_date: "2023-03-15",
      end_date: "2024-03-14",
      value: 120000,
      status: "negotiation",
    },
    {
      account_id: 3,
      organization_id: 2,
      start_date: "2020-04-10",
      end_date: "2021-10-10",
      value: 65000,
      status: "closed-won",
    },
    {
      account_id: 4,
      organization_id: 2,
      start_date: "2024-05-01",
      end_date: "2025-04-30",
      value: 180000,
      status: "proposal",
    },
    {
      account_id: 3,
      organization_id: 2,
      start_date: "2026-06-15",
      end_date: "2027-06-14",
      value: 95000,
      status: "qualified",
    },
    {
      account_id: 4,
      organization_id: 2,
      start_date: "2029-08-01",
      end_date: "2030-07-31",
      value: 210000,
      status: "negotiation",
    },
    {
      account_id: 3,
      organization_id: 2,
      start_date: "2022-09-15",
      end_date: "2023-03-15",
      value: 75000,
      status: "proposal",
    },
    {
      account_id: 4,
      organization_id: 2,
      start_date: "2025-10-01",
      end_date: "2026-09-30",
      value: 195000,
      status: "qualified",
    },
    {
      account_id: 3,
      organization_id: 2,
      start_date: "2027-11-15",
      end_date: "2028-05-15",
      value: 110000,
      status: "prospecting",
    },
    {
      account_id: 4,
      organization_id: 2,
      start_date: "2021-12-01",
      end_date: "2022-11-30",
      value: 225000,
      status: "negotiation",
    },
    {
      account_id: 3,
      organization_id: 2,
      start_date: "2023-01-15",
      end_date: "2024-07-15",
      value: 90000,
      status: "proposal",
    },
    {
      account_id: 4,
      organization_id: 2,
      start_date: "2028-02-20",
      end_date: "2029-08-20",
      value: 115000,
      status: "closed-won",
    },
    {
      account_id: 3,
      organization_id: 2,
      start_date: "2025-03-05",
      end_date: "2026-09-05",
      value: 70000,
      status: "closed-lost",
    },
    // Additional deals for Stark Enterprises (org_id: 3)
    {
      account_id: 5,
      organization_id: 3,
      start_date: "2020-01-10",
      end_date: "2021-07-10",
      value: 320000,
      status: "closed-won",
    },
    {
      account_id: 6,
      organization_id: 3,
      start_date: "2022-03-01",
      end_date: "2023-02-28",
      value: 580000,
      status: "negotiation",
    },
    {
      account_id: 5,
      organization_id: 3,
      start_date: "2026-04-15",
      end_date: "2027-10-15",
      value: 420000,
      status: "closed-won",
    },
    {
      account_id: 6,
      organization_id: 3,
      start_date: "2027-05-01",
      end_date: "2028-04-30",
      value: 680000,
      status: "proposal",
    },
    {
      account_id: 5,
      organization_id: 3,
      start_date: "2029-06-15",
      end_date: "2030-06-14",
      value: 550000,
      status: "qualified",
    },
    {
      account_id: 6,
      organization_id: 3,
      start_date: "2023-07-10",
      end_date: "2024-07-09",
      value: 720000,
      status: "negotiation",
    },
    {
      account_id: 5,
      organization_id: 3,
      start_date: "2024-08-15",
      end_date: "2025-02-15",
      value: 480000,
      status: "proposal",
    },
    {
      account_id: 6,
      organization_id: 3,
      start_date: "2026-10-01",
      end_date: "2027-09-30",
      value: 650000,
      status: "qualified",
    },
    {
      account_id: 5,
      organization_id: 3,
      start_date: "2020-11-15",
      end_date: "2021-05-15",
      value: 510000,
      status: "prospecting",
    },
    {
      account_id: 6,
      organization_id: 3,
      start_date: "2024-12-01",
      end_date: "2025-11-30",
      value: 780000,
      status: "negotiation",
    },
    {
      account_id: 5,
      organization_id: 3,
      start_date: "2028-01-15",
      end_date: "2029-07-15",
      value: 440000,
      status: "proposal",
    },
    {
      account_id: 6,
      organization_id: 3,
      start_date: "2025-02-10",
      end_date: "2026-08-10",
      value: 380000,
      status: "closed-won",
    },
    {
      account_id: 5,
      organization_id: 3,
      start_date: "2027-03-20",
      end_date: "2028-09-20",
      value: 450000,
      status: "closed-lost",
    },
    // Additional deals for Wayne Industries (org_id: 4)
    {
      account_id: 7,
      organization_id: 4,
      start_date: "2022-01-15",
      end_date: "2023-07-15",
      value: 110000,
      status: "closed-won",
    },
    {
      account_id: 8,
      organization_id: 4,
      start_date: "2025-02-01",
      end_date: "2026-01-31",
      value: 185000,
      status: "negotiation",
    },
    {
      account_id: 7,
      organization_id: 4,
      start_date: "2027-04-10",
      end_date: "2028-10-10",
      value: 135000,
      status: "closed-won",
    },
    {
      account_id: 8,
      organization_id: 4,
      start_date: "2029-06-01",
      end_date: "2030-05-31",
      value: 220000,
      status: "proposal",
    },
    {
      account_id: 7,
      organization_id: 4,
      start_date: "2021-07-15",
      end_date: "2022-07-14",
      value: 150000,
      status: "qualified",
    },
    {
      account_id: 8,
      organization_id: 4,
      start_date: "2023-08-01",
      end_date: "2024-07-31",
      value: 240000,
      status: "negotiation",
    },
    {
      account_id: 7,
      organization_id: 4,
      start_date: "2020-09-15",
      end_date: "2021-03-15",
      value: 170000,
      status: "proposal",
    },
    {
      account_id: 8,
      organization_id: 4,
      start_date: "2028-10-01",
      end_date: "2029-09-30",
      value: 225000,
      status: "qualified",
    },
    {
      account_id: 7,
      organization_id: 4,
      start_date: "2024-11-15",
      end_date: "2025-05-15",
      value: 145000,
      status: "prospecting",
    },
    {
      account_id: 8,
      organization_id: 4,
      start_date: "2026-12-01",
      end_date: "2027-11-30",
      value: 210000,
      status: "negotiation",
    },
    {
      account_id: 7,
      organization_id: 4,
      start_date: "2020-01-15",
      end_date: "2021-07-15",
      value: 160000,
      status: "proposal",
    },
    {
      account_id: 8,
      organization_id: 4,
      start_date: "2022-02-10",
      end_date: "2023-08-10",
      value: 175000,
      status: "closed-won",
    },
    {
      account_id: 7,
      organization_id: 4,
      start_date: "2026-03-20",
      end_date: "2027-09-20",
      value: 130000,
      status: "closed-lost",
    },
    // Additional deals for Umbrella Corporation (org_id: 5)
    {
      account_id: 9,
      organization_id: 5,
      start_date: "2028-01-10",
      end_date: "2029-07-10",
      value: 140000,
      status: "closed-won",
    },
    {
      account_id: 10,
      organization_id: 5,
      start_date: "2025-02-15",
      end_date: "2026-02-14",
      value: 280000,
      status: "negotiation",
    },
    {
      account_id: 9,
      organization_id: 5,
      start_date: "2022-03-10",
      end_date: "2023-09-10",
      value: 165000,
      status: "closed-won",
    },
    {
      account_id: 10,
      organization_id: 5,
      start_date: "2020-05-01",
      end_date: "2021-04-30",
      value: 320000,
      status: "proposal",
    },
    {
      account_id: 9,
      organization_id: 5,
      start_date: "2024-06-15",
      end_date: "2025-06-14",
      value: 190000,
      status: "qualified",
    },
    {
      account_id: 10,
      organization_id: 5,
      start_date: "2027-07-01",
      end_date: "2028-06-30",
      value: 340000,
      status: "negotiation",
    },
    {
      account_id: 9,
      organization_id: 5,
      start_date: "2029-09-15",
      end_date: "2030-03-15",
      value: 175000,
      status: "proposal",
    },
    {
      account_id: 10,
      organization_id: 5,
      start_date: "2026-10-01",
      end_date: "2027-09-30",
      value: 325000,
      status: "qualified",
    },
    {
      account_id: 9,
      organization_id: 5,
      start_date: "2023-11-15",
      end_date: "2024-05-15",
      value: 185000,
      status: "prospecting",
    },
    {
      account_id: 10,
      organization_id: 5,
      start_date: "2021-12-01",
      end_date: "2022-11-30",
      value: 310000,
      status: "negotiation",
    },
    {
      account_id: 9,
      organization_id: 5,
      start_date: "2025-01-15",
      end_date: "2026-07-15",
      value: 160000,
      status: "proposal",
    },
    {
      account_id: 10,
      organization_id: 5,
      start_date: "2027-02-20",
      end_date: "2028-08-20",
      value: 270000,
      status: "closed-won",
    },
    {
      account_id: 9,
      organization_id: 5,
      start_date: "2020-03-05",
      end_date: "2021-09-05",
      value: 145000,
      status: "closed-lost",
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
