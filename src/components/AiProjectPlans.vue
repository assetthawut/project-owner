<script setup>
import { ref, onMounted, watch } from 'vue'
import { supabase } from '../lib/supabaseClient'

const props = defineProps({
  projectId: { type: String, required: true }
})

const plans = ref([])
const loading = ref(false)

const form = ref({
  id: null,
  plan_type: 'initial',
  assumptions: '{}',
  risks: '{}',
  expected_outcome: '{}',
  created_by: 'ai'
})

/* ---------- FETCH ---------- */
const fetchAll = async () => {
  loading.value = true
  const { data } = await supabase
    .from('ai_project_plans')
    .select('*')
    .eq('project_id', props.projectId)
    .order('created_at', { ascending: false })
  
  plans.value = data || []
  loading.value = false
}

/* ---------- SAVE ---------- */
const savePlan = async () => {
  try {
    const payload = {
      project_id: props.projectId,
      plan_type: form.value.plan_type,
      assumptions: JSON.parse(form.value.assumptions),
      risks: JSON.parse(form.value.risks),
      expected_outcome: JSON.parse(form.value.expected_outcome),
      created_by: form.value.created_by
    }

    if (form.value.id) {
      await supabase
        .from('ai_project_plans')
        .update(payload)
        .eq('id', form.value.id)
    } else {
      await supabase
        .from('ai_project_plans')
        .insert([payload])
    }

    resetForm()
    fetchAll()
  } catch (err) {
    alert('JSON ไม่ถูกต้อง! กรุณาตรวจสอบ format')
    console.error(err)
  }
}

/* ---------- EDIT ---------- */
const editPlan = (row) => {
  form.value = {
    id: row.id,
    plan_type: row.plan_type,
    assumptions: JSON.stringify(row.assumptions, null, 2),
    risks: JSON.stringify(row.risks, null, 2),
    expected_outcome: JSON.stringify(row.expected_outcome, null, 2),
    created_by: row.created_by
  }
}

/* ---------- DELETE ---------- */
const deletePlan = async (id) => {
  if (!confirm('ลบ AI Project Plan นี้?')) return

  await supabase
    .from('ai_project_plans')
    .delete()
    .eq('id', id)

  fetchAll()
}

const resetForm = () => {
  form.value = {
    id: null,
    plan_type: 'initial',
    assumptions: '{}',
    risks: '{}',
    expected_outcome: '{}',
    created_by: 'ai'
  }
}

onMounted(fetchAll)
watch(() => props.projectId, fetchAll)
</script>

<template>
  <!-- FORM -->
  <div class="bg-white p-4 rounded shadow mb-6">
    <h2 class="font-semibold mb-3">
      {{ form.id ? 'แก้ไข AI Project Plan' : 'เพิ่ม AI Project Plan' }}
    </h2>

    <div class="grid grid-cols-3 gap-4 mb-4">
      <!-- PLAN TYPE -->
      <select v-model="form.plan_type" class="input" title="ประเภทแผน: initial / revised / emergency">
        <option value="initial">Initial</option>
        <option value="revised">Revised</option>
        <option value="emergency">Emergency</option>
      </select>

      <!-- CREATED BY -->
      <select v-model="form.created_by" class="input" title="สร้างโดย AI หรือ Human">
        <option value="ai">AI</option>
        <option value="human">Human</option>
      </select>
    </div>

    <!-- JSON INPUTS -->
    <div class="grid grid-cols-3 gap-4">
      <textarea
        v-model="form.assumptions"
        placeholder="Assumptions (JSON)"
        class="input h-32"
        title="เงื่อนไขสมมติฐานของแผน (JSON)"
      ></textarea>

      <textarea
        v-model="form.risks"
        placeholder="Risks (JSON)"
        class="input h-32"
        title="ความเสี่ยงที่ระบุในแผน (JSON)"
      ></textarea>

      <textarea
        v-model="form.expected_outcome"
        placeholder="Expected Outcome (JSON)"
        class="input h-32"
        title="ผลลัพธ์ที่คาดว่าจะเกิดขึ้น (JSON)"
      ></textarea>
    </div>

    <div class="mt-4 flex gap-2">
      <button @click="savePlan" class="btn-primary">
        {{ form.id ? 'Update' : 'Add' }}
      </button>
      <button @click="resetForm" class="btn-secondary">Clear</button>
    </div>
  </div>

  <!-- LIST -->
  <table class="w-full border">
    <thead class="bg-gray-100">
      <tr>
        <th class="p-2 text-left">Plan Type</th>
        <th class="p-2 text-left">Created By</th>
        <th class="p-2 text-left">Created At</th>
        <th class="p-2"></th>
      </tr>
    </thead>

    <tbody>
      <tr
        v-for="row in plans"
        :key="row.id"
        class="border-t"
      >
        <td class="p-2">{{ row.plan_type }}</td>
        <td class="p-2">{{ row.created_by }}</td>
        <td class="p-2">{{ new Date(row.created_at).toLocaleString() }}</td>
        <td class="p-2 flex gap-2">
          <button class="text-blue-600" @click="editPlan(row)">Edit</button>
          <button class="text-red-600" @click="deletePlan(row.id)">Remove</button>
        </td>
      </tr>

      <tr v-if="!plans.length">
        <td colspan="4" class="p-4 text-center text-gray-400">
          ยังไม่มี AI Project Plan สำหรับโปรเจกต์นี้
        </td>
      </tr>
    </tbody>
  </table>
</template>
