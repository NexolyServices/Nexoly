import { createRouter, createWebHistory } from 'vue-router'
import Home from '../pages/Home.vue'
import Login from '../pages/Login.vue'
import Register from '../pages/Register.vue'
import Dashboard from '../pages/Dashboard.vue'

const routes = [
  // --- Rutas Públicas ---
  { path: '/', name: 'Home', component: Home },
  { path: '/login', name: 'Login', component: Login },
  { path: '/register', name: 'Register', component: Register },
  { path: '/services', name: 'Services', component: () => import('../pages/Services.vue') },
  { path: '/services/:id', name: 'ServiceDetail', component: () => import('../pages/ServiceDetail.vue') },

  // --- Rutas de Usuario (Requieren Auth) ---
  { 
    path: '/complete-profile', 
    name: 'CompleteProfile', 
    component: () => import('../pages/CompleteProfile.vue'), 
    meta: { requiresAuth: true } 
  },
  { 
    path: '/profile', 
    name: 'Profile', 
    component: () => import('../pages/Profile.vue'), 
    meta: { requiresAuth: true } 
  },
  { 
    path: '/dashboard', 
    name: 'Dashboard', 
    component: Dashboard, 
    meta: { requiresAuth: true } 
  },
  { 
    path: '/chats', 
    name: 'ChatList', 
    component: () => import('../pages/ChatList.vue'), 
    meta: { requiresAuth: true } 
  },
  { 
    path: '/chats/:userId', 
    name: 'Chat', 
    component: () => import('../pages/Chat.vue'), 
    meta: { requiresAuth: true } 
  },
  { 
    path: '/cart', 
    name: 'Cart', 
    component: () => import('../pages/Cart.vue'), 
    meta: { requiresAuth: true } 
  },
  { 
    path: '/checkout/:id?', 
    name: 'Checkout', 
    component: () => import('../pages/Checkout.vue'), 
    props: true,
    meta: { requiresAuth: true } 
  },
  { 
    path: '/my-contracts', 
    name: 'MyContracts', 
    component: () => import('../pages/MyContracts.vue'), 
    meta: { requiresAuth: true } 
  },

  // --- Rutas de Proveedor (Requieren Auth + Rol Provider) ---
  { 
    path: '/services/create', 
    name: 'ServiceCreate', 
    component: () => import('../pages/CreateService.vue'), 
    meta: { requiresAuth: true, requiresProvider: true } 
  },
  { 
    path: '/services/edit/:id', 
    name: 'ServiceEdit', 
    component: () => import('../pages/EditService.vue'), 
    meta: { requiresAuth: true, requiresProvider: true } 
  },
  { 
    path: '/my-services', 
    name: 'MyServices', 
    component: () => import('../pages/MyServices.vue'), 
    meta: { requiresAuth: true, requiresProvider: true } 
  },
  { 
    path: '/seller/orders', 
    name: 'SellerOrders', 
    component: () => import('../pages/SellerOrders.vue'), 
    meta: { requiresAuth: true, requiresProvider: true } 
  },

  // --- Rutas de Administrador ---
  { 
    path: '/admin',
    name: 'AdminDashboard',
    component: () => import('../pages/admin/AdminDashboard.vue'),
    meta: { requiresAuth: true, requiresAdmin: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// --- Middleware / Guardián de Navegación ---
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  const userRaw = localStorage.getItem('user')
  
  let user = null
  try {
    user = userRaw ? JSON.parse(userRaw) : null
  } catch (e) {
    console.error("Error parsing user from localStorage", e)
  }

  // 1. Proteger rutas que requieren autenticación
  if (to.meta.requiresAuth && !token) {
    return next({ name: 'Login', query: { redirect: to.fullPath } })
  }

  // 2. 🚨 CONTROL DE FLUJO DE PERFIL (SOLUCIÓN DEFINITIVA)
  // Verificamos ciudad para asegurar que el perfil esté completo
  const hasCity = user?.city && String(user.city).trim() !== "";
  const isProfileIncomplete = token && user && !hasCity;

  // Redirigir a CompleteProfile SOLO si el perfil está incompleto Y la ruta destino es protegida
  if (
    isProfileIncomplete && 
    to.meta.requiresAuth && 
    to.name !== 'CompleteProfile'
  ) {
    console.warn("📍 [Router] Perfil incompleto. Redirigiendo a completar ubicación...");
    return next({ name: 'CompleteProfile' });
  }

  // Si ya tiene ciudad y está logueado, prohibido volver a CompleteProfile
  if (token && hasCity && to.name === 'CompleteProfile') {
    return next({ name: 'Dashboard' });
  }

  // 3. Verificación de Roles
  const userRole = user?.role_id || user?.role

  // Rol de Proveedor (ID 2)
  if (to.meta.requiresProvider) {
    const isProvider = String(userRole) === '2' || userRole === 'provider'
    if (!isProvider) return next({ name: 'Dashboard' })
  }

  // Rol de Administrador (ID 3)
  if (to.meta.requiresAdmin) {
    const isAdmin = String(userRole) === '3' || userRole === 'admin'
    if (!isAdmin) return next({ name: 'Dashboard' })
  }

  next()
})

export default router