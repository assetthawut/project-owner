<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from '../lib/supabaseClient'

const kpis = ref([])
const loading = ref(false)

const form = ref({
  id: null,
  code: '',
  name: '',
  category: 'delivery',
  value_type: 'number',
  description: '',
  is_hard_stop: false
})

/* ---------- READ ---------- */
const fetchKpis = async () => {
  loading.value = true
  const { data, error } = await supabase
    .from('kpi_definitions')
    .select('*')
    .order('created_at', { ascending: false })

  if (!error) kpis.value = data
  loading.value = false
}

/* ---------- CREATE / UPDATE ---------- */
const saveKpi = async () => {
  if (form.value.id) {
    await supabase
      .from('kpi_definitions')
      .update(form.value)
      .eq('id', form.value.id)
  } else {

    await supabase
      .from('kpi_definitions')
      .insert({
        code: form.value.code,
        category: form.value.category,
        value_type: form.value.value_type,
        name: form.value.name,
        description: form.value.description,
        is_hard_stop: form.value.is_hard_stop,

      })
  }

  resetForm()
  fetchKpis()
}

/* ---------- DELETE ---------- */
const deleteKpi = async (id) => {
  if (!confirm('Delete this KPI?')) return
  await supabase
    .from('kpi_definitions')
    .delete()
    .eq('id', id)

  fetchKpis()
}

/* ---------- EDIT ---------- */
const editKpi = (kpi) => {
  form.value = { ...kpi }
}

const resetForm = () => {
  form.value = {
    id: null,
    code: '',
    name: '',
    category: 'delivery',
    value_type: 'number',
    description: '',
    is_hard_stop: false
  }
}

onMounted(fetchKpis)
</script>

<template>
  <div class="max-w-5xl mx-auto p-6">
    <h1 class="text-2xl font-bold mb-4">KPI Definitions</h1>

    <!-- FORM -->
    <div class="bg-white p-4 rounded shadow mb-6">
      <div class="grid grid-cols-2 gap-4">
        <input v-model="form.code" placeholder="Code (e.g. revenue)" class="input" />
        <input v-model="form.name" placeholder="Name" class="input" />

        <select v-model="form.category" class="input">
          <option value="financial">Financial</option>
          <option value="delivery">Delivery</option>
          <option value="quality">Quality</option>
          <option value="growth">Growth</option>
        </select>

        <select v-model="form.value_type" class="input">
          <option value="number">Number</option>
          <option value="percent">Percent</option>
          <option value="date">Date</option>
          <option value="boolean">Boolean</option>
        </select>

        <textarea
          v-model="form.description"
          placeholder="Description"
          class="input col-span-2"
        />

        <label class="flex items-center gap-2">
          <input type="checkbox" v-model="form.is_hard_stop" />
          Hard Stop KPI (used to cancel project)
        </label>
      </div>

      <div class="mt-4 flex gap-2">
        <button @click="saveKpi" class="btn-primary">
          {{ form.id ? 'Update' : 'Create' }}
        </button>
        <button @click="resetForm" class="btn-secondary">Clear</button>
      </div>
    </div>

    <!-- LIST -->
    <table class="w-full border">
      <thead>
        <tr class="bg-gray-100 text-left">
          <th class="p-2">Code</th>
          <th class="p-2">Name</th>
          <th class="p-2">Category</th>
          <th class="p-2">Type</th>
          <th class="p-2">Hard Stop</th>
          <th class="p-2"></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="kpi in kpis" :key="kpi.id" class="border-t">
          <td class="p-2">{{ kpi.code }}</td>
          <td class="p-2">{{ kpi.name }}</td>
          <td class="p-2">{{ kpi.category }}</td>
          <td class="p-2">{{ kpi.value_type }}</td>
          <td class="p-2">
            <span v-if="kpi.is_hard_stop" class="text-red-600 font-bold">YES</span>
          </td>
          <td class="p-2 flex gap-2">
            <button @click="editKpi(kpi)" class="text-blue-600">Edit</button>
            <button @click="deleteKpi(kpi.id)" class="text-red-600">Delete</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
