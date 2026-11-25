import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlannerProjectService } from '../../../core/services/planner-project.service';
import { PdfRendererService } from '../../../core/export/pdf-renderer.service';
import { ExcelRendererService } from '../../../core/export/excel-renderer.service';

@Component({
  selector: 'app-export-view',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="panel">
      <h2>Export</h2>

      @if (!projectService.hasProject()) {
        <p class="muted">Open or create a project first.</p>
      } @else {
        <p class="meta">{{ projectService.pages().length }} page(s) will be exported.</p>

        <div class="actions">
          <button (click)="exportPdf()" [disabled]="busy() === 'pdf'">
            {{ busy() === 'pdf' ? 'Generating PDF…' : 'Export PDF' }}
          </button>
          <button (click)="exportExcel()" [disabled]="busy() === 'excel'">
            {{ busy() === 'excel' ? 'Generating Excel…' : 'Export Excel' }}
          </button>
        </div>

        @if (error()) {
          <p class="error">{{ error() }}</p>
        }
        @if (success()) {
          <p class="success">{{ success() }}</p>
        }
      }
    </div>
  `,
  styles: [`
    .panel { padding: 24px; }
    .muted { color: #888; }
    .meta { color: #666; font-size: 13px; margin-bottom: 12px; }
    .actions { display: flex; gap: 8px; }
    button { padding: 8px 16px; cursor: pointer; }
    button:disabled { opacity: 0.6; cursor: default; }
    .error { color: #b00020; background: #fde8e8; padding: 8px 12px; border-radius: 6px; margin-top: 12px; }
    .success { color: #1b5e20; background: #e8f5e9; padding: 8px 12px; border-radius: 6px; margin-top: 12px; }
  `],
})
export class ExportViewComponent {
  busy = signal<'pdf' | 'excel' | null>(null);
  error = signal<string | null>(null);
  success = signal<string | null>(null);

  constructor(
    public projectService: PlannerProjectService,
    private pdfRenderer: PdfRendererService,
    private excelRenderer: ExcelRendererService
  ) {}

  async exportPdf(): Promise<void> {
    const project = this.projectService.project();
    if (!project) return;
    this.busy.set('pdf');
    this.error.set(null);
    this.success.set(null);
    try {
      await this.pdfRenderer.export(project);
      this.success.set('PDF downloaded.');
    } catch (e: any) {
      this.error.set(e.message ?? 'PDF export failed.');
    } finally {
      this.busy.set(null);
    }
  }

  async exportExcel(): Promise<void> {
    const project = this.projectService.project();
    if (!project) return;
    this.busy.set('excel');
    this.error.set(null);
    this.success.set(null);
    try {
      await this.excelRenderer.export(project);
      this.success.set('Excel file downloaded.');
    } catch (e: any) {
      this.error.set(e.message ?? 'Excel export failed.');
    } finally {
      this.busy.set(null);
    }
  }
}
