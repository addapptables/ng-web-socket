const onMock = jest.fn();
const disconnectMock = jest.fn();
const fakeSocket = { on: onMock, disconnect: disconnectMock };
const ioMock = jest.fn((..._args: any[]) => fakeSocket);

jest.mock('socket.io-client', () => ({
  io: (...args: any[]) => ioMock(...args),
}));

import { SocketIoAdapter } from '@addapptables/ng-socket-io';

describe('SocketIoAdapter', () => {
  let adapter: SocketIoAdapter;

  beforeEach(() => {
    jest.clearAllMocks();
    adapter = new SocketIoAdapter();
  });

  it('connect calls io() with url + options and resolves the socket', async () => {
    const opts = { transports: ['websocket'] };
    const connection = await adapter.connect('http://localhost:3000', opts);

    expect(ioMock).toHaveBeenCalledWith('http://localhost:3000', opts);
    expect(connection).toBe(fakeSocket);
  });

  it('bindEvent registers the callback on the connection', () => {
    const cb = jest.fn();
    adapter.bindEvent(fakeSocket as any, 'message', cb);
    expect(onMock).toHaveBeenCalledWith('message', cb);
  });

  it('disconnect calls disconnect() and resolves', async () => {
    await expect(adapter.disconnect(fakeSocket as any)).resolves.toBeUndefined();
    expect(disconnectMock).toHaveBeenCalledTimes(1);
  });
});
