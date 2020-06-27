
const routes = [
  {
    path: '/',
    redirect: '/docs'
  },
  {
    path: '/docs',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Index.vue') }
    ]
  },
  {
    path: '/examples',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Examples.vue') }
    ]
  },
  {
    path: '/demo',
    component: () => import('layouts/MediaPlayerLayout.vue'),
    children: [
      { path: '', component: () => import('pages/MediaPlayer.vue') }
    ]
  },
  {
    path: '/demoNCO',
    component: () => import('layouts/MediaPlayerLayout.vue'),
    children: [
      { path: '', component: () => import('pages/MediaPlayerNCO.vue') }
    ]
  }
]

// Always leave this as last one
if (process.env.MODE !== 'ssr') {
  routes.push({
    path: '*',
    component: () => import('pages/Error404.vue')
  })
}

export default routes
