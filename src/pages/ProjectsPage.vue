<template>
  <div class="p-6">

    <!-- Header -->
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">Projects</h1>

      <button @click="openProjectForm" class="bg-blue-600 hover:bg-blue-700 text-white
               font-semibold py-2 px-4 rounded-lg transition">
        + Create Project
      </button>
    </div>

    <!-- Tabs -->
    <div class="flex gap-2 overflow-x-auto mb-6 border-b pb-2">
      <button v-for="tab in statusTabs" :key="tab.key" @click="activeStatus = tab.key"
        class="px-4 py-2 rounded-full text-sm whitespace-nowrap transition" :class="activeStatus === tab.key
          ? 'bg-blue-600 text-white'
          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'">
        {{ tab.label }}
        <span class="ml-1 text-xs opacity-80">
          ({{ tab.count }})
        </span>
      </button>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="text-gray-500">
      Loading projects...
    </div>

    <!-- Empty -->
    <div v-else-if="filteredProjects.length === 0" class="text-center text-gray-400 py-12">
      No projects in this status
    </div>

    <!-- Project Grid -->
    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <RouterLink v-for="project in filteredProjects" :key="project.id" :to="`/app/projects/${project.id}`" class="bg-white p-5 rounded-xl border shadow-sm
         hover:shadow-lg transition block
         relative overflow-hidden">
        <!-- Profit Indicator Bar -->
        <div class="absolute top-0 left-0 w-full h-1" :class="{
          'bg-green-500': project.profit > 0,
          'bg-red-500': project.profit < 0,
          'bg-gray-300': project.profit === 0
        }" />

        <!-- Title -->
        <h3 class="font-semibold text-gray-800 mb-1">
          {{ project.name }}
        </h3>

        <p class="text-sm text-gray-500 line-clamp-2 mb-3">
          {{ project.description || 'No description' }}
        </p>



                <!-- Estimated Value (Motivation) -->
        <div v-if="project.estimated_value" class="mt-3 p-2 rounded-lg text-xs flex justify-between items-center"
          :class="project.estimated_value > project.total_expense
            ? 'bg-green-50 text-green-700'
            : 'bg-yellow-50 text-yellow-700'">
          <span>Estimated Value</span>
          <span class="font-semibold">
            {{ project.estimated_value }}
          </span>
        </div>

        <div
  class="mt-3 p-3 rounded-lg text-xs flex justify-between items-center border"
  :class="{
    'bg-green-50 text-green-700 border-green-200': project.profit > 0,
    'bg-red-50 text-red-700 border-red-200': project.profit < 0,
    'bg-gray-50 text-gray-700 border-gray-200': project.profit === 0
  }"
>

                <!-- Actual Value (Motivation) -->
  <span>Actual Value</span>
  <span class="font-semibold">
    {{ project.profit ?? 0 }}
  </span>
</div>

        <!-- Financial Summary -->
        <div class="space-y-1 text-sm">
          <div class="flex justify-between">
            <span class="text-gray-500">Revenue</span>
            <span class="text-green-600 font-medium">
              {{ project.total_revenue ?? 0 }}
            </span>
          </div>

          <div class="flex justify-between">
            <span class="text-gray-500">Expense</span>
            <span class="text-red-600 font-medium">
              {{ project.total_expense ?? 0 }}
            </span>
          </div>

          <div class="flex justify-between font-semibold">
            <span v-if="project.profit > 100000" class="ml-2 text-xs text-green-600">
              🔥 High Profit
            </span>
            <span v-else>Profit</span>
            <span :class="{
              'text-green-600': project.profit > 0,
              'text-red-600': project.profit < 0,
              'text-gray-700': project.profit === 0
            }">
              {{ project.profit ?? 0 }}
            </span>
          </div>
        </div>

        <!-- Footer -->
        <div class="flex justify-between items-center mt-4">
          <span class="text-xs text-gray-400">
            {{ project.project_status?.name }}
          </span>

          <span class="text-sm font-medium" :class="project.profit < 0
            ? 'text-red-600'
            : 'text-blue-600'">
            {{ project.profit < 0 ? 'Fix this →' : 'View →' }} </span>
            
        </div>
        
      </RouterLink>

    </div>

  </div>
</template>

<script setup>
import { ref, onMounted, computed,watch } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '../lib/supabaseClient'

const router = useRouter()
const projects = ref([])
const loading = ref(true)
const activeStatus = ref('all')



const openProjectForm = () => {
  router.push('/app/project/create')
}

async function loadProjects() {
  loading.value = true

  const { data: user } = await supabase.auth.getUser()
  if (!user?.user) return

  const { data, error } = await supabase
    .from('projects')
    .select(`
      *,
      status:project_status!projects_status_id_fkey (*),
      type:project_types!projects_types_id_fkey1 (*)
    `)
    .eq('owner_id', user.user.id)
    .is('deleted_at', null)
  console.log('data',data)
  console.log('error',error)
  if (!error) projects.value = data || []
  loading.value = false
}

// async function loadProjects() {
//   loading.value = true

//   // 🔥 simulate API delay
//   await new Promise(r => setTimeout(r, 800))

//   projects.value = generateMockProjects(1000)

//   loading.value = false
// }


onMounted(loadProjects)

/* ---------- COMPUTED ---------- */

const statusMap = [
  'Planning',
  'In Progress',
  'On Hold',
  'Active',
  'Completed',
  'Cancelled'
]

const statusTabs = computed(() => {
  const counts = { all: projects.value.length }

  statusMap.forEach(s => counts[s] = 0)

  projects.value.forEach(p => {
    const name = p.project_status?.name
    if (counts[name] !== undefined) counts[name]++
  })

  return [
    { key: 'all', label: 'All', count: counts.all },
    ...statusMap.map(s => ({
      key: s,
      label: s,
      count: counts[s]
    }))
  ]
})

watch(statusTabs, (tabs) => {
  if (tabs.length >= 3 && activeStatus.value === 'all') {
    activeStatus.value = tabs[2].key
  }
}, { immediate: true })

const filteredProjects = computed(() => {
  const list = activeStatus.value === 'all'
    ? projects.value
    : projects.value.filter(
      p => p.project_status?.name === activeStatus.value
    )

  return [...list].sort((a, b) => a.profit - b.profit)
})


function generateMockProjects(count = 1000) {
  const statuses = [
    { id: 1, name: 'Planning' },
    { id: 2, name: 'In Progress' },
    { id: 3, name: 'On Hold' },
    { id: 4, name: 'Completed' },
    { id: 5, name: 'Cancelled' }
  ]

  return Array.from({ length: count }, (_, i) => {
    const status = statuses[i % statuses.length]

    return {
      id: i + 1,
      name: `Project #${i + 1}`,
      description: `This is a description for project ${i + 1}`,
      owner_id: 'user-123',
      created_at: new Date(Date.now() - i * 1000000).toISOString(),
      project_status: {
        name: status.name
      }
    }
  })
}

</script>
