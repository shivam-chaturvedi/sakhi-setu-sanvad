export interface GeminiErrorPayload {
  message: string;
  detail?: string;
  action?: string;
  timestamp: number;
}

const GEMINI_ERROR_EVENT = 'gemini-error';

class GeminiErrorBus extends EventTarget {
  emit(payload: GeminiErrorPayload) {
    const event = new CustomEvent<GeminiErrorPayload>(GEMINI_ERROR_EVENT, {
      detail: payload,
    });
    this.dispatchEvent(event);
  }

  subscribe(handler: (payload: GeminiErrorPayload) => void) {
    const listener = (event: Event) => {
      const customEvent = event as CustomEvent<GeminiErrorPayload>;
      handler(customEvent.detail);
    };
    this.addEventListener(GEMINI_ERROR_EVENT, listener);
    return () => this.removeEventListener(GEMINI_ERROR_EVENT, listener);
  }
}

export const geminiErrorBus = new GeminiErrorBus();

export const emitGeminiError = (payload: Omit<GeminiErrorPayload, 'timestamp'>) => {
  geminiErrorBus.emit({
    ...payload,
    timestamp: Date.now(),
  });
};
