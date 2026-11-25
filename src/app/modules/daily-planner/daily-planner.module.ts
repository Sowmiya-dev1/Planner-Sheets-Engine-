import { PlannerModuleDefinition } from '../../core/models/planner-module.model';

export const DAILY_PLANNER_DEFINITION: PlannerModuleDefinition = {
  type: 'daily-planner',
  name: 'Daily Planner',
  description: 'Hourly schedule plus top priorities for a single day.',
  category: 'productivity',
  defaultConfig: {
    title: 'Daily Planner',
    showHourlySchedule: true,
    startHour: 6,
    endHour: 21,
    priorityCount: 3,
  },
  configSchema: [
    { key: 'title', label: 'Title', kind: 'text', default: 'Daily Planner' },
    { key: 'showHourlySchedule', label: 'Show hourly schedule', kind: 'boolean', default: true },
    { key: 'startHour', label: 'Start hour (0-23)', kind: 'number', default: 6 },
    { key: 'endHour', label: 'End hour (0-23)', kind: 'number', default: 21 },
    { key: 'priorityCount', label: 'Number of top priorities', kind: 'number', default: 3 },
  ],
};
