import { PlannerModuleInstance } from '../../core/models/planner-module.model';
import { ThemeConfig } from '../../core/models/theme.model';
import { ModuleRenderer, PreviewNode, ExcelSheetSpec } from '../../core/models/module-renderer.model';

export const dailyPlannerRenderer: ModuleRenderer = {
  renderPreview(instance: PlannerModuleInstance, theme: ThemeConfig): PreviewNode {
    const { title, showHourlySchedule, startHour, endHour, priorityCount } = instance.config;
    const rows: string[] = [];
    if (showHourlySchedule) {
      for (let h = startHour; h <= endHour; h++) {
        rows.push(`${String(h).padStart(2, '0')}:00`);
      }
    }
    return {
      title: title ?? 'Daily Planner',
      kind: 'table',
      data: {
        priorities: Array.from({ length: priorityCount ?? 3 }, (_, i) => `Priority ${i + 1}`),
        hours: rows,
      },
    };
  },

  renderPdf(instance: PlannerModuleInstance, theme: ThemeConfig) {
    const { title, showHourlySchedule, startHour, endHour, priorityCount } = instance.config;
    const body: any[] = [
      { text: title ?? 'Daily Planner', fontSize: 13, bold: true, color: theme.colors.primary, margin: [0, 0, 0, 6] },
    ];

    if (priorityCount > 0) {
      body.push({ text: 'Top Priorities', bold: true, fontSize: 10, margin: [0, 0, 0, 4] });
      body.push({
        ul: Array.from({ length: priorityCount }, () => ' '),
        margin: [0, 0, 0, 10],
      });
    }

    if (showHourlySchedule) {
      const rows: any[] = [];
      for (let h = startHour; h <= endHour; h++) {
        rows.push([`${String(h).padStart(2, '0')}:00`, '']);
      }
      body.push({
        table: { widths: [50, '*'], body: [[{ text: 'Time', bold: true }, { text: 'Notes', bold: true }], ...rows] },
        layout: 'lightHorizontalLines',
      });
    }

    return body;
  },

  renderExcel(instance: PlannerModuleInstance): ExcelSheetSpec {
    const { startHour, endHour, priorityCount } = instance.config;
    const rows: (string | number)[][] = [];
    for (let h = startHour; h <= endHour; h++) {
      rows.push([`${String(h).padStart(2, '0')}:00`, '']);
    }
    for (let i = 0; i < (priorityCount ?? 0); i++) {
      rows.push([`Priority ${i + 1}`, '']);
    }
    return {
      sheetName: instance.config['title'] ?? 'Daily Planner',
      headers: ['Time / Priority', 'Notes'],
      rows,
    };
  },
};
