export type LayoutType =
  | 'single-column'
  | 'two-column'
  | 'grid'
  | 'full-width'
  | 'header-content'
  | 'header-two-column';

export interface LayoutDefinition {
  type: LayoutType;
  name: string;
  description?: string;
}

export const LAYOUT_DEFINITIONS: LayoutDefinition[] = [
  { type: 'single-column', name: 'Single Column', description: 'One column, stacked modules' },
  { type: 'two-column', name: 'Two Column', description: 'Two even columns' },
  { type: 'grid', name: 'Grid', description: 'Grid of modules' },
  { type: 'full-width', name: 'Full Width', description: 'One full-width module' },
  { type: 'header-content', name: 'Header + Content', description: 'Header module, then content below' },
  { type: 'header-two-column', name: 'Header + Two Column', description: 'Header module, then two columns' },
];
