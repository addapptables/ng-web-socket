import 'reflect-metadata';
import { WebSocketOptions } from '../models/websocket-options.model';

const METADATA_KEY = '__@addapptables/websocket__';

export const getMetadata = (target: any): any => Reflect.getMetadata(METADATA_KEY, target);

export function WebSocketGateway<T = any>(webSocketOptions: WebSocketOptions<T> = {}) {
    return (target: any) => {
        const metadata = getMetadata(target) || {};
        Reflect.defineMetadata(METADATA_KEY, Object.assign(metadata, webSocketOptions), target);
    };
}

export function Subscribe(event: string) {
    return (target: any, propertyKey: string) => {
        const metadata = getMetadata(target) || {};
        const events = [{ name: event, function: propertyKey }];
        if (metadata.events) {
            events.push(...metadata.events);
        }
        Reflect.defineMetadata(METADATA_KEY, Object.assign(metadata, { events }), target);
    };
}

export function WebSocketServer() {
    return (target: any, propertyKey: string) => {
        const metadata = getMetadata(target) || {};
        Reflect.defineMetadata(METADATA_KEY, Object.assign(metadata, { connection: propertyKey }), target);
    };
}


