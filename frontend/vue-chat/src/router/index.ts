import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import { useAuthStore } from '@/stores/auth'
import type { Role } from '@/models/User'
import LoginView from '@/views/auth/LoginView.vue'
import RegisterView from '@/views/auth/RegisterView.vue'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import ProfileView from '@/views/ProfileView.vue'
import NewFriendsRequestView from '@/views/NewFriendsRequest.vue'
import MyFriendsRequestView from '@/views/MyFriendsRequest.vue'
import FriendsView from '@/views/FriendsView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/auth',
      children: [
        {
          path: 'login',
          name: 'login',
          component: LoginView,
        },
        {
          path: 'register',
          name: 'register',
          component: RegisterView,
        },
      ],
    },
    {
      path: '/',
      component: DefaultLayout,
      meta: { requiresAuth: true },
      children: [
        {
          path: '',
          redirect: '/home',
        },
        {
          path: 'home',
          name: 'home',
          component: HomeView,
        },
        {
          path: 'profile',
          name: 'profile',
          component: ProfileView,
        },
        {
          path: 'friends',
          name: 'friends',
          component: FriendsView,
        },
        {
          path: 'new-friends-request',
          name: 'new-friends-request',
          component: NewFriendsRequestView,
        },
        {
          path: 'my-friends-request',
          name: 'my-friends-request',
          component: MyFriendsRequestView,
        },
      ],
    },
  ],
})
// meta: { requiresAuth: true },
// meta: {
//   requiresAuth: true,
//   role: Role.ADMIN // Seuls les utilisateurs avec le rôle ADMIN peuvent y accéder
// }

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()

  const isAuthenticated = !!authStore.user && !!authStore.token
  const userRole = authStore.userRole

  if (to.meta.requiresAuth) {
    if (!isAuthenticated) {
      return next({ name: 'login' })
    }

    if (to.meta.role) {
      const requiredRole = to.meta.role as Role | Role[]
      const hasRequiredRole = Array.isArray(requiredRole)
        ? requiredRole.includes(userRole as Role)
        : userRole === requiredRole

      if (!hasRequiredRole) {
        console.warn(
          `User with role '${userRole}' tried to access role-restricted route '${String(to.name)}'. Required: '${requiredRole}'`,
        )
        return next({ name: 'home' })
      }
    }
    return next()
  }
  next()
})

export default router
