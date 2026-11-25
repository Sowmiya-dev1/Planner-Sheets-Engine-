import { PlannerModuleInstance } from '../../core/models/planner-module.model';
import { ThemeConfig } from '../../core/models/theme.model';
import { ModuleRenderer, PreviewNode, ExcelSheetSpec } from '../../core/models/module-renderer.model';

export const taskListRenderer: ModuleRenderer = {
  renderPreview(instance: PlannerModuleInstance): PreviewNode {
    const { title, taskCount, showPriority } = instance.config;
    return {
      title: title ?? 'Task List',
      kind: 'checklist',
      data: {
        lines: Array.from({ length: taskCount ?? 10 }, () => ''),
        showPriority: !!showPriority,
      },
    };
  },

  renderPdf(instance: PlannerModuleInstance, theme: ThemeConfig) {
    const { title, taskCount, showPriority } = instance.config;
    const headerRow = showPriority
      ? [{ text: '', border: [false, false, false, true] }, { text: 'Priority', bold: true }, { text: 'Task', bold: true }]
      : [{ text: '', border: [false, false, false, true] }, { text: 'Task', bold: true }];
    const rows = Array.from({ length: taskCount ?? 10 }, () =>
      showPriority ? ['☐', '', ''] : ['☐', '']
    );
    return [
      { text: title ?? 'Task List', fontSize: 13, bold: true, color: theme.colors.primary, margin: [0, 0, 0, 6] },
      {
        table: { widths: showPriority ? [16, 50, '*'] : [16, '*'], body: [headerRow, ...rows] },
        layout: 'lightHorizontalLines',
      },
    ];
  },

  renderExcel(instance: PlannerModuleInstance): ExcelSheetSpec {
    const { taskCount, showPriority } = instance.config;
    const headers = showPriority ? ['Task', 'Priority', 'Done'] : ['Task', 'Done'];
    const rows = Array.from({ length: taskCount ?? 10 }, () =>
      showPriority ? ['', '', ''] : ['', '']
    );
    return { sheetName: instance.config['title'] ?? 'Task List', headers, rows };
  },
};
