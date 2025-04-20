<script setup lang="ts">
import CodeBlock from "./CodeBlock.vue";

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
