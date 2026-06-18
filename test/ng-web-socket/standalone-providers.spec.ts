import { ApplicationInitStatus } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import {
  provideWebSocket,
  provideWebSocketFeature,
  ManagerSocketAdapter,
  ISocket,
  WebSocketGateway,
  WebSocketServer,
  Subscribe,
} from '@addapptables/ng-web-socket';

class MockAdapter implements ISocket<any> {
  static connectMock = jest.fn((url: string) => Promise.resolve({ id: url }));
  static bindEventMock = jest.fn();
  static disconnectMock = jest.fn((_c: any) => Promise.resolve());

  connect(url: string, _options?: any): Promise<any> {
    return MockAdapter.connectMock(url);
  }
  bindEvent(connection: any, event: string, cb: (...args: any[]) => void): void {
    MockAdapter.bindEventMock(connection, event, cb);
  }
  disconnect(connection: any): Promise<void> {
    return MockAdapter.disconnectMock(connection);
  }
}

describe('standalone providers', () => {
  beforeEach(() => {
    MockAdapter.connectMock.mockClear();
    MockAdapter.bindEventMock.mockClear();
    MockAdapter.disconnectMock.mockClear();
  });

  afterEach(() => TestBed.resetTestingModule());

  it('provideWebSocket wires root gateways through ManagerSocketAdapter', async () => {
    @WebSocketGateway({ url: 'ws://root', autoConnect: true })
    class RootGateway {
      @WebSocketServer()
      server: any;

      @Subscribe('hello')
      onHello() {}
    }

    TestBed.configureTestingModule({
      providers: [provideWebSocket(MockAdapter, [RootGateway])],
    });

    // Run app initializers (provideAppInitializer).
    await TestBed.inject(ApplicationInitStatus).donePromise;

    expect(MockAdapter.connectMock).toHaveBeenCalledWith('ws://root');
  });

  it('provideWebSocket exposes ManagerSocketAdapter in the injector', () => {
    @WebSocketGateway({ url: 'ws://x', autoConnect: false })
    class G {}

    TestBed.configureTestingModule({
      providers: [provideWebSocket(MockAdapter, [G])],
    });

    expect(TestBed.inject(ManagerSocketAdapter)).toBeInstanceOf(
      ManagerSocketAdapter
    );
  });

  it('provideWebSocketFeature connects only its own auto-connect gateways', async () => {
    @WebSocketGateway({ url: 'ws://root', autoConnect: false })
    class RootGateway {}

    @WebSocketGateway({ url: 'ws://feature', autoConnect: true })
    class FeatureGateway {}

    TestBed.configureTestingModule({
      providers: [
        provideWebSocket(MockAdapter, [RootGateway]),
        provideWebSocketFeature([FeatureGateway]),
      ],
    });

    await TestBed.inject(ApplicationInitStatus).donePromise;

    expect(MockAdapter.connectMock).toHaveBeenCalledTimes(1);
    expect(MockAdapter.connectMock).toHaveBeenCalledWith('ws://feature');
  });
});
