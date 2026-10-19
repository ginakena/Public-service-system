import { formatHours } from "../lib/format";
import type { DashboardStats } from "../types";
import { CategoryChart, ChartCard, StatusChart, TrendChart } from "./AdminCharts";
import { StatCard } from "./StatCard";

export function StatsOverview({ stats }: { stats: DashboardStats }) {
  const { totals } = stats;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard label="Total requests" value={totals.total} />
        <StatCard label="Open" value={totals.open} hint={`${totals.pending} pending · ${totals.inProgress} in progress`} />
        <StatCard label="Resolved" value={totals.resolved} />
        <StatCard
          label="Resolution rate"
          value={`${totals.resolutionRate}%`}
          hint={stats.avgResolutionHours === null ? undefined : `Avg. ${formatHours(stats.avgResolutionHours)} to resolve`}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <ChartCard title="Requests by status">
          <StatusChart totals={totals} />
        </ChartCard>
        <ChartCard title="Requests by category">
          <CategoryChart data={stats.byCategory} />
        </ChartCard>
      </div>

      <ChartCard title="New requests, last 30 days">
        <TrendChart data={stats.daily} />
      </ChartCard>
    </div>
  );
}