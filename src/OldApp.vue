<template>
  <div class="flex min-h-screen bg-gray-100">

    <!-- Sidebar -->
    <aside :class="[
      'bg-white shadow-lg h-screen p-4 transition-transform duration-300 fixed z-50 overflow-hidden w-60',
      sidebarOpen ? 'translate-x-0' : '-translate-x-60',
      'md:static md:translate-x-0'
    ]">
      <!-- Logo -->
      <div class="flex items-center gap-3 mb-6">
        <img src="https://i.pravatar.cc/40" class="w-9 h-9 rounded-lg shadow-sm" />
        Project Owner
      </div>

      <nav class="space-y-2">
        <RouterLink to="/dashboard" class="block p-2 rounded hover:bg-gray-100">Dashboard</RouterLink>
        <RouterLink to="/projects" class="block p-2 rounded hover:bg-gray-100">Projects</RouterLink>
        <!-- <RouterLink to="/tasks" class="block p-2 rounded hover:bg-gray-100">Tasks</RouterLink> -->
        <!-- <RouterLink to="/team" class="block p-2 rounded hover:bg-gray-100">Team</RouterLink> -->
      </nav>
    </aside>

    <!-- Mobile Overlay -->
    <div v-if="sidebarOpen" class="fixed inset-0 bg-black bg-opacity-40 z-40 md:hidden" @click="sidebarOpen = false">
    </div>

    <!-- Main -->
    <div class="flex-1 flex flex-col">

      <!-- Topbar -->
      <header class="flex items-center justify-between bg-white shadow px-4 h-14">
        <button @click="sidebarOpen = !sidebarOpen" class="p-2 md:hidden">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <div class="text-lg font-medium">
          {{ currentPageTitle }}
        </div>

        <div class="relative" @click="toggleUserMenu">
          <img src="https://i.pravatar.cc/40" class="w-8 h-8 rounded-full cursor-pointer" />
          <div v-if="userMenu" class="absolute right-0 mt-2 w-40 bg-white shadow rounded p-2">
            <a class="block px-2 py-1 hover:bg-gray-100">Profile</a>
            <a class="block px-2 py-1 hover:bg-gray-100">Settings</a>
            <a class="block px-2 py-1 hover:bg-gray-100 text-red-600">Logout</a>
          </div>
        </div>
      </header>

      <!-- Page Content -->
      <main class="p-4">
        <RouterView />
      </main>

    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'

// Sidebar and user menu
const sidebarOpen = ref(false)
const userMenu = ref(false)
const toggleUserMenu = () => (userMenu.value = !userMenu.value)

// Get current route
const route = useRoute() // make sure router is installed and used in main.js

// Computed page title safely
const currentPageTitle = computed(() => {
  // route might exist, route.meta might not exist
  return route?.meta?.title ?? 'Dashboard'
})
</script>
