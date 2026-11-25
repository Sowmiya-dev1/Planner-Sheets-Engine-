import { Injectable } from '@angular/core';
import { PlannerProject, CURRENT_SCHEMA_VERSION } from '../models/planner-project.model';

const STORAGE_PREFIX = 'planner-engine:project:';
const INDEX_KEY = 'planner-engine:index';

@Injectable({ providedIn: 'root' })
export class LocalStorageService {
  save(project: PlannerProject): void {
    try {
      localStorage.setItem(STORAGE_PREFIX + project.project.id, JSON.stringify(project));
      this.updateIndex(project.project.id, project.project.name);
    } catch (e) {
      console.error('Failed to save project to Local Storage', e);
      throw new Error('Could not save project — storage may be full or unavailable.');
    }
  }

  load(projectId: string): PlannerProject | null {
    const raw = localStorage.getItem(STORAGE_PREFIX + projectId);
    if (!raw) return null;
    try {
      const parsed = JSON.parse(raw);
      return this.migrate(parsed);
    } catch (e) {
      console.error('Failed to parse stored project JSON', e);
      return null;
    }
  }

  list(): Array<{ id: string; name: string }> {
    try {
      const raw = localStorage.getItem(INDEX_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  remove(projectId: string): void {
    localStorage.removeItem(STORAGE_PREFIX + projectId);
    const list = this.list().filter((p) => p.id !== projectId);
    localStorage.setItem(INDEX_KEY, JSON.stringify(list));
  }

  private updateIndex(id: string, name: string): void {
    const list = this.list().filter((p) => p.id !== id);
    list.push({ id, name });
    localStorage.setItem(INDEX_KEY, JSON.stringify(list));
  }

  /** Placeholder migration point — bump when CURRENT_SCHEMA_VERSION changes. */
  private migrate(project: any): PlannerProject {
    if (!project.schemaVersion) {
      project.schemaVersion = CURRENT_SCHEMA_VERSION;
    }
    return project as PlannerProject;
  }
}
