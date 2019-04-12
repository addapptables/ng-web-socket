# ADDAPPTABLES ng-signal-r
ADDAPPTABLES ng-signal-r is a library for angular,
this library is an adapter for @addapptables/ng-web-socket

## Getting Started
To get started, let's install the package through npm:

```
npm i @addapptables/ng-signal-r  @addapptables/ng-web-socket @aspnet/signalr --S
```

## How to use

Create a websocket service

```typescript
// gateway with params
@WebSocketGateway<IHttpConnectionOptions>({
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
import { SignalRAdapter } from '@addapptables/ng-signal-r';
@NgModule({
  imports: [
    ...,
    NgWebSocketModule.forRoot(SignalRAdapter, [WebSocketService,  /* other services socket here*/]),
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
    NgWebSocketModule.forFeature([WebSocketService, /* other services socket here*/])
  ]
})
export class AppModule { }
```

If you require a service to obtain the url, you can do the following

```typescript
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

  //build options for websocket
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
