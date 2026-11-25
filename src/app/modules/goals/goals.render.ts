import { PlannerModuleInstance } from '../../core/models/planner-module.model';
import { ThemeConfig } from '../../core/models/theme.model';
import { ModuleRenderer, PreviewNode, ExcelSheetSpec } from '../../core/models/module-renderer.model';

export const goalsRenderer: ModuleRenderer = {
  renderPreview(instance: PlannerModuleInstance): PreviewNode {
    const { title, goalCount } = instance.config;
    return {
      title: title ?? 'Goals',
      kind: 'checklist',
      data: { lines: Array.from({ length: goalCount ?? 5 }, () => '') },
    };
  },

  renderPdf(instance: PlannerModuleInstance, theme: ThemeConfig) {
    const { title, goalCount } = instance.config;
    return [
      { text: title ?? 'Goals', fontSize: 13, bold: true, color: theme.colors.primary, margin: [0, 0, 0, 6] },
      {
        table: {
          widths: [16, '*'],
          body: Array.from({ length: goalCount ?? 5 }, (_, i) => ['☐', ` ${i + 1}. `]),
        },
        layout: 'lightHorizontalLines',
      },
    ];
  },

  renderExcel(instance: PlannerModuleInstance): ExcelSheetSpec {
    const { goalCount } = instance.config;
    return {
      sheetName: instance.config['title'] ?? 'Goals',
      headers: ['Goal', 'Target Date', 'Status'],
      rows: Array.from({ length: goalCount ?? 5 }, () => ['', '', '']),
    };
  },
};
