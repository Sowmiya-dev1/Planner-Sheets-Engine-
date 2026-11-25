import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DEFAULT_THEMES, ThemeConfig } from '../../../core/models/theme.model';
import { PlannerProjectService } from '../../../core/services/planner-project.service';

@Component({
  selector: 'app-theme-view',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="panel">
      <h2>Theme</h2>
      @if (!projectService.hasProject()) {
        <p class="muted">Open or create a project first.</p>
      } @else {
        <div class="swatches">
          @for (theme of themes; track theme.name) {
            <button
              class="swatch"
              [class.active]="theme.name === projectService.theme()?.name"
              [style.background]="theme.colors.background"
              [style.border-color]="theme.colors.border"
              (click)="projectService.setTheme(theme)"
            >
              <span class="dot" [style.background]="theme.colors.primary"></span>
              {{ theme.name }}
            </button>
          }
        </div>
      }
    </div>
  `,
  styles: [`
    .panel { padding: 24px; }
    .muted { color: #888; }
    .swatches { display: flex; gap: 12px; }
    .swatch {
      border: 2px solid; border-radius: 8px; padding: 12px 16px; display: flex; align-items: center; gap: 8px;
      cursor: pointer; font-size: 14px; font-family: inherit;
    }
    .swatch.active { outline: 2px solid #3949ab; outline-offset: 2px; }
    .dot { width: 14px; height: 14px; border-radius: 50%; display: inline-block; }
  `],
})
export class ThemeViewComponent {
  themes: ThemeConfig[] = DEFAULT_THEMES;
  constructor(public projectService: PlannerProjectService) {}
}
