import { PlannerModuleInstance } from '../../core/models/planner-module.model';
import { ThemeConfig } from '../../core/models/theme.model';
import { ModuleRenderer, PreviewNode, ExcelSheetSpec } from '../../core/models/module-renderer.model';

export const habitTrackerRenderer: ModuleRenderer = {
  renderPreview(instance: PlannerModuleInstance): PreviewNode {
    const { title, habitNames, days } = instance.config;
    return {
      title: title ?? 'Habit Tracker',
      kind: 'grid',
      data: { rows: habitNames ?? [], columns: days ?? 7 },
    };
  },

  renderPdf(instance: PlannerModuleInstance, theme: ThemeConfig) {
    const { title, habitNames, days } = instance.config;
    const dayHeaders = Array.from({ length: days ?? 7 }, (_, i) => `D${i + 1}`);
    const header = ['Habit', ...dayHeaders].map((h: string) => ({ text: h, bold: true, fontSize: 9 }));
    const rows = (habitNames ?? []).map((habit: string) => [habit, ...dayHeaders.map(() => '☐')]);
    return [
      { text: title ?? 'Habit Tracker', fontSize: 13, bold: true, color: theme.colors.primary, margin: [0, 0, 0, 6] },
      {
        table: { widths: [80, ...dayHeaders.map(() => 18)], body: [header, ...rows] },
        layout: 'lightHorizontalLines',
        fontSize: 9,
      },
    ];
  },

  renderExcel(instance: PlannerModuleInstance): ExcelSheetSpec {
    const { habitNames, days } = instance.config;
    const dayHeaders = Array.from({ length: days ?? 7 }, (_, i) => `Day ${i + 1}`);
    const rows = (habitNames ?? []).map((habit: string) => [habit, ...dayHeaders.map(() => '')]);
    return {
      sheetName: instance.config['title'] ?? 'Habit Tracker',
      headers: ['Habit', ...dayHeaders],
      rows,
    };
  },
};
