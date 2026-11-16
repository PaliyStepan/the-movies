import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';

import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import {QueryClientProvider} from '@tanstack/react-query';
import {MantineProvider} from '@mantine/core';
import {Notifications} from '@mantine/notifications';
import {queryClient} from '@/shared/lib/query-client';
import {ModalsProvider} from '@mantine/modals';
import {AuthInitializer} from './providers/AuthInitializer';
import App from './App';
import './index.css';
import {PosterNotice} from "@/app/providers/PosterNotice.tsx";

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <MantineProvider>
        <Notifications position="top-right"/>
        <ModalsProvider>
          <AuthInitializer>
            <PosterNotice />
            <App />
          </AuthInitializer>
        </ModalsProvider>
      </MantineProvider>
    </QueryClientProvider>
  </StrictMode>,
);
