import React from "react";
import { Table, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import type { Deal } from "../services/api";
import { getStatusColor } from "../utilities/getStatusColor";

interface DealsTableProps {
  deals: Deal[];
  formatCurrency: (value: number) => string;
  formatDate: (dateStr: string) => string;
  getAccountName: (accountId: number) => string;
  loading: boolean;
}

const DealsTable: React.FC<DealsTableProps> = ({
  deals,
  formatCurrency,
  formatDate,
  getAccountName,
  loading,
}) => {
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
    },
  ];

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <Table
        columns={columns}
        dataSource={deals.map((deal) => ({ ...deal, key: deal.id }))}
        pagination={{ pageSize: 10 }}
        bordered
        className="deals-table"
        loading={loading}
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
  );
};

export default DealsTable;
