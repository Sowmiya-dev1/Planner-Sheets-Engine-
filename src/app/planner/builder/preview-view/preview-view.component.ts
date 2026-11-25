import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlannerProjectService } from '../../../core/services/planner-project.service';
import { ModuleRegistryService } from '../../../core/services/module-registry.service';
import { PlannerModuleInstance } from '../../../core/models/planner-module.model';
import { PreviewNode } from '../../../core/models/module-renderer.model';

@Component({
  selector: 'app-preview-view',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="panel">
      <h2>Preview</h2>
      @if (!projectService.hasProject()) {
        <p class="muted">Open or create a project first.</p>
      } @else if (projectService.pages().length === 0) {
        <p class="muted">No pages yet — add pages and modules first.</p>
      } @else {
        <div class="document" [style.font-family]="theme()?.fonts?.body">
          @for (page of projectService.pages(); track page.id) {
            <section class="sheet" [style.border-color]="theme()?.colors?.border">
              <h3 [style.color]="theme()?.colors?.primary">{{ page.name }}</h3>
              @if (page.modules.length === 0) {
                <p class="muted">Empty page.</p>
              }
              @for (m of page.modules; track m.id) {
                @if (node(m); as node) {
                  <div class="node" [style.border-color]="theme()?.colors?.border">
                    <h4 [style.color]="theme()?.colors?.secondary">{{ node.title }}</h4>

                    @switch (node.kind) {
                      @case ('text') {
                        <div class="lines">
                          @for (line of node.data.lines; track $index) {
                            <div class="ruled-line"></div>
                          }
                        </div>
                      }
                      @case ('checklist') {
                        <div class="checklist">
                          @for (line of node.data.lines; track $index) {
                            <div class="check-row">
                              <span class="box"></span>
                              <span class="rule"></span>
                              @if (node.data.showPriority) { <span class="priority">P</span> }
                            </div>
                          }
                        </div>
                      }
                      @case ('table') {
                        <div class="table">
                          @for (h of node.data.hours; track h) {
                            <div class="table-row"><span class="hour">{{ h }}</span><span class="rule"></span></div>
                          }
                          @if (node.data.priorities?.length) {
                            <div class="priorities">
                              @for (p of node.data.priorities; track $index) {
                                <div class="check-row"><span class="box"></span><span>{{ p }}</span></div>
                              }
                            </div>
                          }
                        </div>
                      }
                      @case ('grid') {
                        <table class="grid-table">
                          <thead>
                            <tr>
                              <th></th>
                              @for (d of dayRange(node.data.columns); track d) { <th>{{ d }}</th> }
                            </tr>
                          </thead>
                          <tbody>
                            @for (habit of node.data.rows; track habit) {
                              <tr>
                                <td>{{ habit }}</td>
                                @for (d of dayRange(node.data.columns); track d) { <td class="cell"></td> }
                              </tr>
                            }
                          </tbody>
                        </table>
                      }
                    }
                  </div>
                }
              }
            </section>
          }
        </div>
      }
    </div>
  `,
  styles: [`
    .panel { padding: 24px; }
    .muted { color: #888; }
    .document { display: flex; flex-direction: column; gap: 24px; max-width: 700px; }
    .sheet { border: 1px solid #ddd; border-radius: 10px; padding: 20px; background: #fff; }
    .node { border-top: 1px solid #eee; padding-top: 10px; margin-top: 10px; }
    .node:first-of-type { border-top: none; margin-top: 6px; }
    h3 { margin: 0 0 12px; }
    h4 { margin: 0 0 8px; font-size: 13px; text-transform: uppercase; letter-spacing: 0.04em; }
    .ruled-line { height: 1px; background: #ddd; margin: 14px 0; }
    .check-row { display: flex; align-items: center; gap: 8px; padding: 5px 0; }
    .box { width: 12px; height: 12px; border: 1px solid #999; border-radius: 3px; flex-shrink: 0; }
    .rule { flex: 1; border-bottom: 1px solid #ddd; height: 1px; }
    .priority { font-size: 10px; color: #999; }
    .table-row { display: flex; align-items: center; gap: 8px; padding: 3px 0; }
    .hour { width: 48px; font-size: 12px; color: #777; }
    .priorities { margin-top: 10px; }
    .grid-table { border-collapse: collapse; font-size: 11px; width: 100%; }
    .grid-table th, .grid-table td { border: 1px solid #ddd; padding: 4px 6px; text-align: center; }
    .grid-table .cell { width: 20px; }
  `],
})
export class PreviewViewComponent {
  constructor(
    public projectService: PlannerProjectService,
    private registry: ModuleRegistryService
  ) {}

  theme() {
    return this.projectService.theme();
  }

  node(instance: PlannerModuleInstance): PreviewNode | null {
    const renderer = this.registry.getRenderer(instance.type);
    const theme = this.theme();
    if (!renderer || !theme) return null;
    return renderer.renderPreview(instance, theme);
  }

  dayRange(n: number): number[] {
    return Array.from({ length: n ?? 0 }, (_, i) => i + 1);
  }
}
