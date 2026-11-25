import { PlannerModuleDefinition } from '../../core/models/planner-module.model';

export const NOTES_DEFINITION: PlannerModuleDefinition = {
  type: 'notes',
  name: 'Notes',
  description: 'Blank ruled lines for free writing.',
  category: 'productivity',
  defaultConfig: {
    title: 'Notes',
    lineCount: 20,
  },
  configSchema: [
    { key: 'title', label: 'Title', kind: 'text', default: 'Notes' },
    { key: 'lineCount', label: 'Number of lines', kind: 'number', default: 20 },
  ],
};
