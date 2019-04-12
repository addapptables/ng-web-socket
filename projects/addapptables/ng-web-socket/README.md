# ADDAPPTABLES ng-web-socket

ADDAPPTABLES ng-web-socket is a library for angular,
this library has adapters for socket-io and signalr

## Getting Started
For socket-io see the following [link](https://github.com/addapptables/ng-web-socket/tree/master/projects/addapptables/ng-socket-io)

For signal-r see the following [link](https://github.com/addapptables/ng-web-socket/tree/master/projects/addapptables/ng-signal-r)

```
npm i @addapptables/ng-web-socket --S
```

Create a websocket service

```typescript
// gateway with params
@WebSocketGateway<SocketIOClient.ConnectOpts>({
  url: 'http://localhost:8081',
  autoConnect: true
})
export class WebSocketService {

  // web socket connection
  @WebSocketServer()
  server: SocketIOClient.Socket;

  // subscribe event
  @Subscribe('news')
  connectedUsers(data: any) {
    console.log(data);
    this.server.emit('my other event', { my: 'data' });
  }

  // emit events
  sendMessage() {
    this.server.emit('my other event', { my: 'data' });
  }
}
```

import adapter and WebSocketService into the module

```typescript
import { NgWebSocketModule } from '@addapptables/ng-web-socket';
import { SocketIoAdapter } from '@addapptables/ng-socket-io';
@NgModule({
  imports: [
    ...,
    NgWebSocketModule.forRoot(SocketIoAdapter, [WebSocketService, /* other services socket here*/])
    /*
    Or
    NgWebSocketModule.forRoot(SocketIoAdapter, [])
    Adapter is required
    */
  ]
})
export class AppModule { }
```

for child modules

```typescript
import { NgWebSocketModule } from '@addapptables/ng-web-socket';
@NgModule({
  imports: [
    ...,
    NgWebSocketModule.forFeature([WebSocketService, /* other services socket here*/])
  ]
})
export class AppModule { }
```

If you require a service to obtain the url, you can do the following

```typescript
// gateway with params
@WebSocketGateway<SocketIOClient.ConnectOpts>({
  autoConnect: false
})
export class WebSocketService implements ISocketWithOptions<SocketIOClient.ConnectOpts> {

  // web socket connection
  @WebSocketServer()
  server: SocketIOClient.Socket;

  constructor(
    @Inject(API_BASE_URL) private _baseUrl: string,
    private _managerSocketAdapter: ManagerSocketAdapter
  ) { }

  //build options for websocket
  withOptions(): WebSocketOptions<SocketIOClient.ConnectOpts> {
    const token = '123';
    const url = this._baseUrl + '?token=' + token;
    return {
      url
    };
  }

  connect() {
    this._managerSocketAdapter.connect(this);
  }

  // subscribe event
  @Subscribe('news')
  connectedUsers(data: any) {
    console.log(data);
    this.server.emit('my other event', { my: 'data' });
  }

  // emit events
  sendMessage() {
    this.server.emit('my other event', { my: 'data' });
  }
}
```

Inject websocket into the component

```typescript
@Component({
    ...
})
export class YourComponent implements OnInit {

  constructor(
    public _webSocketService: WebSocketService
  ) {
  }

  ngOnInit() {
    this._webSocketService.connect();
  }
}
```

## Custom adapters

Create a custom adapter:

```typescript
import * as io from 'socket.io-client';
import { ISocket } from '@addapptables/ng-web-socket';

@Injectable()
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