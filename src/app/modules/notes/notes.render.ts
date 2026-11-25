import { PlannerModuleInstance } from '../../core/models/planner-module.model';
import { ThemeConfig } from '../../core/models/theme.model';
import { ModuleRenderer, PreviewNode } from '../../core/models/module-renderer.model';

export const notesRenderer: ModuleRenderer = {
  renderPreview(instance: PlannerModuleInstance): PreviewNode {
    const { title, lineCount } = instance.config;
    return {
      title: title ?? 'Notes',
      kind: 'text',
      data: { lines: Array.from({ length: lineCount ?? 20 }, () => '') },
    };
  },

  renderPdf(instance: PlannerModuleInstance, theme: ThemeConfig) {
    const { title, lineCount } = instance.config;
    return [
      { text: title ?? 'Notes', fontSize: 13, bold: true, color: theme.colors.primary, margin: [0, 0, 0, 8] },
      {
        table: {
          widths: ['*'],
          body: Array.from({ length: lineCount ?? 20 }, () => [' ']),
        },
        layout: 'lightHorizontalLines',
      },
    ];
  },

  // No renderExcel — free-form ruled lines don't map to a useful spreadsheet sheet.
};
