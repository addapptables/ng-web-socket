# ADDAPPTABLES ng-web-socket

ADDAPPTABLES ng-web-socket is a library for Angular.
This library has adapters for **socket.io** and **SignalR**.

## Getting Started

For socket.io see the following [link](https://github.com/addapptables/ng-web-socket/tree/master/projects/addapptables/ng-socket-io)

For SignalR see the following [link](https://github.com/addapptables/ng-web-socket/tree/master/projects/addapptables/ng-signal-r)

Choose the version corresponding to your Angular version:

 Angular     | @addapptables/ng-web-socket
 ----------- | -------------------
 19          | 3.x
 8           | 2.x
 7           | 1.x

```
npm i @addapptables/ng-web-socket --S
```

> **v3 highlights:** Angular 19 support, standalone provider APIs
> (`provideWebSocket` / `provideWebSocketFeature`), socket.io-client v4 and
> `@microsoft/signalr`. The classic `NgModule` API (`NgWebSocketModule.forRoot` /
> `forFeature`) is still fully supported.

## Create a websocket service

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

## Usage

### Standalone API (Angular 19+) — recommended

Register the adapter and your gateways in `bootstrapApplication`:

```typescript
import { bootstrapApplication } from '@angular/platform-browser';
import { provideWebSocket } from '@addapptables/ng-web-socket';
import { SocketIoAdapter } from '@addapptables/ng-socket-io';
import { AppComponent } from './app/app.component';
import { WebSocketService } from './app/web-socket.service';

bootstrapApplication(AppComponent, {
  providers: [
    provideWebSocket(SocketIoAdapter, [WebSocketService, /* other socket services here */]),
    // Adapter is required, gateways array can be empty:
    // provideWebSocket(SocketIoAdapter, []),
  ],
});
```

For lazy / feature scopes (e.g. lazy routes), use `provideWebSocketFeature`:

```typescript
import { Routes } from '@angular/router';
import { provideWebSocketFeature } from '@addapptables/ng-web-socket';
import { ChatGateway } from './chat/chat.gateway';

export const routes: Routes = [
  {
    path: 'chat',
    providers: [
      provideWebSocketFeature([ChatGateway, /* other socket services here */]),
    ],
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

For child modules:

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

## Resolving the url from a service

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

## Custom adapters

Create a custom adapter by implementing `ISocket`:

```typescript
import { io, Socket, ManagerOptions, SocketOptions } from 'socket.io-client';
import { ISocket } from '@addapptables/ng-web-socket';
import { Injectable } from '@angular/core';

@Injectable()
// implements ISocket
export class SocketIoAdapter implements ISocket<Socket, Partial<ManagerOptions & SocketOptions>> {

    // connect to ws transport
    connect(url: string, options?: Partial<ManagerOptions & SocketOptions>): Promise<Socket> {
        return new Promise<Socket>((resolve, reject) => {
            try {
                // In socket.io-client v4 `io()` connects automatically.
                const connection = io(url, options);
                resolve(connection);
            } catch (error) {
                reject(error instanceof Error ? error.message : error);
            }
        });
    }

    // bind events with current connection
    bindEvent(connection: Socket, event: string, callFunction: (...args: any[]) => void): void {
        connection.on(event, callFunction);
    }

    // disconnect current connection
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
```

## API reference

### Standalone providers

| Function | Description |
| --- | --- |
| `provideWebSocket(adapter, gateways)` | Registers the socket adapter and root gateways. Use it in `bootstrapApplication` / `ApplicationConfig`. |
| `provideWebSocketFeature(gateways)` | Registers feature gateways for a lazy / route scope. |

### NgModule

| Method | Description |
| --- | --- |
| `NgWebSocketModule.forRoot(adapter, gateways)` | Root module configuration. |
| `NgWebSocketModule.forFeature(gateways)` | Feature module configuration. |

### Decorators

| Decorator | Description |
| --- | --- |
| `@WebSocketGateway(options)` | Marks a class as a websocket gateway (`url`, `autoConnect`, `options`). |
| `@WebSocketServer()` | Injects the live connection into the decorated property. |
| `@Subscribe(event)` | Binds a method to an incoming socket event. |
