const BASE_URL = "http://localhost:3000/api";

interface Organization {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
}

interface Account {
  id: number;
  name: string;
  organizationId: number;
  createdAt: string;
  updatedAt: string;
}

interface Deal {
  id: number;
  accountId: number;
  organizationId: number;
  startDate: string;
  endDate: string;
  value: number;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export const fetchOrganizations = async (): Promise<Organization[]> => {
  const response = await fetch(`${BASE_URL}/organizations`);
  if (!response.ok) {
    throw new Error("Failed to fetch organizations");
  }
  return response.json();
};

export const fetchOrganizationById = async (
  id: number
): Promise<Organization> => {
  const response = await fetch(`${BASE_URL}/organizations/${id}`);
  if (!response.ok) {
    throw new Error("Failed to fetch organization");
  }
  return response.json();
};

export const fetchDealsByOrganizationId = async (
  organizationId: number,
  status?: string | null,
  year?: number | null
): Promise<Deal[]> => {
  let url = `${BASE_URL}/deals/organization/${organizationId}`;
  const params = new URLSearchParams();

  if (status) {
    params.append("status", status);
  }

  if (year) {
    params.append("year", year.toString());
  }

  const queryString = params.toString();
  if (queryString) {
    url += `?${queryString}`;
  }

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Failed to fetch deals");
  }
  return response.json();
};

export const fetchAccounts = async (): Promise<Account[]> => {
  const response = await fetch(`${BASE_URL}/accounts`);
  if (!response.ok) {
    throw new Error("Failed to fetch accounts");
  }
  return response.json();
};

export type { Organization, Account, Deal };
