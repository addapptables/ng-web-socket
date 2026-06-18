import { ISocket } from '@addapptables/ng-web-socket';
import { HubConnection, IHttpConnectionOptions, HubConnectionBuilder } from '@microsoft/signalr';
import { Injectable } from '@angular/core';

@Injectable()
export class SignalRAdapter implements ISocket<HubConnection, IHttpConnectionOptions> {

    async connect(url: string, options?: IHttpConnectionOptions): Promise<HubConnection> {
        const builder = new HubConnectionBuilder();
        const connection = (options ? builder.withUrl(url, options) : builder.withUrl(url))
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
