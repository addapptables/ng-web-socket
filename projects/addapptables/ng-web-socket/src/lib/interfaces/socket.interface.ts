export interface ISocket<T, O = any> {
    connect(url: string, options?: O): Promise<T>;
    bindEvent(connection: T, event: string, callFunction: (...args: any[]) => void);
    disconnect(connection: T): Promise<void>;
}
