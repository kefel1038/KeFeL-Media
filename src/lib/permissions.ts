export type Role = "super_admin" | "editor" | "journalist" | "photographer" | "social_manager";

export interface Profile {
  id: string;
  username: string;
  email: string;
  display_name: string;
  role: Role;
  avatar: string;
  article_count: number;
  status: string;
  created_at: string;
}

const ROLE_HIERARCHY: Record<Role, number> = {
  super_admin: 100,
  editor: 80,
  journalist: 50,
  photographer: 40,
  social_manager: 40,
};

export function canAccess(role: Role, minimum: Role): boolean {
  return ROLE_HIERARCHY[role] >= ROLE_HIERARCHY[minimum];
}

export function canManageUsers(role: Role): boolean {
  return role === "super_admin";
}

export function canManageArticles(role: Role): boolean {
  return canAccess(role, "journalist");
}

export function canPublishArticles(role: Role): boolean {
  return canAccess(role, "editor");
}

export function canManageMedia(role: Role): boolean {
  return canAccess(role, "photographer");
}

export function canManageSettings(role: Role): boolean {
  return role === "super_admin";
}

export function canManageNewsletter(role: Role): boolean {
  return canAccess(role, "social_manager");
}

export function canManageBreakingNews(role: Role): boolean {
  return canAccess(role, "social_manager");
}
