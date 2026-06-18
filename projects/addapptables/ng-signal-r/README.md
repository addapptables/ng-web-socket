# ADDAPPTABLES ng-signal-r
ADDAPPTABLES ng-signal-r is a library for Angular,
this library is a **SignalR** adapter for @addapptables/ng-web-socket.

## Getting Started
To get started, let's install the package through npm:

Choose the version corresponding to your Angular version:

 Angular     | @addapptables/ng-signal-r
 ----------- | -------------------
 19          | 3.x
 8           | 2.x
 7           | 1.x

> **v3 note:** the deprecated `@aspnet/signalr` package has been replaced by
> `@microsoft/signalr`. The API is identical — only the import specifier and the
> installed package change.

```
npm i @addapptables/ng-signal-r @addapptables/ng-web-socket @microsoft/signalr --S
```

## How to use

### Create a websocket service

```typescript
import { HubConnection, HttpTransportType, LogLevel } from '@microsoft/signalr';
import { WebSocketGateway, WebSocketServer, Subscribe } from '@addapptables/ng-web-socket';

// gateway with params
@WebSocketGateway({
  url: 'http://localhost:22721/signalr-hub',
  autoConnect: true,
  options: {
    transport: HttpTransportType.WebSockets,
    skipNegotiation: true,
    logger: LogLevel.Information
  }
})
export class WebSocketService {

  // web socket connection
  @WebSocketServer()
  server: HubConnection;

  // subscribe event
  @Subscribe('news')
  connectedUsers(data: any) {
    console.log(data);
    this.server.send('my other event', { my: 'data' });
  }

  // send events
  sendMessage() {
    this.server.send('my other event', { my: 'data' });
  }
}
```

### Standalone API (Angular 19+) — recommended

```typescript
import { bootstrapApplication } from '@angular/platform-browser';
import { provideWebSocket } from '@addapptables/ng-web-socket';
import { SignalRAdapter } from '@addapptables/ng-signal-r';

bootstrapApplication(AppComponent, {
  providers: [
    provideWebSocket(SignalRAdapter, [WebSocketService, /* other socket services here */]),
    // Adapter is required, gateways array can be empty:
    // provideWebSocket(SignalRAdapter, []),
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
import { SignalRAdapter } from '@addapptables/ng-signal-r';
@NgModule({
  imports: [
    ...,
    NgWebSocketModule.forRoot(SignalRAdapter, [WebSocketService, /* other socket services here */]),
    /*
    Or
    NgWebSocketModule.forRoot(SignalRAdapter, [])
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
import { HubConnection, IHttpConnectionOptions, HttpTransportType, LogLevel } from '@microsoft/signalr';
import {
  WebSocketGateway,
  WebSocketServer,
  Subscribe,
  ISocketWithOptions,
  WebSocketOptions,
  ManagerSocketAdapter,
} from '@addapptables/ng-web-socket';

// gateway with params
@WebSocketGateway<IHttpConnectionOptions>({
  autoConnect: false,
  options: {
    transport: HttpTransportType.WebSockets,
    skipNegotiation: true,
    logger: LogLevel.Information
  }
})
export class WebSocketService implements ISocketWithOptions<IHttpConnectionOptions> {

  // web socket connection
  @WebSocketServer()
  server: HubConnection;

  constructor(
    @Inject(API_BASE_URL) private _baseUrl: string,
    private _managerSocketAdapter: ManagerSocketAdapter
  ) { }

  // build options for websocket
  withOptions(): WebSocketOptions<IHttpConnectionOptions> {
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
    this.server.send('my other event', { my: 'data' });
  }

  // send events
  sendMessage() {
    this.server.send('my other event', { my: 'data' });
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
