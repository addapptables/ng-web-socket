import { NgModule, Type, ModuleWithProviders } from '@angular/core';
import { SocketRootModule } from './socket-root-module/socket-root.module';
import { ROOT_GATEWAY, FEATURE_GATEWAY, ROOT_ADAPTER } from './tokens';
import { SocketFeatureModule } from './socket-feature-module/socket-feature.module';
import { ISocket } from './interfaces/socket.interface';
import { ManagerSocketAdapter } from './adapters/manager-socket-adapters';

@NgModule()
export class NgWebSocketModule {
  static forRoot(
    adapter: Type<ISocket<any>>,
    webSockets: Type<any>[]
  ): ModuleWithProviders<SocketRootModule> {
    return {
      ngModule: SocketRootModule,
      providers: [
        ManagerSocketAdapter,
        webSockets,
        adapter,
        {
          provide: ROOT_ADAPTER,
          useExisting: adapter
        },
        {
          provide: ROOT_GATEWAY,
          deps: webSockets,
          useFactory: createSourceInstances,
        },
      ],
    };
  }

  static forFeature(
    webSockets: Type<any>[]
  ): ModuleWithProviders<SocketFeatureModule> {
    return {
      ngModule: SocketFeatureModule,
      providers: [
        webSockets,
        {
          provide: FEATURE_GATEWAY,
          multi: true,
          deps: webSockets,
          useFactory: createSourceInstances,
        },
      ],
    };
  }
}

export function createSourceInstances(...instances: any[]) {
  return instances;
}
