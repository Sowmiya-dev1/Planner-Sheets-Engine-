export interface ThemeConfig {
  name: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
    border: string;
  };
  fonts: {
    heading: string;
    body: string;
  };
}

export const DEFAULT_THEMES: ThemeConfig[] = [
  {
    name: 'Blue / Indigo',
    colors: {
      primary: '#3949ab',
      secondary: '#5c6bc0',
      accent: '#ffca28',
      background: '#ffffff',
      text: '#1a1a2e',
      border: '#c5cae9',
    },
    fonts: { heading: 'Helvetica-Bold', body: 'Helvetica' },
  },
  {
    name: 'Minimal Neutral',
    colors: {
      primary: '#333333',
      secondary: '#666666',
      accent: '#999999',
      background: '#ffffff',
      text: '#1a1a1a',
      border: '#dddddd',
    },
    fonts: { heading: 'Helvetica-Bold', body: 'Helvetica' },
  },
  {
    name: 'Soft Peach',
    colors: {
      primary: '#e08e79',
      secondary: '#f2b8a2',
      accent: '#d46a54',
      background: '#fffaf7',
      text: '#3d2b26',
      border: '#f2d5c9',
    },
    fonts: { heading: 'Helvetica-Bold', body: 'Helvetica' },
  },
  {
    name: 'Professional',
    colors: {
      primary: '#0f4c5c',
      secondary: '#1c7c93',
      accent: '#e36414',
      background: '#ffffff',
      text: '#14213d',
      border: '#cfd8dc',
    },
    fonts: { heading: 'Helvetica-Bold', body: 'Helvetica' },
  },
];
