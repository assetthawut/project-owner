<template>
  <div class="p-6 max-w-5xl mx-auto">
    <h1 class="text-2xl font-bold mb-4">
      KPI Snapshots
    </h1>

    <ProjectKpiSnapshots :projectId="projectId" />
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router'
import ProjectKpiSnapshots from '@/components/ProjectKpiSnapshots.vue'

const route = useRoute()
const projectId = route.params.projectId
</script>
