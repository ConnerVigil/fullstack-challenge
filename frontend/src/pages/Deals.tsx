import React, { useState, useEffect } from "react";
import {
  fetchOrganizations,
  fetchDealsByOrganizationId,
  fetchAccounts,
} from "../services/api";
import type { Organization, Deal, Account } from "../services/api";
import { Select, Table, Card, Statistic, Spin, Empty, Alert, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import {
  ArrowUpOutlined,
  DollarOutlined,
  CalendarOutlined,
} from "@ant-design/icons";

const Deals = () => {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [selectedOrgId, setSelectedOrgId] = useState<number | null>(null);
  const [deals, setDeals] = useState<Deal[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch all organizations on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const orgs = await fetchOrganizations();
        setOrganizations(orgs);

        // Auto-select first organization if available
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

  // Fetch deals when organization is selected
  useEffect(() => {
    const fetchDeals = async () => {
      if (!selectedOrgId) return;

      try {
        setLoading(true);
        const dealsData = await fetchDealsByOrganizationId(selectedOrgId);
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
  }, [selectedOrgId]);

  // Calculate total value of deals
  const totalValue = deals.reduce((sum, deal) => sum + deal.value, 0);

  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(value);
  };

  // Format date
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Get account name by ID
  const getAccountName = (accountId: number) => {
    const account = accounts.find((acc) => acc.id === accountId);
    return account ? account.name : "Unknown Account";
  };

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "green";
      case "pending":
        return "gold";
      case "closed":
        return "volcano";
      case "negotiating":
        return "blue";
      default:
        return "default";
    }
  };

  // Table columns
  const columns: ColumnsType<Deal> = [
    {
      title: "Account",
      dataIndex: "accountId",
      key: "accountId",
      render: (accountId) => getAccountName(accountId),
    },
    {
      title: "Start Date",
      dataIndex: "startDate",
      key: "startDate",
      render: (date) => formatDate(date),
      sorter: (a, b) =>
        new Date(a.startDate).getTime() - new Date(b.startDate).getTime(),
    },
    {
      title: "End Date",
      dataIndex: "endDate",
      key: "endDate",
      render: (date) => formatDate(date),
      sorter: (a, b) =>
        new Date(a.endDate).getTime() - new Date(b.endDate).getTime(),
    },
    {
      title: "Value",
      dataIndex: "value",
      key: "value",
      render: (value) => formatCurrency(value),
      sorter: (a, b) => a.value - b.value,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={getStatusColor(status)}>{status.toUpperCase()}</Tag>
      ),
      filters: [
        { text: "Active", value: "active" },
        { text: "Pending", value: "pending" },
        { text: "Closed", value: "closed" },
        { text: "Negotiating", value: "negotiating" },
      ],
      onFilter: (value, record) =>
        record.status.toLowerCase() === value.toString().toLowerCase(),
    },
  ];

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
        <div className="mb-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <Statistic
              title="Total Deals"
              value={deals.length}
              prefix={<CalendarOutlined />}
            />
          </Card>
          <Card>
            <Statistic
              title="Total Value"
              value={totalValue}
              precision={0}
              formatter={(value) => formatCurrency(value as number)}
              prefix={<DollarOutlined />}
              valueStyle={{ color: "#3f8600" }}
            />
          </Card>
          <Card>
            <Statistic
              title="Average Deal Value"
              value={deals.length ? totalValue / deals.length : 0}
              precision={0}
              formatter={(value) => formatCurrency(value as number)}
              prefix={<DollarOutlined />}
            />
          </Card>
          <Card>
            <Statistic
              title="YoY Growth"
              value={11.28}
              precision={2}
              valueStyle={{ color: "#3f8600" }}
              prefix={<ArrowUpOutlined />}
              suffix="%"
            />
          </Card>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <Spin size="large" />
        </div>
      ) : selectedOrgId && deals.length > 0 ? (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <Table
            columns={columns}
            dataSource={deals.map((deal) => ({ ...deal, key: deal.id }))}
            pagination={{ pageSize: 10 }}
            bordered
            className="deals-table"
            onRow={() => ({
              className: "hover:bg-gray-50",
            })}
            rowClassName="transition-colors"
            components={{
              header: {
                cell: (props: React.HTMLAttributes<HTMLTableCellElement>) => (
                  <th
                    {...props}
                    className="bg-blue-50 text-gray-800 font-semibold"
                  />
                ),
              },
            }}
          />
        </div>
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
