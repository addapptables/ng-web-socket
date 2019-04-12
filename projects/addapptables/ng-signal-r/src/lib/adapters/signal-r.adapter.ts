import { ISocket } from '@addapptables/ng-web-socket';
import { HubConnection, IHttpConnectionOptions, HubConnectionBuilder } from '@aspnet/signalr';
import { Injectable } from '@angular/core';

@Injectable()
export class SignalRAdapter implements ISocket<HubConnection, IHttpConnectionOptions> {

    async connect(url: string, options?: IHttpConnectionOptions): Promise<HubConnection> {
        const connection = new HubConnectionBuilder()
            .withUrl(url, options)
            .build();
        await connection.start();
        return connection;
    }

    bindEvent(connection: HubConnection, event: string, callFunction: (...args: any[]) => void) {
        connection.on(event, callFunction);
    }

    async disconnect(connection: HubConnection): Promise<void> {
        await connection.stop();
    }

}
