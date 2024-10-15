import { useAuth } from '@/services/firebase/auth'
import { createRouter, createWebHistory } from 'vue-router'

const { isUserSignedIn } = useAuth()

const routes = [
  {
    meta: {
      title: 'Projects',
      requiresAuth: true
    },
    path: '/',
    name: '/',
    component: () => import('@/views/ProjectsView.vue')
  },
  {
    meta: {
      title: 'Projects',
      requiresAuth: true
    },
    path: '/projects',
    name: 'projects',
    component: () => import('@/views/ProjectsView.vue')
  },
  {
    meta: {
      title: 'Project',
      requiresAuth: true
    },
    path: '/projects/:id',
    name: 'project',
    component: () => import('@/views/ProjectView.vue')
  },
  {
    meta: {
      title: 'Login'
    },
    path: '/login',
    name: 'login',
    component: () => import('@/views/LoginView.vue')
  },
  {
    meta: {
      title: 'Error'
    },
    path: `/:pathMatch(.*)`,
    name: 'error',
    component: () => import('@/views/ErrorView.vue')
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  strict: true,
  scrollBehavior(to, from, savedPosition) {
    return savedPosition || { top: 0 }
  }
})

router.beforeEach(async (to) => {
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth)

  try {
    const signedIn = await isUserSignedIn()

    if (signedIn) {
      if (to.name === 'login') {
        if (to.query?.from) {
          return to.query.from
        }
        return { name: 'projects' }
      } else if (to.path === '/') {
        return { name: 'projects' }
      }
    } else {
      if (requiresAuth) {
        const loginPath = window.location.pathname

        return { name: 'login', query: { from: loginPath } }
      }
    }
  } catch (error) {
    return '/error'
  }
})

export default router
