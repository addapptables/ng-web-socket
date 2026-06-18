import {
  EnvironmentProviders,
  Provider,
  Type,
  inject,
  makeEnvironmentProviders,
  provideAppInitializer,
} from '@angular/core';
import { ISocket } from '../interfaces/socket.interface';
import { ManagerSocketAdapter } from '../adapters/manager-socket-adapters';
import { ROOT_ADAPTER, ROOT_GATEWAY, FEATURE_GATEWAY } from '../tokens';

export function createSourceInstances(...instances: any[]): any[] {
  return instances;
}

/**
 * Shared provider list for the root configuration. Reused by both the
 * NgModule-based `NgWebSocketModule.forRoot` and the standalone
 * `provideWebSocket` APIs so the behaviour stays identical.
 */
export function rootSocketProviders(
  adapter: Type<ISocket<any>>,
  webSockets: Type<any>[]
): Provider[] {
  return [
    ManagerSocketAdapter,
    webSockets,
    adapter,
    {
      provide: ROOT_ADAPTER,
      useExisting: adapter,
    },
    {
      provide: ROOT_GATEWAY,
      deps: webSockets,
      useFactory: createSourceInstances,
    },
  ];
}

/**
 * Shared provider list for a feature configuration. Reused by both
 * `NgWebSocketModule.forFeature` and `provideWebSocketFeature`.
 */
export function featureSocketProviders(webSockets: Type<any>[]): Provider[] {
  return [
    webSockets,
    {
      provide: FEATURE_GATEWAY,
      multi: true,
      deps: webSockets,
      useFactory: createSourceInstances,
    },
  ];
}

/**
 * Standalone API. Registers the web socket adapter and the root gateways and
 * auto-wires them through `ManagerSocketAdapter` during app initialization.
 *
 * Use it inside `bootstrapApplication` / `ApplicationConfig`:
 *
 * ```ts
 * bootstrapApplication(AppComponent, {
 *   providers: [
 *     provideWebSocket(SocketIoAdapter, [ChatGateway]),
 *   ],
 * });
 * ```
 */
export function provideWebSocket(
  adapter: Type<ISocket<any>>,
  webSockets: Type<any>[]
): EnvironmentProviders {
  return makeEnvironmentProviders([
    ...rootSocketProviders(adapter, webSockets),
    provideAppInitializer(() => {
      const manager = inject(ManagerSocketAdapter);
      const sockets = inject(ROOT_GATEWAY);
      manager.addSockects(sockets);
    }),
  ]);
}

/**
 * Standalone API for lazy / feature scopes. Registers feature gateways and
 * wires them through the existing `ManagerSocketAdapter`.
 *
 * ```ts
 * const routes: Routes = [
 *   {
 *     path: 'chat',
 *     providers: [provideWebSocketFeature([ChatGateway])],
 *     loadComponent: () => import('./chat.component'),
 *   },
 * ];
 * ```
 */
export function provideWebSocketFeature(
  webSockets: Type<any>[]
): EnvironmentProviders {
  return makeEnvironmentProviders([
    webSockets,
    provideAppInitializer(() => {
      const manager = inject(ManagerSocketAdapter);
      // Resolve THIS feature's gateway instances and wire only them, so
      // multiple `provideWebSocketFeature` calls don't double-register.
      const sockets = webSockets.map((socket) => inject(socket));
      manager.addSockects(sockets);
    }),
  ]);
}
