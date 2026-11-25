import { Component } from '@angular/core';
import { ModuleRegistryService } from '../../../core/services/module-registry.service';
import { PlannerProjectService } from '../../../core/services/planner-project.service';
import { createModuleInstance } from '../../../core/models/planner-module.model';

@Component({
  selector: 'app-modules-view',
  standalone: true,
  template: `
    <div class="panel">
      <h2>Module Library</h2>

      @if (!projectService.hasProject()) {
        <p class="muted">Open or create a project first (Project tab).</p>
      } @else if (!projectService.selectedPage()) {
        <p class="muted">Add a page first (Pages tab), then come back here to add modules to it.</p>
      } @else {
        <p class="target">Adding to: <strong>{{ projectService.selectedPage()?.name }}</strong></p>
      }

      @for (category of categories; track category) {
        <section>
          <h3>{{ categoryLabel(category) }}</h3>
          <div class="cards">
            @for (def of registry.listByCategory(category); track def.type) {
              <div class="card">
                <div class="card-title">{{ def.name }}</div>
                <div class="card-desc">{{ def.description }}</div>
                <button
                  [disabled]="!projectService.selectedPage()"
                  (click)="addToSelectedPage(def.type)"
                >
                  + Add to page
                </button>
              </div>
            }
          </div>
        </section>
      }
    </div>
  `,
  styles: [`
    .panel { padding: 24px; }
    .muted { color: #888; }
    .target { color: #333; margin-bottom: 16px; }
    section { margin-bottom: 24px; }
    h3 { text-transform: capitalize; font-size: 14px; color: #666; margin-bottom: 8px; }
    .cards { display: flex; flex-wrap: wrap; gap: 12px; }
    .card {
      width: 200px; border: 1px solid #ddd; border-radius: 8px; padding: 12px;
      background: #fff; display: flex; flex-direction: column; gap: 6px;
    }
    .card-title { font-weight: 600; }
    .card-desc { font-size: 12px; color: #777; flex: 1; }
    button { padding: 6px 10px; font-size: 13px; }
  `],
})
export class ModulesViewComponent {
  categories: Array<'productivity' | 'tracking' | 'planning'> = ['productivity', 'tracking', 'planning'];

  constructor(
    public registry: ModuleRegistryService,
    public projectService: PlannerProjectService
  ) {}

  categoryLabel(category: string): string {
    return category;
  }

  addToSelectedPage(type: string): void {
    const page = this.projectService.selectedPage();
    const definition = this.registry.getDefinition(type);
    if (!page || !definition) return;
    const instance = createModuleInstance(definition, crypto.randomUUID());
    this.projectService.addModule(page.id, instance);
  }
}
