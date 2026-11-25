import { PlannerModuleInstance } from './planner-module.model';
import { ThemeConfig } from './theme.model';

/** Lightweight, framework-agnostic description of what a module looks like in preview. */
export interface PreviewNode {
  title: string;
  kind: 'text' | 'table' | 'checklist' | 'grid';
  data: any;
}

/** A single sheet's worth of Excel data. */
export interface ExcelSheetSpec {
  sheetName: string;
  headers: string[];
  rows: (string | number | boolean)[][];
}

export interface ModuleRenderer {
  renderPreview(instance: PlannerModuleInstance, theme: ThemeConfig): PreviewNode;
  renderPdf(instance: PlannerModuleInstance, theme: ThemeConfig): any; // pdfmake content node
  renderExcel?(instance: PlannerModuleInstance): ExcelSheetSpec;
}
