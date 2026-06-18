const startMock = jest.fn(() => Promise.resolve());
const stopMock = jest.fn(() => Promise.resolve());
const onMock = jest.fn();
const fakeConnection = { start: startMock, stop: stopMock, on: onMock };

const buildMock = jest.fn(() => fakeConnection);
const withUrlMock = jest.fn((..._args: any[]) => ({ build: buildMock }));

class HubConnectionBuilderMock {
  withUrl(...args: any[]) {
    return withUrlMock(...args);
  }
}

jest.mock('@microsoft/signalr', () => ({
  HubConnectionBuilder: HubConnectionBuilderMock,
}));

import { SignalRAdapter } from '@addapptables/ng-signal-r';

describe('SignalRAdapter', () => {
  let adapter: SignalRAdapter;

  beforeEach(() => {
    jest.clearAllMocks();
    adapter = new SignalRAdapter();
  });

  it('connect builds a hub connection, starts it and resolves', async () => {
    const opts = {} as any;
    const connection = await adapter.connect('http://localhost/hub', opts);

    expect(withUrlMock).toHaveBeenCalledWith('http://localhost/hub', opts);
    expect(buildMock).toHaveBeenCalledTimes(1);
    expect(startMock).toHaveBeenCalledTimes(1);
    expect(connection).toBe(fakeConnection);
  });

  it('bindEvent registers the callback on the connection', () => {
    const cb = jest.fn();
    adapter.bindEvent(fakeConnection as any, 'notify', cb);
    expect(onMock).toHaveBeenCalledWith('notify', cb);
  });

  it('disconnect stops the connection', async () => {
    await adapter.disconnect(fakeConnection as any);
    expect(stopMock).toHaveBeenCalledTimes(1);
  });
});
