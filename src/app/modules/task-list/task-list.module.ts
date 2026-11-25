import { PlannerModuleDefinition } from '../../core/models/planner-module.model';

export const TASK_LIST_DEFINITION: PlannerModuleDefinition = {
  type: 'task-list',
  name: 'Task List',
  description: 'Simple checkable list of tasks.',
  category: 'productivity',
  defaultConfig: {
    title: 'Task List',
    taskCount: 10,
    showPriority: false,
  },
  configSchema: [
    { key: 'title', label: 'Title', kind: 'text', default: 'Task List' },
    { key: 'taskCount', label: 'Number of lines', kind: 'number', default: 10 },
    { key: 'showPriority', label: 'Show priority column', kind: 'boolean', default: false },
  ],
};
