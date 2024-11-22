<script setup lang="ts">
defineProps<{
  code: string;
  language?: string;
  filename?: string;
}>();
</script>

<template>
  <CodeBlock :code="code" :language="language">
    <slot />
  </CodeBlock>
</template>
