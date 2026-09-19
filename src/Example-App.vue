<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from './lib/supabaseClient'

const instruments = ref([])
const loading = ref(true) // loading state
const error = ref(null)

async function getInstruments() {
  loading.value = true
  const { data, error: err } = await supabase.from('instruments').select()
  
  if (err) {
    console.error(err)
    error.value = err.message
    instruments.value = []
  } else {
    instruments.value = data
    error.value = null
  }
  
  loading.value = false
}

onMounted(() => {
  getInstruments()
})
</script>

<template>
  <div>
    <!-- Loading -->
    <div v-if="loading" class="text-center py-6 text-gray-500">
      Loading instruments...
    </div>

    <!-- Error -->
    <div v-if="error" class="text-red-600 py-4">
      Error: {{ error }}
    </div>

    <!-- Instruments List -->
    <ul v-if="!loading && !error">
      <li v-for="instrument in instruments" :key="instrument.id">
        {{ instrument.name }}
      </li>
    </ul>

    <!-- Empty State -->
    <div v-if="!loading && !error && instruments.length === 0" class="text-gray-500 py-4">
      No instruments found.
    </div>
  </div>
</template>
