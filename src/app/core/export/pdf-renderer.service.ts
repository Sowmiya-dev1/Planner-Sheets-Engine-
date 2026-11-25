import { Injectable } from '@angular/core';
import { PlannerProject } from '../models/planner-project.model';
import { ModuleRegistryService } from '../services/module-registry.service';

@Injectable({ providedIn: 'root' })
export class PdfRendererService {
  constructor(private registry: ModuleRegistryService) {}

  async export(project: PlannerProject): Promise<void> {
    if (project.pages.length === 0) {
      throw new Error('This planner has no pages to export.');
    }

    const pdfMakeModule: any = await import('pdfmake/build/pdfmake');
    const fontsModule: any = await import('pdfmake/build/vfs_fonts');
    const pdfMake = pdfMakeModule.default ?? pdfMakeModule;
    pdfMake.vfs = (fontsModule.default ?? fontsModule).pdfMake?.vfs ?? fontsModule.vfs;

    const content: any[] = [];

    project.pages.forEach((page, pageIndex) => {
      if (pageIndex > 0) {
        content.push({ text: '', pageBreak: 'before' });
      }
      content.push({
        text: page.name,
        fontSize: 16,
        bold: true,
        color: project.theme.colors.primary,
        margin: [0, 0, 0, 10],
      });

      if (page.modules.length === 0) {
        content.push({ text: '(empty page)', italics: true, color: '#999999' });
        return;
      }

      page.modules
        .filter((m) => m.visible !== false)
        .forEach((instance) => {
          const renderer = this.registry.getRenderer(instance.type);
          if (!renderer) {
            content.push({ text: `Unsupported module type: ${instance.type}`, color: '#b00020' });
            return;
          }
          try {
            content.push(renderer.renderPdf(instance, project.theme));
            content.push({ text: '', margin: [0, 0, 0, 12] });
          } catch (e) {
            content.push({ text: `Failed to render "${instance.name}"`, color: '#b00020' });
          }
        });
    });

    const docDefinition = {
      pageSize: project.document.pageSize,
      pageOrientation: project.document.orientation,
      pageMargins: [
        project.document.margins.left,
        project.document.margins.top,
        project.document.margins.right,
        project.document.margins.bottom,
      ],
      defaultStyle: { fontSize: 11, color: project.theme.colors.text },
      content,
    };

    pdfMake.createPdf(docDefinition).download(`${this.slug(project.project.name)}.pdf`);
  }

  private slug(name: string): string {
    return name.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || 'planner';
  }
}
