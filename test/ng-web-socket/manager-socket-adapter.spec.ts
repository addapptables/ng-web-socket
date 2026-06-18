import { TestBed } from '@angular/core/testing';
import {
  ManagerSocketAdapter,
  ISocket,
  WebSocketGateway,
  WebSocketServer,
  Subscribe,
} from '@addapptables/ng-web-socket';
import { ROOT_ADAPTER } from '../../projects/addapptables/ng-web-socket/src/lib/tokens';

class MockAdapter implements ISocket<any> {
  connectMock = jest.fn((url: string) => Promise.resolve({ id: url }));
  bindEventMock = jest.fn();
  disconnectMock = jest.fn((_connection: any) => Promise.resolve());

  connect(url: string, _options?: any): Promise<any> {
    return this.connectMock(url);
  }
  bindEvent(connection: any, event: string, cb: (...args: any[]) => void): void {
    this.bindEventMock(connection, event, cb);
  }
  disconnect(connection: any): Promise<void> {
    return this.disconnectMock(connection);
  }
}

function buildManager(adapter: MockAdapter): ManagerSocketAdapter {
  TestBed.configureTestingModule({
    providers: [
      ManagerSocketAdapter,
      { provide: ROOT_ADAPTER, useValue: adapter },
    ],
  });
  return TestBed.inject(ManagerSocketAdapter);
}

describe('ManagerSocketAdapter', () => {
  afterEach(() => TestBed.resetTestingModule());

  it('connects and binds declared events for a gateway', async () => {
    @WebSocketGateway({ url: 'ws://test', autoConnect: false })
    class ChatGateway {
      @WebSocketServer()
      server: any;

      received: any[] = [];

      @Subscribe('message')
      onMessage(payload: any) {
        this.received.push(payload);
      }
    }

    const adapter = new MockAdapter();
    const manager = buildManager(adapter);
    const gateway = new ChatGateway();

    await manager.connect(gateway);

    expect(adapter.connectMock).toHaveBeenCalledWith('ws://test');
    // @WebSocketServer assigns the live connection onto the property
    expect(gateway.server).toEqual({ id: 'ws://test' });
    // event bound
    expect(adapter.bindEventMock).toHaveBeenCalledTimes(1);
    const [, eventName] = adapter.bindEventMock.mock.calls[0];
    expect(eventName).toBe('message');
  });

  it('auto-connects gateways flagged with autoConnect via addSockects', async () => {
    @WebSocketGateway({ url: 'ws://auto', autoConnect: true })
    class AutoGateway {}

    @WebSocketGateway({ url: 'ws://manual', autoConnect: false })
    class ManualGateway {}

    const adapter = new MockAdapter();
    const manager = buildManager(adapter);

    manager.addSockects([new AutoGateway(), new ManualGateway()]);
    await Promise.resolve();

    expect(adapter.connectMock).toHaveBeenCalledTimes(1);
    expect(adapter.connectMock).toHaveBeenCalledWith('ws://auto');
  });

  it('disconnects every open connection on destroy', async () => {
    @WebSocketGateway({ url: 'ws://a', autoConnect: false })
    class GatewayA {}

    const adapter = new MockAdapter();
    const manager = buildManager(adapter);

    await manager.connect(new GatewayA());
    manager.ngOnDestroy();

    expect(adapter.disconnectMock).toHaveBeenCalledTimes(1);
    expect(adapter.disconnectMock).toHaveBeenCalledWith({ id: 'ws://a' });
  });
});
