import type { ReactNode } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { CATEGORY_LABELS, STATUS_LABELS, type Status } from "../lib/constants";
import { formatShortDate } from "../lib/format";
import type { DashboardStats } from "../types";

const STATUS_COLORS: Record<Status, string> = {
  pending: "#f59e0b",
  in_progress: "#3b82f6",
  resolved: "#16a34a",
};

export function ChartCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="mb-4 font-semibold">{title}</h2>
      <div className="h-64">{children}</div>
    </section>
  );
}

function EmptyChart() {
  return <div className="flex h-full items-center justify-center text-sm text-slate-500">No data yet</div>;
}

export function StatusChart({ totals }: { totals: DashboardStats["totals"] }) {
  if (totals.total === 0) return <EmptyChart />;

  const data = [
    { status: "pending" as const, name: STATUS_LABELS.pending, value: totals.pending },
    { status: "in_progress" as const, name: STATUS_LABELS.in_progress, value: totals.inProgress },
    { status: "resolved" as const, name: STATUS_LABELS.resolved, value: totals.resolved },
  ];

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie data={data} dataKey="value" nameKey="name" innerRadius={55} outerRadius={85} paddingAngle={2}>
          {data.map((entry) => (
            <Cell key={entry.status} fill={STATUS_COLORS[entry.status]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}

export function CategoryChart({ data }: { data: DashboardStats["byCategory"] }) {
  if (data.length === 0) return <EmptyChart />;

  const rows = data.map((c) => ({ name: CATEGORY_LABELS[c.category], Open: c.open, Resolved: c.resolved }));

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={rows}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="name" tick={{ fontSize: 12 }} />
        <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
        <Tooltip />
        <Legend />
        <Bar dataKey="Open" stackId="a" fill={STATUS_COLORS.pending} />
        <Bar dataKey="Resolved" stackId="a" fill={STATUS_COLORS.resolved} />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function TrendChart({ data }: { data: DashboardStats["daily"] }) {
  const rows = data.map((d) => ({ label: formatShortDate(d.date), Requests: d.count }));

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={rows}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="label" tick={{ fontSize: 12 }} interval="preserveStartEnd" minTickGap={24} />
        <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
        <Tooltip />
        <Line type="monotone" dataKey="Requests" stroke="#095a31" strokeWidth={2} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  );
}