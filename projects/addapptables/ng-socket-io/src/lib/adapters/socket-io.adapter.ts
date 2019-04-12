import * as io from 'socket.io-client';
import { ISocket } from '@addapptables/ng-web-socket';

export class SocketIoAdapter implements ISocket<SocketIOClient.Socket, SocketIOClient.ConnectOpts> {

    connect(url: string, options?: SocketIOClient.ConnectOpts): Promise<SocketIOClient.Socket> {
        return new Promise((resolve, reject) => {
            try {
                const ioFunc = (io as any).default ? (io as any).default : io;
                const connection = ioFunc(url, options);
                resolve(connection.connect());
            } catch (error) {
                reject(error.message);
            }
        });
    }

    bindEvent(connection: SocketIOClient.Socket, event: string, callFunction: (...args: any[]) => void) {
        connection.on(event, callFunction);
    }

    disconnect(connection: SocketIOClient.Socket): Promise<void> {
        return new Promise((resolve, reject) => {
            try {
                connection.disconnect();
                resolve();
            } catch (error) {
                reject(error.message);
            }
        });
    }
}
