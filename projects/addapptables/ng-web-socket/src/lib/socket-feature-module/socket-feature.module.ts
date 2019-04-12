import { NgModule, Inject, Type } from '@angular/core';
import { ManagerSocketAdapter } from '../adapters/manager-socket-adapters';
import { FEATURE_GATEWAY } from '../tokens';

@NgModule()
export class SocketFeatureModule {

    constructor(
        managerSocketAdapter: ManagerSocketAdapter,
        @Inject(FEATURE_GATEWAY) sockets: Type<any>[]
    ) {
        managerSocketAdapter.addSockects(sockets);
    }

}
