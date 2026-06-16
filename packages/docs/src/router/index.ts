import { defineRouter } from '#q-app'
import {
  createMemoryHistory,
  createRouter,
  createWebHashHistory,
  createWebHistory,
} from 'vue-router'
import routes from './routes'

type RouterFactory = Parameters<typeof defineRouter>[0]
type AppRouter = Awaited<ReturnType<RouterFactory>>

const createAppRouter: RouterFactory = function () {
  const createHistory = import.meta.env.QUASAR_SERVER
    ? createMemoryHistory
    : import.meta.env.QUASAR_VUE_ROUTER_MODE === 'history'
      ? createWebHistory
      : createWebHashHistory

  const router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,
    history: createHistory(import.meta.env.QUASAR_VUE_ROUTER_BASE),
  })

  // Quasar's RouteCallback can resolve Router from a different peer instance.
  // Normalize to the wrapper's expected return type to avoid duplicate-type drift.
  return router as AppRouter
}

export default defineRouter(createAppRouter)
