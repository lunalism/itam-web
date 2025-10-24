// 조직별 표준 분류 — 한 곳에서만 관리
export const TEAMS = [
    "Mechanics", "IT", "Engineers", "LMDh"
] as const;
  
export const ROLES: Record<(typeof TEAMS)[number], string[]> = {
    "Mechanics": ["Mechanic", "No.1 Mechanic", "Crew Chief Mechanic"],
    "IT": ["SysAdmin", "Helpdesk", "NetOps", "SecOps"],
    "Engineers": ["System Engineer", "Performance Engineer", "Tyre Engineer", "Chief Engineer"],
    "LMDh": ["Team Manager","Team Event Manager"]
};
  
export const LOCATIONS = [
    "Seoul", "Magny-Cours", "Alzenau", "Tokyo", "Remote"
] as const;
  
export const DEFAULT_ROLES = ["Staff"]; // 팀에 매칭 안될 때 fallback
export const getRolesForTeam = (team: string) => ROLES[team as keyof typeof ROLES] ?? DEFAULT_ROLES;
  