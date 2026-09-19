<template>
  <div class="flex items-center gap-1">
    <span>{{ label }}</span>
    <span
      class="text-gray-400 cursor-help"
      :title="tip"
    >
      ⓘ
    </span>
  </div>
</template>

<script setup>
defineProps({
  label: String,
  tip: String
})
</script>
