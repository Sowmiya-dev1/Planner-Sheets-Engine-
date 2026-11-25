import { ApplicationConfig, provideZoneChangeDetection, APP_INITIALIZER } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { ModuleRegistryService } from './core/services/module-registry.service';
import { registerCoreModules } from './core/services/register-core-modules';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    {
      provide: APP_INITIALIZER,
      multi: true,
      deps: [ModuleRegistryService],
      useFactory: (registry: ModuleRegistryService) => () => registerCoreModules(registry),
    },
  ]
};
