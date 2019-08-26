# ADDAPPTABLES ng-socket-io
ADDAPPTABLES ng-socket-io is a library for angular,
this library is an adapter for @addapptables/ng-web-socket

## Getting Started
To get started, let's install the package through npm:

Choose the version corresponding to your Angular version:

 Angular     | @addapptables/ng-socket-io
 ----------- | -------------------
 8           | 2.x
 7           | 1.x

```
npm i @addapptables/ng-socket-io  @addapptables/ng-web-socket socket.io-client --S
```

## How to use

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
