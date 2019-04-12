import { NgModule, Inject, Type } from '@angular/core';
import { ROOT_GATEWAY } from '../tokens';
import { ManagerSocketAdapter } from '../adapters/manager-socket-adapters';

@NgModule()
export class SocketRootModule {

  constructor(
    managerSocketAdapter: ManagerSocketAdapter,
    @Inject(ROOT_GATEWAY) sockets: Type<any>[]
  ) {
    managerSocketAdapter.addSockects(sockets);
  }

}
