# ADDAPPTABLES ng-socket-io
ADDAPPTABLES ng-socket-io is a library for Angular,
this library is a **socket.io** adapter for @addapptables/ng-web-socket.

## Getting Started
To get started, let's install the package through npm:

Choose the version corresponding to your Angular version:

 Angular     | @addapptables/ng-socket-io
 ----------- | -------------------
 19          | 3.x
 8           | 2.x
 7           | 1.x

> **v3 note:** this version targets `socket.io-client` v4. The global
> `SocketIOClient.*` types from `@types/socket.io-client` are gone — the package
> now ships its own `Socket` and `ManagerOptions & SocketOptions` types.

```
npm i @addapptables/ng-socket-io @addapptables/ng-web-socket socket.io-client --S
```

## How to use

### Create a websocket service

```typescript
import { Socket } from 'socket.io-client';
import { WebSocketGateway, WebSocketServer, Subscribe } from '@addapptables/ng-web-socket';

// gateway with params
@WebSocketGateway({
  url: 'http://localhost:8081',
  autoConnect: true
})
export class WebSocketService {

  // web socket connection
  @WebSocketServer()
  server: Socket;

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

### Standalone API (Angular 19+) — recommended

```typescript
import { bootstrapApplication } from '@angular/platform-browser';
import { provideWebSocket } from '@addapptables/ng-web-socket';
import { SocketIoAdapter } from '@addapptables/ng-socket-io';

bootstrapApplication(AppComponent, {
  providers: [
    provideWebSocket(SocketIoAdapter, [WebSocketService, /* other socket services here */]),
    // Adapter is required, gateways array can be empty:
    // provideWebSocket(SocketIoAdapter, []),
  ],
});
```

For lazy / feature scopes:

```typescript
import { provideWebSocketFeature } from '@addapptables/ng-web-socket';

export const routes: Routes = [
  {
    path: 'chat',
    providers: [provideWebSocketFeature([ChatGateway])],
    loadComponent: () => import('./chat/chat.component').then((m) => m.ChatComponent),
  },
];
```

### NgModule API (legacy, still supported)

Import the adapter and `WebSocketService` into the module:

```typescript
import { NgWebSocketModule } from '@addapptables/ng-web-socket';
import { SocketIoAdapter } from '@addapptables/ng-socket-io';
@NgModule({
  imports: [
    ...,
    NgWebSocketModule.forRoot(SocketIoAdapter, [WebSocketService, /* other socket services here */])
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
    NgWebSocketModule.forFeature([WebSocketService, /* other socket services here */])
  ]
})
export class FeatureModule { }
```

### Resolving the url from a service

If you require a service to obtain the url, you can do the following:

```typescript
import { Socket } from 'socket.io-client';
import {
  WebSocketGateway,
  WebSocketServer,
  Subscribe,
  ISocketWithOptions,
  WebSocketOptions,
  ManagerSocketAdapter,
} from '@addapptables/ng-web-socket';

// gateway with params
@WebSocketGateway({
  autoConnect: false
})
export class WebSocketService implements ISocketWithOptions {

  // web socket connection
  @WebSocketServer()
  server: Socket;

  constructor(
    @Inject(API_BASE_URL) private _baseUrl: string,
    private _managerSocketAdapter: ManagerSocketAdapter
  ) { }

  // build options for websocket
  withOptions(): WebSocketOptions {
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

Inject the websocket service into the component:

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
