import { Injectable } from '@angular/core';
import { PlannerProject } from '../models/planner-project.model';
import { ModuleRegistryService } from '../services/module-registry.service';

@Injectable({ providedIn: 'root' })
export class ExcelRendererService {
  constructor(private registry: ModuleRegistryService) {}

  async export(project: PlannerProject): Promise<void> {
    if (project.pages.length === 0) {
      throw new Error('This planner has no pages to export.');
    }

    const XLSX: any = await import('xlsx');
    const workbook = XLSX.utils.book_new();
    const usedNames = new Set<string>();
    let sheetCount = 0;

    for (const page of project.pages) {
      for (const instance of page.modules) {
        if (instance.visible === false) continue;
        const renderer = this.registry.getRenderer(instance.type);
        if (!renderer?.renderExcel) continue; // e.g. Notes has no useful sheet form

        const spec = renderer.renderExcel(instance);
        const sheetName = this.uniqueSheetName(spec.sheetName, usedNames);
        const worksheet = XLSX.utils.aoa_to_sheet([spec.headers, ...spec.rows]);
        XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
        sheetCount++;
      }
    }

    if (sheetCount === 0) {
      throw new Error('None of the modules in this planner support Excel export.');
    }

    XLSX.writeFile(workbook, `${this.slug(project.project.name)}.xlsx`);
  }

  private uniqueSheetName(name: string, used: Set<string>): string {
    // Excel sheet names: max 31 chars, no : \ / ? * [ ]
    let base = (name || 'Sheet').replace(/[:\\/?*[\]]/g, '').slice(0, 28) || 'Sheet';
    let candidate = base;
    let i = 2;
    while (used.has(candidate)) {
      candidate = `${base} ${i++}`.slice(0, 31);
    }
    used.add(candidate);
    return candidate;
  }

  private slug(name: string): string {
    return name.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || 'planner';
  }
}
