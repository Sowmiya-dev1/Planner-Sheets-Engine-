import { Component, ElementRef, ViewChild, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PlannerProjectService } from '../../../core/services/planner-project.service';
import { LocalStorageService } from '../../../core/storage/local-storage.service';
import { ProjectFileService } from '../../../core/storage/project-file.service';
import { createBlankProject } from '../../../core/models/planner-project.model';

@Component({
  selector: 'app-project-view',
  standalone: true,
  imports: [FormsModule, CommonModule],
  template: `
    <div class="panel">
      <h2>Project</h2>

      @if (error()) {
        <p class="error">{{ error() }}</p>
      }

      @if (projectService.hasProject()) {
        <div class="rename-row">
          <label>Project name</label>
          <input
            [(ngModel)]="editedName"
            (blur)="commitRename()"
            (keyup.enter)="commitRename()"
          />
        </div>
        <p class="meta">
          Created {{ projectService.project()?.project?.createdAt | date:'medium' }}
          @if (savedAt()) { · Saved {{ savedAt() | date:'shortTime' }} }
        </p>

        <div class="actions">
          <button (click)="save()">Save</button>
          <button (click)="saveAsCopy()">Duplicate</button>
          <button (click)="downloadJson()">Download JSON</button>
          <button class="secondary" (click)="close()">Close Project</button>
        </div>
      } @else {
        <p>No project open.</p>
        <div class="new-row">
          <input placeholder="Planner name" [(ngModel)]="newName" (keyup.enter)="create()" />
          <button (click)="create()">+ New Project</button>
        </div>

        <div class="import-row">
          <button (click)="fileInput.click()">Open from JSON file</button>
          <input #fileInput type="file" accept="application/json" hidden (change)="onFileChosen($event)" />
        </div>

        @if (savedProjects().length) {
          <div class="saved-list">
            <h3>Saved in this browser</h3>
            <ul>
              @for (p of savedProjects(); track p.id) {
                <li>
                  <span>{{ p.name }}</span>
                  <button (click)="openSaved(p.id)">Open</button>
                  <button class="icon" (click)="deleteSaved(p.id)">✕</button>
                </li>
              }
            </ul>
          </div>
        }
      }
    </div>
  `,
  styles: [`
    .panel { padding: 24px; }
    button { padding: 8px 16px; cursor: pointer; }
    .secondary { background: transparent; border: 1px solid #ccc; }
    .new-row, .rename-row, .import-row { display: flex; align-items: center; gap: 8px; margin-top: 8px; }
    .rename-row { flex-direction: column; align-items: flex-start; }
    .rename-row label { font-size: 12px; color: #777; }
    input { padding: 8px 10px; border: 1px solid #ccc; border-radius: 6px; font-size: 14px; min-width: 240px; }
    .meta { color: #999; font-size: 12px; margin-top: 8px; }
    .actions { display: flex; gap: 8px; margin-top: 16px; flex-wrap: wrap; }
    .error { color: #b00020; background: #fde8e8; padding: 8px 12px; border-radius: 6px; }
    .saved-list { margin-top: 20px; }
    .saved-list h3 { font-size: 13px; color: #666; }
    .saved-list ul { list-style: none; padding: 0; }
    .saved-list li { display: flex; align-items: center; gap: 8px; padding: 6px 0; }
    .saved-list li span { flex: 1; }
    .icon { border: none; background: transparent; }
  `],
})
export class ProjectViewComponent {
  @ViewChild('fileInput') fileInputRef?: ElementRef<HTMLInputElement>;

  newName = '';
  editedName = '';
  error = signal<string | null>(null);
  savedAt = signal<string | null>(null);
  savedProjects = signal<Array<{ id: string; name: string }>>([]);

  constructor(
    public projectService: PlannerProjectService,
    private storage: LocalStorageService,
    private fileService: ProjectFileService
  ) {
    const name = this.projectService.project()?.project?.name;
    if (name) this.editedName = name;
    this.savedProjects.set(this.storage.list());
  }

  create(): void {
    const name = this.newName.trim() || 'Untitled Planner';
    this.projectService.newProject(name);
    this.editedName = name;
    this.newName = '';
    this.savedAt.set(null);
    this.error.set(null);
  }

  commitRename(): void {
    if (this.editedName.trim()) {
      this.projectService.renameProject(this.editedName);
    } else {
      this.editedName = this.projectService.project()?.project?.name ?? '';
    }
  }

  save(): void {
    const project = this.projectService.project();
    if (!project) return;
    try {
      this.storage.save(project);
      this.savedAt.set(new Date().toISOString());
      this.savedProjects.set(this.storage.list());
      this.error.set(null);
    } catch (e: any) {
      this.error.set(e.message ?? 'Failed to save project.');
    }
  }

  close(): void {
    this.projectService.closeProject();
    this.savedProjects.set(this.storage.list());
    this.error.set(null);
    this.savedAt.set(null);
  }

  saveAsCopy(): void {
    const project = this.projectService.project();
    if (!project) return;
    const copy = createBlankProject(`${project.project.name} (copy)`, project.theme);
    copy.pages = project.pages.map((pg) => ({
      ...pg,
      id: crypto.randomUUID(),
      modules: pg.modules.map((m) => ({ ...m, id: crypto.randomUUID() })),
    }));
    copy.document = { ...project.document };
    this.projectService.loadProject(copy);
    this.editedName = copy.project.name;
    try {
      this.storage.save(copy);
      this.savedProjects.set(this.storage.list());
    } catch {
      /* non-fatal — duplicate still exists in memory even if save fails */
    }
  }

  downloadJson(): void {
    const project = this.projectService.project();
    if (project) this.fileService.downloadAsJson(project);
  }

  openSaved(id: string): void {
    const project = this.storage.load(id);
    if (!project) {
      this.error.set('Could not load that saved project — it may be corrupted.');
      return;
    }
    this.projectService.loadProject(project);
    this.editedName = project.project.name;
    this.error.set(null);
  }

  deleteSaved(id: string): void {
    this.storage.remove(id);
    this.savedProjects.set(this.storage.list());
  }

  async onFileChosen(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;
    try {
      const project = await this.fileService.readFromFile(file);
      this.projectService.loadProject(project);
      this.editedName = project.project.name;
      this.error.set(null);
    } catch (e: any) {
      this.error.set(e.message ?? 'Failed to open that file.');
    } finally {
      input.value = '';
    }
  }
}
