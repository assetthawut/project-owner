<script setup>
import { ref, onMounted, watch } from 'vue'
import { supabase } from '../lib/supabaseClient'

/* ---------- PROPS ---------- */
const props = defineProps({
  projectId: { type: String, required: true }
})

/* ---------- STATE ---------- */
const projectKpis = ref([])
const kpiDefinitions = ref([])
const loading = ref(false)

const form = ref({
  id: null,
  kpi_id: '',
  target_value: '',
  weight: 1
})

/* ---------- FETCH ---------- */
const fetchAll = async () => {
  loading.value = true

  const { data: defs } = await supabase
    .from('kpi_definitions')
    .select('*')
    .order('name')

  const { data: pkpis } = await supabase
    .from('project_kpis')
    .select(`
      *,
      kpi:kpi_definitions(*)
    `)
    .eq('project_id', props.projectId)

  kpiDefinitions.value = defs || []
  projectKpis.value = pkpis || []

  loading.value = false
}

/* ---------- SAVE ---------- */
const saveProjectKpi = async () => {
  if (!form.value.kpi_id) return alert('กรุณาเลือก KPI')

  const payload = {
    project_id: props.projectId,
    kpi_id: form.value.kpi_id,
    target_value: Number(form.value.target_value),
    weight: Number(form.value.weight)
  }

  if (form.value.id) {
    await supabase
      .from('project_kpis')
      .update(payload)
      .eq('id', form.value.id)
  } else {
    await supabase
      .from('project_kpis')
      .insert([payload])
  }

  resetForm()
  fetchAll()
}

/* ---------- EDIT ---------- */
const editProjectKpi = (row) => {
  form.value = {
    id: row.id,
    kpi_id: row.kpi_id,
    target_value: row.target_value,
    weight: row.weight
  }
}

/* ---------- DELETE ---------- */
const deleteProjectKpi = async (id) => {
  if (!confirm('ลบ KPI นี้ออกจากโปรเจกต์ ?')) return

  await supabase
    .from('project_kpis')
    .delete()
    .eq('id', id)

  fetchAll()
}

/* ---------- RESET ---------- */
const resetForm = () => {
  form.value = {
    id: null,
    kpi_id: '',
    target_value: '',
    weight: 1
  }
}

onMounted(fetchAll)
watch(() => props.projectId, fetchAll)
</script>

<template>
  <!-- FORM -->
  <div class="bg-white p-4 rounded shadow mb-6">
    <h2 class="font-semibold mb-3">
      {{ form.id ? 'แก้ไข KPI ของโปรเจกต์' : 'เพิ่ม KPI ให้โปรเจกต์' }}
    </h2>

    <div class="grid grid-cols-3 gap-4">
      <!-- KPI -->
      <select
        v-model="form.kpi_id"
        class="input"
        title="เลือกตัวชี้วัด (KPI) ที่ใช้ประเมินความสำเร็จของโปรเจกต์นี้"
      >
        <option value="" disabled>เลือก KPI</option>
        <option
          v-for="k in kpiDefinitions"
          :key="k.id"
          :value="k.id"
        >
          {{ k.name }} ({{ k.category }})
        </option>
      </select>

      <!-- TARGET -->
      <input
        v-model="form.target_value"
        type="number"
        placeholder="Target"
        class="input"
        title="ค่าเป้าหมายของ KPI เช่น รายได้ 100000, ความคืบหน้า 80%, หรือจำนวนวัน"
      />

      <!-- WEIGHT -->
      <input
        v-model="form.weight"
        type="number"
        step="0.1"
        min="0"
        max="1"
        placeholder="Weight"
        class="input"
        title="น้ำหนักความสำคัญของ KPI (0–1) ใช้คำนวณคะแนนรวมและใช้โดย AI"
      />
    </div>

    <div class="mt-4 flex gap-2">
      <button
        @click="saveProjectKpi"
        class="btn-primary"
      >
        {{ form.id ? 'Update' : 'Add' }}
      </button>

      <button
        @click="resetForm"
        class="btn-secondary"
        title="ล้างฟอร์มและยกเลิกการแก้ไข"
      >
        Clear
      </button>
    </div>
  </div>

  <!-- LIST -->
  <table class="w-full border">
    <thead class="bg-gray-100">
      <tr>
        <th class="p-2 text-left">KPI</th>
        <th class="p-2 text-left">Category</th>
        <th class="p-2 text-left">Target</th>
        <th class="p-2 text-left">Weight</th>
        <th class="p-2"></th>
      </tr>
    </thead>

    <tbody>
      <tr
        v-for="row in projectKpis"
        :key="row.id"
        class="border-t"
      >
        <td class="p-2">
          {{ row.kpi.name }}
        </td>

        <td class="p-2">
          {{ row.kpi.category }}
        </td>

        <td class="p-2">
          {{ row.target_value }}
        </td>

        <td class="p-2">
          {{ row.weight }}
        </td>

        <td class="p-2 flex gap-2">
          <button
            class="text-blue-600"
            title="แก้ไข KPI นี้"
            @click="editProjectKpi(row)"
          >
            Edit
          </button>

          <button
            class="text-red-600"
            title="ลบ KPI นี้ออกจากโปรเจกต์"
            @click="deleteProjectKpi(row.id)"
          >
            Remove
          </button>
        </td>
      </tr>

      <tr v-if="!projectKpis.length">
        <td
          colspan="5"
          class="p-4 text-center text-gray-400"
        >
          ยังไม่มี KPI สำหรับโปรเจกต์นี้
        </td>
      </tr>
    </tbody>
  </table>
</template>

<!-- http://localhost:5173/projects/9/kpis -->