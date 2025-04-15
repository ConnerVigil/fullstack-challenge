import React from "react";
import { Select, Button } from "antd";
import { ClearOutlined } from "@ant-design/icons";
import { statusOptions } from "../utilities/statusOptions";

interface DealsFiltersProps {
  statusFilter: string | null;
  yearFilter: number | null;
  setStatusFilter: (status: string | null) => void;
  setYearFilter: (year: number | null) => void;
}

const DealsFilters: React.FC<DealsFiltersProps> = ({
  statusFilter,
  yearFilter,
  setStatusFilter,
  setYearFilter,
}) => {
  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from(
    { length: 11 },
    (_, i) => currentYear - 5 + i
  ).map((year) => ({
    value: year,
    label: year.toString(),
  }));

  const clearFilters = () => {
    setStatusFilter(null);
    setYearFilter(null);
  };

  return (
    <div className="bg-white rounded-lg shadow p-4 mb-6">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="w-full md:w-1/3">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Filter by Status
          </label>
          <Select
            placeholder="Select status"
            style={{ width: "100%" }}
            value={statusFilter || undefined}
            onChange={(value) => setStatusFilter(value)}
            options={statusOptions}
            allowClear
          />
        </div>
        <div className="w-full md:w-1/3">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Filter by Year
          </label>
          <Select
            placeholder="Select year"
            style={{ width: "100%" }}
            value={yearFilter || undefined}
            onChange={(value) => setYearFilter(value)}
            options={yearOptions}
            allowClear
          />
        </div>
        <div className="w-full md:w-1/3 flex items-end">
          <Button
            icon={<ClearOutlined />}
            onClick={clearFilters}
            disabled={!statusFilter && !yearFilter}
            className="mt-auto"
          >
            Clear Filters
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DealsFilters;
