import { Injectable, signal, computed } from '@angular/core';
import {
  PlannerProject,
  PlannerPage,
  createBlankProject,
} from '../models/planner-project.model';
import { DEFAULT_THEMES } from '../models/theme.model';
import { LayoutType } from '../models/layout.model';
import { PlannerModuleInstance } from '../models/planner-module.model';
import { ThemeConfig } from '../models/theme.model';

@Injectable({ providedIn: 'root' })
export class PlannerProjectService {
  private readonly _project = signal<PlannerProject | null>(null);
  private readonly _selectedPageId = signal<string | null>(null);

  readonly project = this._project.asReadonly();
  readonly pages = computed<PlannerPage[]>(() => this._project()?.pages ?? []);
  readonly hasProject = computed(() => this._project() !== null);
  readonly selectedPageId = this._selectedPageId.asReadonly();
  readonly selectedPage = computed<PlannerPage | undefined>(() =>
    this.pages().find((pg) => pg.id === this._selectedPageId()) ?? this.pages()[0]
  );
  readonly theme = computed<ThemeConfig | undefined>(() => this._project()?.theme);

  selectPage(pageId: string): void {
    this._selectedPageId.set(pageId);
  }

  newProject(name = 'Untitled Planner'): PlannerProject {
    const project = createBlankProject(name, DEFAULT_THEMES[0]);
    this._project.set(project);
    this._selectedPageId.set(null);
    return project;
  }

  loadProject(project: PlannerProject): void {
    this._project.set(project);
    this._selectedPageId.set(project.pages[0]?.id ?? null);
  }

  closeProject(): void {
    this._project.set(null);
    this._selectedPageId.set(null);
  }

  renameProject(name: string): void {
    if (!name.trim()) return;
    this.updateProject((p) => ({
      ...p,
      project: { ...p.project, name: name.trim() },
    }));
  }

  setTheme(theme: ThemeConfig): void {
    this.updateProject((p) => ({ ...p, theme }));
  }

  /** All mutations go through here — always produces new object/array
   * references so Angular signal equality checks never mask a change. */
  private updateProject(fn: (p: PlannerProject) => PlannerProject): void {
    const p = this._project();
    if (!p) return;
    const next = fn(p);
    next.project.updatedAt = new Date().toISOString();
    this._project.set(next);
  }

  // ---- Pages ----

  addPage(name?: string, layout: LayoutType = 'single-column'): void {
    const page: PlannerPage = {
      id: crypto.randomUUID(),
      name: name ?? `Page ${this.pages().length + 1}`,
      layout,
      modules: [],
    };
    this.updateProject((p) => ({ ...p, pages: [...p.pages, page] }));
    this._selectedPageId.set(page.id);
  }

  removePage(pageId: string): void {
    this.updateProject((p) => ({
      ...p,
      pages: p.pages.filter((pg) => pg.id !== pageId),
    }));
    if (this._selectedPageId() === pageId) {
      this._selectedPageId.set(this.pages()[0]?.id ?? null);
    }
  }

  duplicatePage(pageId: string): void {
    const original = this.pages().find((pg) => pg.id === pageId);
    if (!original) return;
    const copy: PlannerPage = {
      ...original,
      id: crypto.randomUUID(),
      name: `${original.name} (copy)`,
      modules: original.modules.map((m) => ({ ...m, id: crypto.randomUUID() })),
    };
    this.updateProject((p) => {
      const index = p.pages.findIndex((pg) => pg.id === pageId);
      const pages = [...p.pages];
      pages.splice(index + 1, 0, copy);
      return { ...p, pages };
    });
    this._selectedPageId.set(copy.id);
  }

  renamePage(pageId: string, name: string): void {
    this.updateProject((p) => ({
      ...p,
      pages: p.pages.map((pg) => (pg.id === pageId ? { ...pg, name } : pg)),
    }));
  }

  setPageLayout(pageId: string, layout: LayoutType): void {
    this.updateProject((p) => ({
      ...p,
      pages: p.pages.map((pg) => (pg.id === pageId ? { ...pg, layout } : pg)),
    }));
  }

  reorderPages(fromIndex: number, toIndex: number): void {
    this.updateProject((p) => {
      const pages = [...p.pages];
      const [moved] = pages.splice(fromIndex, 1);
      pages.splice(toIndex, 0, moved);
      return { ...p, pages };
    });
  }

  // ---- Modules ----

  addModule(pageId: string, instance: PlannerModuleInstance): void {
    this.updateProject((p) => ({
      ...p,
      pages: p.pages.map((pg) =>
        pg.id === pageId ? { ...pg, modules: [...pg.modules, instance] } : pg
      ),
    }));
  }

  removeModule(pageId: string, moduleId: string): void {
    this.updateProject((p) => ({
      ...p,
      pages: p.pages.map((pg) =>
        pg.id === pageId
          ? { ...pg, modules: pg.modules.filter((m) => m.id !== moduleId) }
          : pg
      ),
    }));
  }

  reorderModules(pageId: string, fromIndex: number, toIndex: number): void {
    this.updateProject((p) => ({
      ...p,
      pages: p.pages.map((pg) => {
        if (pg.id !== pageId) return pg;
        const modules = [...pg.modules];
        const [moved] = modules.splice(fromIndex, 1);
        modules.splice(toIndex, 0, moved);
        return { ...pg, modules };
      }),
    }));
  }

  updateModuleConfig(pageId: string, moduleId: string, config: Record<string, any>): void {
    this.updateProject((p) => ({
      ...p,
      pages: p.pages.map((pg) => {
        if (pg.id !== pageId) return pg;
        return {
          ...pg,
          modules: pg.modules.map((m) =>
            m.id === moduleId ? { ...m, config: { ...m.config, ...config } } : m
          ),
        };
      }),
    }));
  }
}
