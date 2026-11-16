import { useEffect } from 'react';
import { notifications } from '@mantine/notifications';

const STORAGE_KEY = 'poster-notice-shown';

export function PosterNotice() {
  useEffect(() => {
    const shown = sessionStorage.getItem(STORAGE_KEY);
    if (shown) return;

    notifications.show({
      id: 'poster-notice',
      title: 'Постеры могут не загружаться',
      message:
        'Из-за региональных ограничений для отображения постеров может потребоваться VPN.',
      color: 'yellow',
      autoClose: false,
      withCloseButton: true,
    });

    sessionStorage.setItem(STORAGE_KEY, '1');
  }, []);

  return null;
}
