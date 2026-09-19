<template>
  <div class="p-6 max-w-5xl mx-auto">
    <h1 class="text-2xl font-bold mb-4">
      Project KPI Settings
    </h1>

    <ProjectKpis :projectId="projectId" />
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router'
import ProjectKpis from '@/components/ProjectKpis.vue'

const route = useRoute()
const projectId = route.params.projectId
</script>
