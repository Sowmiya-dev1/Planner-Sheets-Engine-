import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="shell">
      <header class="topbar">
        <span class="brand">Planner Builder</span>
        <nav>
          <a routerLink="/project" routerLinkActive="active">Project</a>
          <a routerLink="/modules" routerLinkActive="active">Modules</a>
          <a routerLink="/pages" routerLinkActive="active">Pages</a>
          <a routerLink="/theme" routerLinkActive="active">Theme</a>
          <a routerLink="/preview" routerLinkActive="active">Preview</a>
          <a routerLink="/export" routerLinkActive="active">Export</a>
        </nav>
      </header>
      <main class="content">
        <router-outlet />
      </main>
      <footer class="statusbar">
        Phase 1 — Internal Planner Engine
      </footer>
    </div>
  `,
  styles: [`
    .shell { display: flex; flex-direction: column; height: 100vh; font-family: system-ui, sans-serif; }
    .topbar {
      display: flex; align-items: center; gap: 24px;
      padding: 0 20px; height: 56px; background: #1a1a2e; color: #fff;
    }
    .brand { font-weight: 600; }
    nav { display: flex; gap: 4px; }
    nav a {
      color: #cfcfe8; text-decoration: none; padding: 8px 12px; border-radius: 6px; font-size: 14px;
    }
    nav a.active, nav a:hover { background: #33334d; color: #fff; }
    .content { flex: 1; overflow: auto; background: #fafafa; }
    .statusbar { height: 32px; display: flex; align-items: center; padding: 0 16px; font-size: 12px; color: #888; border-top: 1px solid #eee; }
  `],
})
export class AppComponent {}
