<template>
  <div class="p-6 max-w-5xl mx-auto">
    <h1 class="text-2xl font-bold mb-4">
      AI Project Plans
    </h1>

    <AiProjectPlans :projectId="projectId" />
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router'
import AiProjectPlans from '@/components/AiProjectPlans.vue'

const route = useRoute()
const projectId = route.params.projectId
</script>
