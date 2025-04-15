import { useState, useEffect, useCallback } from "react";
import {
  fetchOrganizations,
  fetchDealsByOrganizationId,
  fetchAccounts,
} from "../services/api";
import type { Organization, Deal, Account } from "../services/api";
import { Select, Spin, Empty, Alert } from "antd";
import DealsFilters from "../components/DealsFilters";
import DealsStats from "../components/DealsStats";
import DealsTable from "../components/DealsTable";

const Deals = () => {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [selectedOrgId, setSelectedOrgId] = useState<number | null>(null);
  const [deals, setDeals] = useState<Deal[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [yearFilter, setYearFilter] = useState<number | null>(null);

  // Fetch all organizations on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const orgs = await fetchOrganizations();
        setOrganizations(orgs);

        if (orgs.length > 0) {
          setSelectedOrgId(orgs[0].id);
        }

        const accountsData = await fetchAccounts();
        setAccounts(accountsData);
      } catch (err) {
        setError("Failed to load organizations. Please try again later.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Fetch deals when organization is selected or filters change
  useEffect(() => {
    const fetchDeals = async () => {
      if (!selectedOrgId) return;

      try {
        setLoading(true);
        const dealsData = await fetchDealsByOrganizationId(
          selectedOrgId,
          statusFilter,
          yearFilter
        );

        setDeals(dealsData);
        setError(null);
      } catch (err) {
        setError("Failed to load deals. Please try again later.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDeals();
  }, [selectedOrgId, statusFilter, yearFilter]);

  const formatCurrency = useCallback((value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(value);
  }, []);

  const formatDate = useCallback((dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }, []);

  const getAccountName = useCallback(
    (accountId: number) => {
      const account = accounts.find((acc) => acc.id === accountId);
      return account ? account.name : "Unknown Account";
    },
    [accounts]
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row justify-between items-start mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">Deals Overview</h1>
          <p className="text-gray-600">
            View and manage deals across organizations
          </p>
        </div>

        <div className="w-full lg:w-64">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Select Organization
          </label>
          <Select
            placeholder="Select an organization"
            style={{ width: "100%" }}
            value={selectedOrgId || undefined}
            onChange={(value) => setSelectedOrgId(value)}
            options={organizations.map((org) => ({
              value: org.id,
              label: org.name,
            }))}
            loading={loading && organizations.length === 0}
            disabled={loading && organizations.length === 0}
          />
        </div>
      </div>

      {error && (
        <Alert
          message="Error"
          description={error}
          type="error"
          showIcon
          className="mb-6"
        />
      )}

      {selectedOrgId && (
        <>
          <DealsStats deals={deals} formatCurrency={formatCurrency} />

          <DealsFilters
            statusFilter={statusFilter}
            yearFilter={yearFilter}
            setStatusFilter={setStatusFilter}
            setYearFilter={setYearFilter}
          />
        </>
      )}

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <Spin size="large" />
        </div>
      ) : selectedOrgId && deals.length > 0 ? (
        <DealsTable
          deals={deals}
          formatCurrency={formatCurrency}
          formatDate={formatDate}
          getAccountName={getAccountName}
          loading={loading}
        />
      ) : selectedOrgId ? (
        <Empty
          description="No deals found for this organization"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          className="py-12"
        />
      ) : (
        <div className="flex flex-col items-center justify-center p-12 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-lg text-gray-500 mb-4">
            Please select an organization to view deals
          </p>
        </div>
      )}
    </div>
  );
};

export default Deals;
