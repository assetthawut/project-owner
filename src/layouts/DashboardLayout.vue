<!-- src/layouts/DashboardLayout.vue -->
<template>
  <div class="flex min-h-screen bg-gray-100">

    <!-- Sidebar -->
    <aside :class="[
      'bg-white shadow-lg h-screen p-4 transition-transform duration-300 fixed z-50 overflow-hidden w-60',
      sidebarOpen ? 'translate-x-0' : '-translate-x-60',
      'md:static md:translate-x-0'
    ]">
      <div class="flex items-center gap-3 mb-6">
        <img src="https://i.pravatar.cc/40" class="w-9 h-9 rounded-lg shadow-sm" />
        Project Owner
      </div>

      <nav class="space-y-2">
        <RouterLink to="/app/dashboard" class="block p-2 rounded hover:bg-gray-100">Dashboard</RouterLink>
        <RouterLink to="/app/projects" class="block p-2 rounded hover:bg-gray-100">Projects</RouterLink>
      </nav>
    </aside>

    <div v-if="sidebarOpen" class="fixed inset-0 bg-black bg-opacity-40 z-40 md:hidden" @click="sidebarOpen = false">
    </div>

    <div class="flex-1 flex flex-col">
      <header class="flex items-center justify-between bg-white shadow px-4 h-14">
        <button @click="sidebarOpen = !sidebarOpen" class="p-2 md:hidden">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <div class="text-lg font-medium">{{ currentPageTitle }}</div>

        <div class="relative" @click="toggleUserMenu">
          <img src="https://i.pravatar.cc/40" class="w-8 h-8 rounded-full cursor-pointer" />
          <div v-if="userMenu" class="absolute right-0 mt-2 w-40 bg-white shadow rounded p-2">
            <a class="block px-2 py-1 hover:bg-gray-100">Profile</a>
            <a class="block px-2 py-1 hover:bg-gray-100">Settings</a>
            <a @click="logout" class="block px-2 py-1 hover:bg-gray-100 text-red-600">Logout</a>
          </div>
        </div>
      </header>

      <main class="p-4">
        <RouterView />
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { supabase } from '../lib/supabaseClient'
import { useRouter } from 'vue-router'

const router = useRouter()

const sidebarOpen = ref(false)
const userMenu = ref(false)
const toggleUserMenu = () => (userMenu.value = !userMenu.value)

const route = useRoute()
const currentPageTitle = computed(() => route?.meta?.title ?? 'Dashboard')


const logout = async () => {
  console.log("login....")
  await supabase.auth.signOut()
  router.push('/auth/login')
}


</script>
