# ADDAPPTABLES ng-web-socket

ADDAPPTABLES ng-web-socket is a library for angular,
this library has adapters for socket-io and signalr

## Getting Started
For socket-io see the following [link](https://github.com/addapptables/ng-web-socket/tree/master/projects/addapptables/ng-socket-io)

For signal-r see the following [link](https://github.com/addapptables/ng-web-socket/tree/master/projects/addapptables/ng-signal-r)

```
npm i @addapptables/ng-web-socket --S
```

## Custom adapters

Create a custom adapter:

```typescript
import * as io from 'socket.io-client';
import { ISocket } from '@addapptables/ng-web-socket';

// implements ISocket
export class SocketIoAdapter implements ISocket<SocketIOClient.Socket, SocketIOClient.ConnectOpts> {

    // connect to ws transport
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

    // bind events with current connection
    bindEvent(connection: SocketIOClient.Socket, event: string, callFunction: (...args: any[]) => void) {
        connection.on(event, callFunction);
    }

    // disconnect current connection
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
```

import adapter into the module

```typescript
import { NgWebSocketModule } from '@addapptables/ng-web-socket';
import { SocketIoAdapter } from '@addapptables/ng-socket-io';
@NgModule({
  imports: [
    ...,
    NgWebSocketModule.forRoot(SocketIoAdapter, [/*socket services here*/])
  ]
})
export class AppModule { }
```