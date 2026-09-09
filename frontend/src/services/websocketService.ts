export type EventHandler = (event: any) => void;

class WebSocketClient {
  private ws: WebSocket | null = null;
  private url: string = 'ws://localhost:8000/ws/events';
  private listeners: Map<string, Set<EventHandler>> = new Map();
  private reconnectInterval: number = 4000;
  private isConnected: boolean = false;

  constructor() {
    this.connect();
  }

  public connect() {
    try {
      this.ws = new WebSocket(this.url);

      this.ws.onopen = () => {
        this.isConnected = true;
        console.log('[MineMind WebSocket] Connected to real-time event stream');
      };

      this.ws.onmessage = (event) => {
        try {
          const parsed = JSON.parse(event.data);
          this.dispatchEvent(parsed.topic || '*', parsed);
        } catch {
          // Ignore non-json frames
        }
      };

      this.ws.onclose = () => {
        this.isConnected = false;
        setTimeout(() => this.connect(), this.reconnectInterval);
      };

      this.ws.onerror = () => {
        this.ws?.close();
      };
    } catch {
      // Offline fallback
    }
  }

  public subscribe(topic: string, handler: EventHandler) {
    if (!this.listeners.has(topic)) {
      this.listeners.set(topic, new Set());
    }
    this.listeners.get(topic)!.add(handler);
  }

  public unsubscribe(topic: string, handler: EventHandler) {
    if (this.listeners.has(topic)) {
      this.listeners.get(topic)!.delete(handler);
    }
  }

  private dispatchEvent(topic: string, data: any) {
    const topicHandlers = this.listeners.get(topic);
    if (topicHandlers) {
      topicHandlers.forEach(h => h(data));
    }
    const wildcardHandlers = this.listeners.get('*');
    if (wildcardHandlers) {
      wildcardHandlers.forEach(h => h(data));
    }
  }

  public getStatus(): boolean {
    return this.isConnected;
  }
}

export const websocketService = new WebSocketClient();
