<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-100">
    <div class="bg-white p-6 shadow rounded w-80">
      <h1 class="text-xl font-semibold mb-4">Login</h1>

      <input
        v-model="email"
        type="email"
        placeholder="Email"
        class="border rounded p-2 w-full mb-3"
      />

      <button
        @click="sendMagicLink"
        class="bg-blue-600 text-white w-full py-2 rounded hover:bg-blue-700"
      >
        Send Magic Link
      </button>
    </div>
  </div>
</template>


<script setup>
import { ref } from "vue"
import { supabase } from "../lib/supabaseClient"

const email = ref("")

const sendMagicLink = async () => {
  const { error } = await supabase.auth.signInWithOtp({
    email: email.value,
    options: { emailRedirectTo: window.location.origin }
  })
  if (error) alert(error.message)
  else alert("Check your email to sign in.")
}
</script>