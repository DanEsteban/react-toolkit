
import ReactDOM from 'react-dom/client'
import App from './App.tsx'

import  store  from './state/store.ts'
import { Provider } from 'react-redux'
import { CustomThemeProvider } from '@/components/core/theme-provider/theme-provider';
import { QueryClient, QueryClientProvider } from 'react-query'

const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root')!).render(
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
      <CustomThemeProvider>
        <App />
      </CustomThemeProvider>
      </Provider> 
    </QueryClientProvider>
)
