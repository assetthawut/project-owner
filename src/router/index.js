import { createRouter, createWebHistory } from 'vue-router'
import { supabase } from "../lib/supabaseClient"
import PublicLayout from '../layouts/PublicLayout.vue'
import AuthLayout from '../layouts/AuthLayout.vue'
import DashboardLayout from '../layouts/DashboardLayout.vue'

import HomePage from '../pages/HomePage.vue'
import LoginPage from '../pages/LoginPage.vue'
import DashboardPage from '../pages/DashboardPage.vue'
import ProjectsPage from '../pages/ProjectsPage.vue'
import ProjectInfoPage from '../pages/ProjectInfoPage.vue'
import ProjectFormPage from '../pages/ProjectFormPage.vue'
import TaskFormPage from '../pages/TaskFormPage.vue'
import TaskInfoPage from '../pages/TaskInfoPage.vue'
import KpiDefinitionPage from '../pages/KpiDefinitionPage.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: PublicLayout,
      children: [
        { path: '', name: 'home', component: HomePage }
      ]
    },
    {
      path: '/auth',
      component: AuthLayout,
      children: [
        { path: 'login', name: 'login', component: LoginPage }
      ]
    },
    {
      path: '/app',
      component: DashboardLayout,
      children: [
        { path: 'dashboard', name: 'dashboard', component: DashboardPage },
        { path: 'projects', name: 'projects', component: ProjectsPage },
        { path: 'project/:id/update', name: 'Update Project', component: ProjectFormPage },
        { path: 'project/create', name: 'Create Project', component: ProjectFormPage },
        { path: 'projects/:id', name: 'project-info', component: ProjectInfoPage },
        { path: '/app/project/:projectId/task/create', name: 'Create Task', component: TaskFormPage },
        { path: '/app/project/:projectId/task/:taskId/update', name: 'Update Task', component: TaskFormPage },
        { path: '/app/project/:projectId/task/:taskId', name: 'Task Info', component: TaskInfoPage },
      ]
    },
  {
    path: '/kpis',
    name: 'KpiDefinitions',
    component: KpiDefinitionPage,
    meta: {
      title: 'KPI Definitions'
    }
  },
  {
  path: '/projects/:projectId/kpis',
  name: 'ProjectKpis',
  component: () => import('@/pages/ProjectKpiPage.vue'),
  meta: { title: 'Project KPIs' }
},
{
  path: '/projects/:projectId/kpi-snapshots',
  name: 'ProjectKpiSnapshots',
  component: () => import('@/pages/ProjectKpiSnapshotPage.vue'),
  meta: { title: 'Project KPI Snapshots' }
},
{
  path: '/projects/:projectId/ai-plans',
  name: 'AiProjectPlans',
  component: () => import('@/pages/AiProjectPlanPage.vue'),
  meta: { title: 'AI Project Plans' }
}



  ]
})

router.beforeEach(async (to) => {
  const { data } = await supabase.auth.getSession()
  const isLoggedIn = !!data.session

  // ✅ Protected routes (must login)
  if (to.path.startsWith('/app') && !isLoggedIn) {
    return { path: '/auth/login' }
  }

  // ✅ If logged in, prevent going back to login page
  if (to.path.startsWith('/auth') && isLoggedIn) {
    return { path: '/app/dashboard' }
  }
})

export default router
