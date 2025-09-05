// skill.model.ts
export interface Skill {
  name: string;
  level: number;
}

export interface SkillCategory {
  title: string;
  icon: string;
  skills: Skill[];
  isCollapsed: boolean;
}
