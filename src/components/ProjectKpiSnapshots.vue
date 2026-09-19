<script setup>
import { ref, onMounted, watch } from 'vue'
import { supabase } from '../lib/supabaseClient'

const props = defineProps({
  projectId: { type: String, required: true }
})

const snapshots = ref([])
const projectKpis = ref([])
const loading = ref(false)

const form = ref({
  id: null,
  project_kpi_id: '',
  value_number: '',
  note: ''
})

/* ---------- FETCH ---------- */
const fetchAll = async () => {
  loading.value = true

  // fetch project KPIs
  const { data: pkpis } = await supabase
    .from('project_kpis')
    .select('*')
    .eq('project_id', props.projectId)

  projectKpis.value = pkpis || []

  // fetch snapshots
  const { data: snaps } = await supabase
    .from('project_kpi_snapshots')
    .select(`
      *,
      kpi:project_kpis(*)
    `)
    .in('project_kpi_id', pkpis.map(p => p.id))
    .order('snapshot_date', { ascending: false })

  snapshots.value = snaps || []
  loading.value = false
}

/* ---------- SAVE ---------- */
const saveSnapshot = async () => {
  if (!form.value.project_kpi_id) return alert('กรุณาเลือก KPI')

  const payload = {
    project_kpi_id: form.value.project_kpi_id,
    value_number: Number(form.value.value_number),
    note: form.value.note
  }

  if (form.value.id) {
    await supabase
      .from('project_kpi_snapshots')
      .update(payload)
      .eq('id', form.value.id)
  } else {
    await supabase
      .from('project_kpi_snapshots')
      .insert([payload])
  }

  resetForm()
  fetchAll()
}

/* ---------- EDIT ---------- */
const editSnapshot = (row) => {
  form.value = {
    id: row.id,
    project_kpi_id: row.project_kpi_id,
    value_number: row.value_number,
    note: row.note
  }
}

/* ---------- DELETE ---------- */
const deleteSnapshot = async (id) => {
  if (!confirm('ลบ snapshot นี้?')) return

  await supabase
    .from('project_kpi_snapshots')
    .delete()
    .eq('id', id)

  fetchAll()
}

const resetForm = () => {
  form.value = {
    id: null,
    project_kpi_id: '',
    value: '',
    note: ''
  }
}

onMounted(fetchAll)
watch(() => props.projectId, fetchAll)
</script>

<template>
  <!-- FORM -->
  <div class="bg-white p-4 rounded shadow mb-6">
    <h2 class="font-semibold mb-3">
      {{ form.id ? 'แก้ไข Snapshot' : 'เพิ่ม KPI Snapshot' }}
    </h2>

    <div class="grid grid-cols-3 gap-4">
      <!-- KPI -->
      <select
        v-model="form.project_kpi_id"
        class="input"
        title="เลือก KPI ของโปรเจกต์ที่จะบันทึก snapshot"
      >
        <option value="" disabled>เลือก KPI</option>
        <option
          v-for="k in projectKpis"
          :key="k.id"
          :value="k.id"
        >
          {{ k.kpi_id }} <!-- หรือ show name ถ้ามี join -->
        </option>
      </select>

      <!-- VALUE -->
      <input
        v-model="form.value_number"
        type="number"
        placeholder="value_number"
        class="input"
        title="ค่าปัจจุบันของ KPI"
      />

      <!-- NOTE -->
      <input
        v-model="form.note"
        type="text"
        placeholder="หมายเหตุ"
        class="input"
        title="อธิบายสถานะ หรือเหตุผลของค่า KPI นี้"
      />
    </div>

    <div class="mt-4 flex gap-2">
      <button @click="saveSnapshot" class="btn-primary">
        {{ form.id ? 'Update' : 'Add' }}
      </button>
      <button @click="resetForm" class="btn-secondary">Clear</button>
    </div>
  </div>

  <!-- LIST -->
  <table class="w-full border">
    <thead class="bg-gray-100">
      <tr>
        <th class="p-2 text-left">KPI</th>
        <th class="p-2 text-left">Value</th>
        <th class="p-2 text-left">Note</th>
        <th class="p-2 text-left">Snapshot Date</th>
        <th class="p-2"></th>
      </tr>
    </thead>

    <tbody>
      <tr
        v-for="row in snapshots"
        :key="row.id"
        class="border-t"
      >
        <td class="p-2">{{ row.kpi.kpi_id }}</td>
        <td class="p-2">{{ row.value_number }}</td>
        <td class="p-2">{{ row.note }}</td>
        <td class="p-2">{{ new Date(row.snapshot_date).toLocaleString() }}</td>
        <td class="p-2 flex gap-2">
          <button
            class="text-blue-600"
            @click="editSnapshot(row)"
          >
            Edit
          </button>
          <button
            class="text-red-600"
            @click="deleteSnapshot(row.id)"
          >
            Remove
          </button>
        </td>
      </tr>

      <tr v-if="!snapshots.length">
        <td colspan="5" class="p-4 text-center text-gray-400">
          ยังไม่มี snapshot สำหรับโปรเจกต์นี้
        </td>
      </tr>
    </tbody>
  </table>
</template>
