import '@mantine/core/styles.css';

import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import {QueryClientProvider} from '@tanstack/react-query';
import {MantineProvider} from '@mantine/core';
import {queryClient} from '@/shared/lib/query-client';
import {AuthInitializer} from './providers/AuthInitializer';
import App from './App';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <MantineProvider>
        <AuthInitializer>
          <App/>
        </AuthInitializer>
      </MantineProvider>
    </QueryClientProvider>
  </StrictMode>,
);
