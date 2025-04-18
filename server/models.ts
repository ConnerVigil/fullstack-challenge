// Organization model
export interface Organization {
  id: number;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface OrganizationCreate {
  name: string;
}

// Account model
export interface Account {
  id: number;
  name: string;
  organizationId: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface AccountCreate {
  name: string;
  organizationId: number;
}

// Deal model
export interface Deal {
  id: number;
  accountId: number;
  organizationId: number;
  startDate: Date;
  endDate: Date;
  value: number;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface DealCreate {
  accountId: number;
  organizationId: number;
  startDate: Date;
  endDate: Date;
  value: number;
  status: string;
}

export interface DealRow {
  id: number;
  account_id: number;
  organization_id: number;
  start_date: string;
  end_date: string;
  value: number;
  status: string;
  created_at: string;
  updated_at: string;
}
