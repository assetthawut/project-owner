<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { supabase } from '../lib/supabaseClient'

const route = useRoute()
const router = useRouter()

const projectId = route.params.id // will be undefined in create mode
console.log('projectId', projectId)
const isEdit = !!projectId

const form = ref({
  name: '',
  description: '',
  start_date: '',
  end_date: '',
  due_date: '',
  total_budget: '',
  objective: '',
  status: '',
  status_id: '',
  estimated_value: ''
})

const loading = ref(false)

// Load existing project when editing
async function loadProject() {
  if (!isEdit) return
  console.log("projectId -->", projectId)
  loading.value = true
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('id', projectId)
    .single()
  console.log("data", data)
  loading.value = false

  if (error) {
    console.error(error)
    return
  }
  
  data.start_date = data.start_date.split('T')[0]
  data.end_date = data.end_date.split('T')[0]
  data.due_date = data.due_date.split('T')[0]
  
  form.value = data
}

// Save new or update existing project
async function saveProject() {
  loading.value = true

  const { data: user } = await supabase.auth.getUser()

  if (isEdit) {
    // UPDATE
    const { error } = await supabase
      .from('projects')
      .update({
        name: form.value.name,
        description: form.value.description,
        start_date: form.value.start_date,
        end_date: form.value.end_date,
        due_date: form.value.due_date,
        total_budget: form.value.total_budget,
        estimated_value: form.value.estimated_value,
        objective: form.value.objective,
        status_id: form.value.status_id
      })
      .eq('id', projectId)

    loading.value = false
    if (!error) router.push('/app/projects')

  } else {
    // CREATE
    const { error } = await supabase
      .from('projects')
      .insert([
        {
          name: form.value.name,
          description: form.value.description,
          start_date: form.value.start_date,
          end_date: form.value.end_date,
          due_date: form.value.due_date,
          total_budget: form.value.budget,
          objective: form.value.objective,
          owner_id: user.user.id,
          status_id: form.value.status_id
        }
      ])

    loading.value = false
    if (!error) router.push('/app/projects')
  }
}

onMounted(loadProject)
</script>

<template>
  <div class="max-w-xl mx-auto p-6 bg-white shadow rounded">

    <h1 class="text-2xl font-bold mb-4">
      {{ isEdit ? "Update Project" : "Create Project" }}
    </h1>

    <form @submit.prevent="saveProject" class="space-y-4">

      <div>
        <label class="block text-gray-700 mb-1">Project Name</label>
        <input v-model="form.name" class="w-full border p-2 rounded" required />
      </div>

      <div>
        <label class="block text-gray-700 mb-1">Description</label>
        <textarea v-model="form.description" class="w-full border p-2 rounded"></textarea>
      </div>

      <div class="grid grid-cols-2 gap-3">
        <div>
          <label class="block text-gray-700 mb-1">Start Date</label>
          <input type="date" v-model="form.start_date" class="w-full border p-2 rounded">
        </div>
        <div>
          <label class="block text-gray-700 mb-1">End Date</label>
          <input type="date" v-model="form.end_date" class="w-full border p-2 rounded">
        </div>
      </div>

      <div>
        <label class="block text-gray-700 mb-1">Due Date</label>
        <input type="date" v-model="form.due_date" class="w-full border p-2 rounded">
      </div>

      <div>
        <label class="block text-gray-700 mb-1">Estimated value</label>
        <input type="number" v-model="form.estimated_value" class="w-full border p-2 rounded">
      </div>

      <div>
        <label class="block text-gray-700 mb-1">Objective</label>
        <textarea v-model="form.objective" class="w-full border p-2 rounded"></textarea>
      </div>
      <div>
        <label class="block text-gray-700 mb-1">Status</label>

        <select v-model="form.status_id" class="w-full border border-gray-300 rounded px-3 py-2
           focus:outline-none focus:ring-2 focus:ring-blue-400">
          <option disabled value="">Select status</option>

          <option :value="1">Planning</option>
          <option :value="2">In Progress</option>
          <option :value="3">On Hold</option>
          <option :value="6">Active</option>
          <option :value="4">Completed</option>
          <option :value="5">Cancelled</option>
        </select>
      </div>

      <button :disabled="loading"
        class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50">
        {{ isEdit ? "Update Project" : "Create Project" }}
      </button>
    </form>
  </div>
</template>
