import React from "react";
import { Card, Statistic } from "antd";
import { DollarOutlined, CalendarOutlined } from "@ant-design/icons";
import type { Deal } from "../services/api";

interface DealsStatsProps {
  deals: Deal[];
  formatCurrency: (value: number) => string;
}

const DealsStats: React.FC<DealsStatsProps> = ({ deals, formatCurrency }) => {
  const totalValue = deals.reduce((sum, deal) => sum + deal.value, 0);

  return (
    <div className="mb-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
    </div>
  );
};

export default DealsStats;
