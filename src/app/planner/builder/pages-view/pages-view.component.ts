import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PlannerProjectService } from '../../../core/services/planner-project.service';
import { ModuleRegistryService } from '../../../core/services/module-registry.service';
import { PlannerModuleInstance } from '../../../core/models/planner-module.model';
import { LAYOUT_DEFINITIONS, LayoutType } from '../../../core/models/layout.model';
import { ModuleConfigDrawerComponent } from '../../../shared/components/module-config-drawer/module-config-drawer.component';

@Component({
  selector: 'app-pages-view',
  standalone: true,
  imports: [CommonModule, FormsModule, ModuleConfigDrawerComponent],
  template: `
    <div class="panel">
      <h2>Pages</h2>
      @if (!projectService.hasProject()) {
        <p class="muted">Open or create a project first.</p>
      } @else {
        <button (click)="projectService.addPage()">+ Add Page</button>

        <div class="layout">
          <ul class="page-list">
            @for (page of projectService.pages(); track page.id; let i = $index) {
              <li
                [class.selected]="page.id === projectService.selectedPage()?.id"
                (click)="select(page.id)"
              >
                <span>{{ page.name }}</span>
                <span class="count">{{ page.modules.length }}</span>
                <button class="icon" (click)="move(i, -1); $event.stopPropagation()" [disabled]="i === 0">↑</button>
                <button class="icon" (click)="move(i, 1); $event.stopPropagation()" [disabled]="i === projectService.pages().length - 1">↓</button>
                <button class="icon" (click)="projectService.duplicatePage(page.id); $event.stopPropagation()">⧉</button>
                <button class="icon" (click)="projectService.removePage(page.id); $event.stopPropagation()">✕</button>
              </li>
            }
          </ul>

          <div class="canvas">
            @if (projectService.selectedPage(); as page) {
              <div class="canvas-header">
                <h3 [style.color]="projectService.theme()?.colors?.primary">{{ page.name }}</h3>
                <label class="layout-picker">
                  Layout
                  <select
                    [ngModel]="page.layout"
                    (ngModelChange)="projectService.setPageLayout(page.id, $event)"
                  >
                    @for (l of layouts; track l.type) {
                      <option [value]="l.type">{{ l.name }}</option>
                    }
                  </select>
                </label>
              </div>

              @if (page.modules.length === 0) {
                <p class="muted">No modules yet — add some from the Modules tab.</p>
              }

              <div class="modules">
                @for (m of page.modules; track m.id; let mi = $index) {
                  <div class="module-block" [style.border-left]="'4px solid ' + (projectService.theme()?.colors?.primary ?? '#ddd')">
                    <div class="module-row">
                      <div class="module-title" (click)="toggleConfig(m.id)">{{ previewTitle(m) }}</div>
                      <div class="module-actions">
                        <button class="icon" (click)="moveModule(page.id, mi, -1)" [disabled]="mi === 0">↑</button>
                        <button class="icon" (click)="moveModule(page.id, mi, 1)" [disabled]="mi === page.modules.length - 1">↓</button>
                        <button class="icon" (click)="toggleConfig(m.id)">⚙</button>
                        <button class="icon" (click)="projectService.removeModule(page.id, m.id)">✕</button>
                      </div>
                    </div>
                    @if (openConfigId() === m.id) {
                      <app-module-config-drawer
                        [moduleName]="previewTitle(m)"
                        [schema]="schemaFor(m.type)"
                        [config]="m.config"
                        (configChange)="onConfigChange(page.id, m.id, $event)"
                        (close)="openConfigId.set(null)"
                      />
                    }
                  </div>
                }
              </div>
            } @else {
              <p class="muted">No page selected.</p>
            }
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .panel { padding: 24px; }
    .muted { color: #888; }
    .layout { display: flex; gap: 24px; margin-top: 16px; }
    .page-list { list-style: none; padding: 0; margin: 0; width: 220px; }
    .page-list li {
      display: flex; align-items: center; gap: 4px; padding: 8px 10px;
      border: 1px solid #ddd; border-radius: 6px; margin-bottom: 6px; cursor: pointer; background: #fff;
    }
    .page-list li span:first-child { flex: 1; }
    .page-list li.selected { border-color: #3949ab; background: #eef0fb; }
    .count { font-size: 11px; color: #999; }
    .icon { border: none; background: transparent; cursor: pointer; font-size: 12px; padding: 2px 4px; }
    .icon:disabled { opacity: 0.3; cursor: default; }
    .canvas { flex: 1; }
    .canvas-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
    .layout-picker { font-size: 12px; color: #666; display: flex; align-items: center; gap: 6px; }
    .layout-picker select { padding: 4px 6px; border-radius: 6px; border: 1px solid #ccc; }
    .modules { display: flex; flex-direction: column; gap: 8px; }
    .module-block { border: 1px solid #ddd; border-radius: 6px; padding: 10px 12px; background: #fff; }
    .module-row { display: flex; justify-content: space-between; align-items: center; }
    .module-title { font-weight: 500; cursor: pointer; }
    .module-actions { display: flex; gap: 2px; }
  `],
})
export class PagesViewComponent {
  layouts = LAYOUT_DEFINITIONS;
  openConfigId = signal<string | null>(null);

  constructor(
    public projectService: PlannerProjectService,
    private registry: ModuleRegistryService
  ) {}

  select(pageId: string): void {
    this.projectService.selectPage(pageId);
    this.openConfigId.set(null);
  }

  move(index: number, delta: number): void {
    const to = index + delta;
    if (to < 0 || to >= this.projectService.pages().length) return;
    this.projectService.reorderPages(index, to);
  }

  moveModule(pageId: string, index: number, delta: number): void {
    const page = this.projectService.pages().find((p) => p.id === pageId);
    if (!page) return;
    const to = index + delta;
    if (to < 0 || to >= page.modules.length) return;
    this.projectService.reorderModules(pageId, index, to);
  }

  toggleConfig(moduleId: string): void {
    this.openConfigId.set(this.openConfigId() === moduleId ? null : moduleId);
  }

  schemaFor(type: string) {
    return this.registry.getDefinition(type)?.configSchema ?? [];
  }

  onConfigChange(pageId: string, moduleId: string, partial: Record<string, any>): void {
    this.projectService.updateModuleConfig(pageId, moduleId, partial);
  }

  previewTitle(instance: PlannerModuleInstance): string {
    const renderer = this.registry.getRenderer(instance.type);
    const theme = this.projectService.theme();
    if (!renderer || !theme) return instance.type;
    return renderer.renderPreview(instance, theme).title;
  }
}
