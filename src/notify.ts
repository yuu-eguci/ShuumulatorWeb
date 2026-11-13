import { reactive } from 'vue';

export type NotificationType = 'info' | 'success' | 'error';

export interface Notification {
  id: number;
  type: NotificationType;
  // i18n のキーです。
  key: string;
  timer: ReturnType<typeof setTimeout> | undefined;
}

const MAX_OPEN = 3;
const HIDE_DELAY_MS = 3000;
let nextId = 1;

// 画面右上に出す通知です。文言は i18n のキーで持ち、表示時に翻訳します。
export const notifications = reactive<Notification[]>([]);

export function notify(type: NotificationType, key: string) {
  const id = nextId++;
  const timer = type === 'error' ? undefined : setTimeout(() => dismiss(id), HIDE_DELAY_MS);
  notifications.push({ id, type, key, timer });
  while (notifications.length > MAX_OPEN) {
    dismiss(notifications[0].id);
  }
}

export function dismiss(id: number) {
  const index = notifications.findIndex((n) => n.id === id);
  if (index === -1) {
    return;
  }
  clearTimeout(notifications[index].timer);
  notifications.splice(index, 1);
}

export function clearNotifications() {
  [...notifications].forEach((n) => dismiss(n.id));
}
