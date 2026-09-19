<template>
  <div>
    <h1 class="text-2xl font-bold mb-4">Dashboard</h1>

    <div v-if="user" class="bg-white p-4 rounded shadow space-y-2">
      <p><strong>User ID:</strong> {{ user.id }}</p>
      <p><strong>Email:</strong> {{ user.email }}</p>

      <div v-if="user.user_metadata && user.user_metadata.full_name">
        <p><strong>Name:</strong> {{ user.user_metadata.full_name }}</p>
      </div>
    </div>

    <div v-else class="text-gray-500">
      Loading user info...
    </div>
  </div>

</template>

<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from '../lib/supabaseClient'
import { useRouter } from 'vue-router'

const router = useRouter()

const user = ref(null)

onMounted(async () => {
  const { data } = await supabase.auth.getUser()
  user.value = data?.user
})

</script>
