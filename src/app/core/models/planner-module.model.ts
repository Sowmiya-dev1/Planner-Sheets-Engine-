export type ModuleCategory = 'productivity' | 'tracking' | 'planning';

export type ModuleFieldKind = 'text' | 'number' | 'boolean' | 'select' | 'list';

export interface ModuleFieldSchema {
  key: string;
  label: string;
  kind: ModuleFieldKind;
  options?: string[];
  default?: any;
}

/** Static definition of a module type — registered once, reused everywhere. */
export interface PlannerModuleDefinition {
  type: string;
  name: string;
  description?: string;
  category: ModuleCategory;
  defaultConfig: Record<string, any>;
  configSchema: ModuleFieldSchema[];
}

/** A placed instance of a module on a page. */
export interface PlannerModuleInstance {
  id: string;
  type: string;
  name?: string;
  config: Record<string, any>;
  visible: boolean;
}

export function createModuleInstance(
  definition: PlannerModuleDefinition,
  id: string
): PlannerModuleInstance {
  return {
    id,
    type: definition.type,
    name: definition.name,
    config: { ...definition.defaultConfig },
    visible: true,
  };
}
