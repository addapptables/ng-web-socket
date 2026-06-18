import { TestBed } from '@angular/core/testing';
import {
  NgWebSocketModule,
  ManagerSocketAdapter,
  ISocket,
  WebSocketGateway,
} from '@addapptables/ng-web-socket';

class NoopAdapter implements ISocket<any> {
  connect(url: string): Promise<any> {
    return Promise.resolve({ url });
  }
  bindEvent(): void {}
  disconnect(): Promise<void> {
    return Promise.resolve();
  }
}

@WebSocketGateway({ url: 'ws://noop', autoConnect: false })
class NoopGateway {}

describe('NgWebSocketModule', () => {
  it('forRoot returns ModuleWithProviders for the root module', () => {
    const result = NgWebSocketModule.forRoot(NoopAdapter, [NoopGateway]);
    expect(result.ngModule).toBeDefined();
    expect(Array.isArray(result.providers)).toBe(true);
    expect(result.providers!.length).toBeGreaterThan(0);
  });

  it('forFeature returns ModuleWithProviders for the feature module', () => {
    const result = NgWebSocketModule.forFeature([NoopGateway]);
    expect(result.ngModule).toBeDefined();
    expect(Array.isArray(result.providers)).toBe(true);
  });

  it('boots the root module and provides ManagerSocketAdapter', () => {
    TestBed.configureTestingModule({
      imports: [NgWebSocketModule.forRoot(NoopAdapter, [NoopGateway])],
    });
    const manager = TestBed.inject(ManagerSocketAdapter);
    expect(manager).toBeInstanceOf(ManagerSocketAdapter);
  });
});
