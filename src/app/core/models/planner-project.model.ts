import { LayoutType } from './layout.model';
import { PlannerModuleInstance } from './planner-module.model';
import { ThemeConfig } from './theme.model';

export const CURRENT_SCHEMA_VERSION = '1.0';

export interface PageMargins {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

export interface PlannerPage {
  id: string;
  name: string;
  layout: LayoutType;
  modules: PlannerModuleInstance[];
}

export interface PlannerProject {
  schemaVersion: string;
  project: {
    id: string;
    name: string;
    description?: string;
    createdAt: string;
    updatedAt: string;
  };
  document: {
    pageSize: 'A4' | 'Letter';
    orientation: 'portrait' | 'landscape';
    margins: PageMargins;
  };
  theme: ThemeConfig;
  pages: PlannerPage[];
}

export function createBlankProject(name: string, theme: ThemeConfig): PlannerProject {
  const now = new Date().toISOString();
  return {
    schemaVersion: CURRENT_SCHEMA_VERSION,
    project: {
      id: crypto.randomUUID(),
      name,
      description: '',
      createdAt: now,
      updatedAt: now,
    },
    document: {
      pageSize: 'A4',
      orientation: 'portrait',
      margins: { top: 36, right: 36, bottom: 36, left: 36 },
    },
    theme,
    pages: [],
  };
}
