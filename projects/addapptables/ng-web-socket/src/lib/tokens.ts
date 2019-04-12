import { InjectionToken, Type } from '@angular/core';
import { ISocket } from './interfaces/socket.interface';

export const ROOT_GATEWAY = new InjectionToken<Type<any>[]>(
    'addapptables/websocket: Root WebSocket'
);

export const ROOT_ADAPTER = new InjectionToken<ISocket<any>>(
    'addapptables/websocket: Root Adapter'
);

export const FEATURE_GATEWAY = new InjectionToken<any[][]>(
    'addapptables/websocket: Feature WebSocket'
);
