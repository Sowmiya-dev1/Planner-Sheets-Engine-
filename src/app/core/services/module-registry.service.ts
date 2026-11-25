import { Injectable } from '@angular/core';
import { PlannerModuleDefinition } from '../models/planner-module.model';
import { ModuleRenderer } from '../models/module-renderer.model';

interface RegisteredModule {
  definition: PlannerModuleDefinition;
  renderer: ModuleRenderer;
}

/**
 * Central registry mapping module `type` -> definition + renderer.
 * UI, PDF export, and Excel export all read from this single source,
 * so a module written once (Stage 4) works everywhere without touching
 * the builder shell.
 */
@Injectable({ providedIn: 'root' })
export class ModuleRegistryService {
  private readonly modules = new Map<string, RegisteredModule>();

  register(definition: PlannerModuleDefinition, renderer: ModuleRenderer): void {
    if (this.modules.has(definition.type)) {
      console.warn(`Module type "${definition.type}" is already registered — overwriting.`);
    }
    this.modules.set(definition.type, { definition, renderer });
  }

  getDefinition(type: string): PlannerModuleDefinition | undefined {
    return this.modules.get(type)?.definition;
  }

  getRenderer(type: string): ModuleRenderer | undefined {
    return this.modules.get(type)?.renderer;
  }

  listDefinitions(): PlannerModuleDefinition[] {
    return Array.from(this.modules.values()).map((m) => m.definition);
  }

  listByCategory(category: string): PlannerModuleDefinition[] {
    return this.listDefinitions().filter((d) => d.category === category);
  }
}
