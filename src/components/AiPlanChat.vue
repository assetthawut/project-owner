<script setup>
import { ref } from 'vue'
import axios from 'axios'

const projectId = 9

const messages = ref([])
const userInput = ref('')
const loading = ref(false)

const sendMessage = async () => {
  if (!userInput.value.trim()) return

  messages.value.push({ role: 'user', content: userInput.value })
  loading.value = true

  try {
    const { data } = await axios.post('/ai/generate-plan', {
      projectId,
      prompt: userInput.value
    })

    messages.value.push({ role: 'assistant', content: JSON.stringify(data.plan, null, 2) })
  } catch (err) {
    messages.value.push({ role: 'assistant', content: 'เกิดข้อผิดพลาด: ' + err.message })
  } finally {
    loading.value = false
    userInput.value = ''
  }
}
</script>

<template>
  <div class="p-4 border rounded max-w-3xl mx-auto">
    <div class="space-y-2 mb-4">
      <div
        v-for="(m, idx) in messages"
        :key="idx"
        :class="m.role === 'user' ? 'text-right' : 'text-left'"
      >
        <div class="inline-block p-2 rounded" :class="m.role === 'user' ? 'bg-blue-200' : 'bg-gray-200'">
          <pre class="whitespace-pre-wrap">{{ m.content }}</pre>
        </div>
      </div>
    </div>

    <div class="flex gap-2">
      <input
        v-model="userInput"
        class="input flex-1"
        placeholder="ถาม AI ให้สร้างแผนโปรเจกต์..."
        @keyup.enter="sendMessage"
      />
      <button class="btn-primary" @click="sendMessage" :disabled="loading">Send</button>
    </div>
  </div>
</template>

<!-- {
  "plan_type": "initial",
  "assumptions": {"market_growth": 0.1},
  "risks": {"supply_chain": "delays possible"},
  "expected_outcome": {"revenue": 100000, "profit_margin": 0.3}
} -->