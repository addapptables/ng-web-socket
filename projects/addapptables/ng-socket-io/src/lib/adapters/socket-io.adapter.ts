import { io, Socket, ManagerOptions, SocketOptions } from 'socket.io-client';
import { ISocket } from '@addapptables/ng-web-socket';
import { Injectable } from '@angular/core';

export type SocketIoOptions = Partial<ManagerOptions & SocketOptions>;

@Injectable()
export class SocketIoAdapter implements ISocket<Socket, SocketIoOptions> {

    connect(url: string, options?: SocketIoOptions): Promise<Socket> {
        return new Promise<Socket>((resolve, reject) => {
            try {
                const connection = io(url, options);
                resolve(connection);
            } catch (error) {
                reject(error instanceof Error ? error.message : error);
            }
        });
    }

    bindEvent(connection: Socket, event: string, callFunction: (...args: any[]) => void): void {
        connection.on(event, callFunction);
    }

    disconnect(connection: Socket): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            try {
                connection.disconnect();
                resolve();
            } catch (error) {
                reject(error instanceof Error ? error.message : error);
            }
        });
    }
}
