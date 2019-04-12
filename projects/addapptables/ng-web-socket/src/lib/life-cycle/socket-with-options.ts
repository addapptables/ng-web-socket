import { WebSocketOptions } from '../models/websocket-options.model';

export interface ISocketWithOptions<T = any> {
    withOptions(): WebSocketOptions<T>;
}
export const withOptions: keyof ISocketWithOptions = 'withOptions';
