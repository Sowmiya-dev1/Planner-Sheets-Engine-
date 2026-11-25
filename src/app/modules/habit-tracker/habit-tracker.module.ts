import { PlannerModuleDefinition } from '../../core/models/planner-module.model';

export const HABIT_TRACKER_DEFINITION: PlannerModuleDefinition = {
  type: 'habit-tracker',
  name: 'Habit Tracker',
  description: 'Grid of habits vs. days with checkboxes.',
  category: 'tracking',
  defaultConfig: {
    title: 'Habit Tracker',
    habitNames: ['Habit 1', 'Habit 2', 'Habit 3'],
    days: 7,
  },
  configSchema: [
    { key: 'title', label: 'Title', kind: 'text', default: 'Habit Tracker' },
    { key: 'habitNames', label: 'Habits', kind: 'list', default: ['Habit 1', 'Habit 2', 'Habit 3'] },
    { key: 'days', label: 'Number of days', kind: 'number', default: 7 },
  ],
};
