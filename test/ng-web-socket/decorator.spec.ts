import {
  WebSocketGateway,
  WebSocketServer,
  Subscribe,
} from '@addapptables/ng-web-socket';
import { getMetadata } from '../../projects/addapptables/ng-web-socket/src/lib/decorators/socket.decorator';

describe('socket decorators', () => {
  it('WebSocketGateway stores options metadata on the class', () => {
    @WebSocketGateway({ url: 'http://localhost:3000', autoConnect: true })
    class TestGateway {}

    const metadata = getMetadata(TestGateway);
    expect(metadata).toBeDefined();
    expect(metadata.url).toBe('http://localhost:3000');
    expect(metadata.autoConnect).toBe(true);
  });

  it('WebSocketGateway defaults to empty options', () => {
    @WebSocketGateway()
    class EmptyGateway {}

    const metadata = getMetadata(EmptyGateway);
    expect(metadata).toEqual({});
  });

  it('Subscribe registers an event with its handler name', () => {
    class WithEvents {
      @Subscribe('message')
      onMessage() {}
    }

    const metadata = getMetadata(WithEvents.prototype);
    expect(metadata.events).toEqual([
      { name: 'message', function: 'onMessage' },
    ]);
  });

  it('Subscribe accumulates multiple events', () => {
    class WithEvents {
      @Subscribe('a')
      onA() {}

      @Subscribe('b')
      onB() {}
    }

    const metadata = getMetadata(WithEvents.prototype);
    const names = metadata.events.map((e: { name: string }) => e.name).sort();
    expect(names).toEqual(['a', 'b']);
  });

  it('WebSocketServer records the connection property name', () => {
    class WithServer {
      @WebSocketServer()
      server: unknown;
    }

    const metadata = getMetadata(WithServer.prototype);
    expect(metadata.connection).toBe('server');
  });
});
