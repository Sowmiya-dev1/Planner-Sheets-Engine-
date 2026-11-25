import { ModuleRegistryService } from './module-registry.service';

import { DAILY_PLANNER_DEFINITION } from '../../modules/daily-planner/daily-planner.module';
import { dailyPlannerRenderer } from '../../modules/daily-planner/daily-planner.render';

import { TASK_LIST_DEFINITION } from '../../modules/task-list/task-list.module';
import { taskListRenderer } from '../../modules/task-list/task-list.render';

import { HABIT_TRACKER_DEFINITION } from '../../modules/habit-tracker/habit-tracker.module';
import { habitTrackerRenderer } from '../../modules/habit-tracker/habit-tracker.render';

import { GOALS_DEFINITION } from '../../modules/goals/goals.module';
import { goalsRenderer } from '../../modules/goals/goals.render';

import { NOTES_DEFINITION } from '../../modules/notes/notes.module';
import { notesRenderer } from '../../modules/notes/notes.render';

/**
 * Registers the Stage 4 module library. Adding a new module later means
 * writing its definition + renderer under `modules/` and adding one line
 * here — the builder shell, canvas, and export layers never change.
 */
export function registerCoreModules(registry: ModuleRegistryService): void {
  registry.register(DAILY_PLANNER_DEFINITION, dailyPlannerRenderer);
  registry.register(TASK_LIST_DEFINITION, taskListRenderer);
  registry.register(HABIT_TRACKER_DEFINITION, habitTrackerRenderer);
  registry.register(GOALS_DEFINITION, goalsRenderer);
  registry.register(NOTES_DEFINITION, notesRenderer);
}
