import { Routes } from '@angular/router';
import { ProjectViewComponent } from './planner/builder/project-view/project-view.component';
import { ModulesViewComponent } from './planner/builder/modules-view/modules-view.component';
import { PagesViewComponent } from './planner/builder/pages-view/pages-view.component';
import { ThemeViewComponent } from './planner/builder/theme-view/theme-view.component';
import { PreviewViewComponent } from './planner/builder/preview-view/preview-view.component';
import { ExportViewComponent } from './planner/builder/export-view/export-view.component';

export const routes: Routes = [
  { path: '', redirectTo: 'project', pathMatch: 'full' },
  { path: 'project', component: ProjectViewComponent },
  { path: 'modules', component: ModulesViewComponent },
  { path: 'pages', component: PagesViewComponent },
  { path: 'theme', component: ThemeViewComponent },
  { path: 'preview', component: PreviewViewComponent },
  { path: 'export', component: ExportViewComponent },
];
