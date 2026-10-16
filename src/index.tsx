import { ConfirmDeleteDialog } from 'core/components/confirm-delete-component'
import { init } from 'core/init'
import { queryClient, QueryClientProvider, ReactQueryDevtools } from 'core/react-query'
import { addInterceptors } from 'core/request'
import { initRouter } from 'core/routing'
import { routeToReactElement } from 'core/routing/render-route'
import { Router } from 'core/routing/route-utils'
import { ToastManager } from 'core/toast-manager-component'
import { SmallScreenWarning } from 'ui/notify/small-screen-warning'
import 'ui/styles.css'
import { onError, onRequest, onResponse } from './shared/interceptors'
import { routeObjects } from './shared/routes'

addInterceptors({ onRequest, onResponse, onError })
initRouter(routeObjects)

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router renderRoute={routeToReactElement} />
      <ToastManager />
      {}
      {import.meta.env.DEV && ReactQueryDevtools && <ReactQueryDevtools initialIsOpen={true} client={queryClient} />}
      <ConfirmDeleteDialog />
      <SmallScreenWarning />
    </QueryClientProvider>
  )
}

init(<App />)
