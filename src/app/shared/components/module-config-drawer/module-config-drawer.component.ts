import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ModuleFieldSchema } from '../../../core/models/planner-module.model';

@Component({
  selector: 'app-module-config-drawer',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="drawer">
      <div class="drawer-header">
        <strong>{{ moduleName }} settings</strong>
        <button class="icon" (click)="close.emit()">✕</button>
      </div>
      <div class="fields">
        @for (field of schema; track field.key) {
          <label class="field">
            <span>{{ field.label }}</span>
            @switch (field.kind) {
              @case ('text') {
                <input
                  type="text"
                  [ngModel]="config[field.key]"
                  (ngModelChange)="update(field.key, $event)"
                />
              }
              @case ('number') {
                <input
                  type="number"
                  [ngModel]="config[field.key]"
                  (ngModelChange)="update(field.key, +$event)"
                />
              }
              @case ('boolean') {
                <input
                  type="checkbox"
                  [ngModel]="config[field.key]"
                  (ngModelChange)="update(field.key, $event)"
                />
              }
              @case ('select') {
                <select [ngModel]="config[field.key]" (ngModelChange)="update(field.key, $event)">
                  @for (opt of field.options; track opt) {
                    <option [value]="opt">{{ opt }}</option>
                  }
                </select>
              }
              @case ('list') {
                <textarea
                  rows="3"
                  [ngModel]="asListText(config[field.key])"
                  (ngModelChange)="updateList(field.key, $event)"
                  placeholder="One item per line"
                ></textarea>
              }
            }
          </label>
        }
      </div>
    </div>
  `,
  styles: [`
    .drawer { border: 1px solid #c5cae9; border-radius: 8px; background: #f5f6fc; padding: 14px 16px; margin-top: 10px; }
    .drawer-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; }
    .icon { border: none; background: transparent; cursor: pointer; }
    .fields { display: flex; flex-direction: column; gap: 10px; }
    .field { display: flex; flex-direction: column; gap: 4px; font-size: 13px; color: #333; }
    input, select, textarea { padding: 6px 8px; border: 1px solid #ccc; border-radius: 6px; font-size: 13px; font-family: inherit; }
    input[type=checkbox] { width: 16px; height: 16px; align-self: flex-start; }
  `],
})
export class ModuleConfigDrawerComponent {
  @Input() moduleName = '';
  @Input() schema: ModuleFieldSchema[] = [];
  @Input() config: Record<string, any> = {};
  @Output() configChange = new EventEmitter<Record<string, any>>();
  @Output() close = new EventEmitter<void>();

  update(key: string, value: any): void {
    this.configChange.emit({ [key]: value });
  }

  asListText(value: any): string {
    return Array.isArray(value) ? value.join('\n') : '';
  }

  updateList(key: string, text: string): void {
    const list = text.split('\n').map((s) => s.trim()).filter(Boolean);
    this.configChange.emit({ [key]: list });
  }
}
