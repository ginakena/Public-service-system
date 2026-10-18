import { Status } from "../models/ServiceRequest";

const NEXT_STATUS: Record<Status, Status[]> = {
  pending: ["in_progress"],
  in_progress: ["resolved"],
  resolved: [],
};

export function canTransition(from: Status, to: Status): boolean {
  return NEXT_STATUS[from].includes(to);
}

export function allowedNext(from: Status): Status[] {
  return NEXT_STATUS[from];
}