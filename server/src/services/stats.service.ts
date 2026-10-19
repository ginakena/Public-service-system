import { Category, ServiceRequest, Status } from "../models/ServiceRequest";

const DAY_MS = 24 * 60 * 60 * 1000;
const HOUR_MS = 60 * 60 * 1000;
const TREND_DAYS = 30;
const TIMEZONE = "Africa/Nairobi";

interface Facets {
  byStatus: { _id: Status; count: number }[];
  byCategory: { _id: Category; total: number; resolved: number }[];
  daily: { _id: string; count: number }[];
  resolution: { avgMs: number }[];
}

export interface DashboardStats {
  totals: {
    total: number;
    open: number;
    pending: number;
    inProgress: number;
    resolved: number;
    resolutionRate: number; // percentage of all requests that are resolved
  };
  byCategory: { category: Category; total: number; open: number; resolved: number }[];
  daily: { date: string; count: number }[];
  avgResolutionHours: number | null;
}

const dayKey = (date: Date) => date.toLocaleDateString("en-CA", { timeZone: TIMEZONE }); // YYYY-MM-DD

export async function getDashboardStats(): Promise<DashboardStats> {
  const since = new Date(Date.now() - TREND_DAYS * DAY_MS);

  const [facets] = await ServiceRequest.aggregate<Facets>([
    {
      $facet: {
        byStatus: [{ $group: { _id: "$status", count: { $sum: 1 } } }],
        byCategory: [
          {
            $group: {
              _id: "$category",
              total: { $sum: 1 },
              resolved: { $sum: { $cond: [{ $eq: ["$status", "resolved"] }, 1, 0] } },
            },
          },
          { $sort: { total: -1 } },
        ],
        daily: [
          { $match: { createdAt: { $gte: since } } },
          {
            $group: {
              _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt", timezone: TIMEZONE } },
              count: { $sum: 1 },
            },
          },
        ],
        // A resolved request can't be edited again, so updatedAt is its resolution time
        resolution: [
          { $match: { status: "resolved" } },
          { $group: { _id: null, avgMs: { $avg: { $subtract: ["$updatedAt", "$createdAt"] } } } },
        ],
      },
    },
  ]);

  const countFor = (status: Status) => facets.byStatus.find((s) => s._id === status)?.count ?? 0;
  const pending = countFor("pending");
  const inProgress = countFor("in_progress");
  const resolved = countFor("resolved");
  const total = pending + inProgress + resolved;

  const perDay = new Map(facets.daily.map((d) => [d._id, d.count]));
  const daily = Array.from({ length: TREND_DAYS }, (_, i) => {
    const date = dayKey(new Date(Date.now() - (TREND_DAYS - 1 - i) * DAY_MS));
    return { date, count: perDay.get(date) ?? 0 };
  });

  const avgMs = facets.resolution[0]?.avgMs;

  return {
    totals: {
      total,
      open: pending + inProgress,
      pending,
      inProgress,
      resolved,
      resolutionRate: total ? Math.round((resolved / total) * 1000) / 10 : 0,
    },
    byCategory: facets.byCategory.map((c) => ({
      category: c._id,
      total: c.total,
      open: c.total - c.resolved,
      resolved: c.resolved,
    })),
    daily,
    avgResolutionHours: avgMs === undefined ? null : Math.round((avgMs / HOUR_MS) * 10) / 10,
  };
}