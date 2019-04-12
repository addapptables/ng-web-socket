import { Injectable, Inject, OnDestroy } from '@angular/core';
import { ISocket } from '../interfaces/socket.interface';
import { ROOT_ADAPTER } from '../tokens';
import { getMetadata } from '../decorators/socket.decorator';
import { WebSocketOptions } from '../models/websocket-options.model';
import { WebSocketEventModel } from '../models/websocket-event.model';
import { withOptions } from '../life-cycle/socket-with-options';

@Injectable()
export class ManagerSocketAdapter implements OnDestroy {

    private sockets: any[];

    private connections: any[] = [];

    constructor(@Inject(ROOT_ADAPTER) private adapter: ISocket<any>) { }

    addSockects(serviceSockets: any) {
        this.sockets = serviceSockets;
        this.sockets.forEach(socket => {
            const metadata = <WebSocketOptions>getMetadata(socket.constructor);
            if (metadata.autoConnect) {
                this.connect(socket);
            }
        });
    }

    async connect(serviceSocket: any) {
        let metadata = <WebSocketOptions>getMetadata(serviceSocket.constructor);
        const methods = getMetadata(serviceSocket);
        if (typeof serviceSocket[withOptions] === 'function') {
            metadata = Object.assign(metadata, serviceSocket[withOptions]());
        }
        const connection = await this.adapter.connect(metadata.url, metadata.options);
        this.bindConnection(methods, connection, serviceSocket);
        const events = methods && methods.events;
        this.bindEvents(connection, events, serviceSocket);
    }

    private bindConnection(methods: any, connection: any, serviceSocket: any) {
        if (methods && methods.connection) {
            serviceSocket[methods.connection] = connection;
        }
        this.connections.push(connection);
    }

    private bindEvents(connection: any, events: WebSocketEventModel[], serviceSocket: any) {
        if (events) {
            events.forEach(event => {
                this.adapter.bindEvent(connection, event.name, serviceSocket[event.function].bind(serviceSocket));
            });
        }
    }

    ngOnDestroy(): void {
        this.connections.forEach(x => this.adapter.disconnect(x));
    }
}
