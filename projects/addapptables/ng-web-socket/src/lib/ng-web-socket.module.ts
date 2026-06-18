import { NgModule, Type, ModuleWithProviders } from '@angular/core';
import { SocketRootModule } from './socket-root-module/socket-root.module';
import { SocketFeatureModule } from './socket-feature-module/socket-feature.module';
import { ISocket } from './interfaces/socket.interface';
import {
  rootSocketProviders,
  featureSocketProviders,
  createSourceInstances,
} from './providers/web-socket.providers';

// Re-exported for backwards compatibility (was historically exported here).
export { createSourceInstances };

@NgModule()
export class NgWebSocketModule {
  static forRoot(
    adapter: Type<ISocket<any>>,
    webSockets: Type<any>[]
  ): ModuleWithProviders<SocketRootModule> {
    return {
      ngModule: SocketRootModule,
      providers: rootSocketProviders(adapter, webSockets),
    };
  }

  static forFeature(
    webSockets: Type<any>[]
  ): ModuleWithProviders<SocketFeatureModule> {
    return {
      ngModule: SocketFeatureModule,
      providers: featureSocketProviders(webSockets),
    };
  }
}
