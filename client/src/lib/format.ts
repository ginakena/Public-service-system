import type { ServiceRequest } from "../types";


export const citizenName = (request: ServiceRequest) =>
  typeof request.citizen === "object" ? request.citizen.name : "-";



const dateFormat = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric" });
const dateTimeFormat = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "short",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

export const formatDate = (iso: string) => dateFormat.format(new Date(iso));
export const formatDateTime = (iso: string) => dateTimeFormat.format(new Date(iso));

const shortDateFormat = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short" });

export const formatShortDate = (isoDay: string) => shortDateFormat.format(new Date(`${isoDay}T00:00:00`));

export function formatHours(hours: number): string {
  if (hours < 1) return `${Math.round(hours * 60)} min`;
  if (hours < 48) return `${hours.toFixed(1)} h`;
  return `${(hours / 24).toFixed(1)} days`;
}