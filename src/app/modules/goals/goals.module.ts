import { PlannerModuleDefinition } from '../../core/models/planner-module.model';

export const GOALS_DEFINITION: PlannerModuleDefinition = {
  type: 'goals',
  name: 'Goals',
  description: 'Numbered list of goals with space for notes.',
  category: 'productivity',
  defaultConfig: {
    title: 'Goals',
    goalCount: 5,
  },
  configSchema: [
    { key: 'title', label: 'Title', kind: 'text', default: 'Goals' },
    { key: 'goalCount', label: 'Number of goals', kind: 'number', default: 5 },
  ],
};
