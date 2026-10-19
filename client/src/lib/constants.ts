export const CATEGORIES = ["streetlight", "water", "garbage", "roads", "sewage", "insecurity", "other"] as const;
export const STATUSES = ["pending", "in_progress", "resolved"] as const;

export type Category = (typeof CATEGORIES)[number];
export type Status = (typeof STATUSES)[number];

export const CATEGORY_LABELS: Record<Category, string> = {
  streetlight: "Streetlight",
  water: "Water",
  garbage: "Garbage collection",
  roads: "Roads",
  sewage: "Sewage",
  insecurity: "Insecurity",
  other: "Other",
};

export const STATUS_LABELS: Record<Status, string> = {
  pending: "Pending",
  in_progress: "In progress",
  resolved: "Resolved",
};

export const COUNTIES = [
  "Baringo", "Bomet", "Bungoma", "Busia", "Elgeyo-Marakwet", "Embu", "Garissa", "Homa Bay",
  "Isiolo", "Kajiado", "Kakamega", "Kericho", "Kiambu", "Kilifi", "Kirinyaga", "Kisii",
  "Kisumu", "Kitui", "Kwale", "Laikipia", "Lamu", "Machakos", "Makueni", "Mandera",
  "Marsabit", "Meru", "Migori", "Mombasa", "Murang'a", "Nairobi", "Nakuru", "Nandi",
  "Narok", "Nyamira", "Nyandarua", "Nyeri", "Samburu", "Siaya", "Taita-Taveta", "Tana River",
  "Tharaka-Nithi", "Trans-Nzoia", "Turkana", "Uasin Gishu", "Vihiga", "Wajir", "West Pokot",
] as const;

export const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
export const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

export const NEXT_STATUS: Record<Status, Status[]> = {
  pending: ["in_progress"],
  in_progress: ["resolved"],
  resolved: [],
};