import { Injectable } from '@angular/core';
import { PlannerProject, CURRENT_SCHEMA_VERSION } from '../models/planner-project.model';

@Injectable({ providedIn: 'root' })
export class ProjectFileService {
  downloadAsJson(project: PlannerProject): void {
    const blob = new Blob([JSON.stringify(project, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${this.slug(project.project.name)}.planner.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  async readFromFile(file: File): Promise<PlannerProject> {
    const text = await file.text();
    let parsed: any;
    try {
      parsed = JSON.parse(text);
    } catch {
      throw new Error('That file is not valid JSON.');
    }
    if (!parsed || !parsed.project || !Array.isArray(parsed.pages)) {
      throw new Error('That file does not look like a planner project.');
    }
    if (!parsed.schemaVersion) {
      parsed.schemaVersion = CURRENT_SCHEMA_VERSION;
    }
    return parsed as PlannerProject;
  }

  private slug(name: string): string {
    return name.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || 'planner';
  }
}
