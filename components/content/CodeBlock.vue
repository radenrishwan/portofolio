<script setup lang="ts">
const props = defineProps<{
  code: string;
  language?: string;
}>();

const copyText = ref("Copy");

const copyCode = async () => {
  try {
    await navigator.clipboard.writeText(props.code);
    copyText.value = "Copied!";
    setTimeout(() => {
      copyText.value = "Copy";
    }, 2000);
  } catch (err) {
    console.error("Failed to copy:", err);
  }
};
</script>

<template>
  <div class="code-block-wrapper">
    <div class="code-header">
      <span v-if="language" class="language-tag">{{ language }}</span>
      <button @click="copyCode" class="copy-button">
        <span>{{ copyText }}</span>
      </button>
    </div>
    <pre><code><slot /></code></pre>
  </div>
</template>
<style scoped>
.code-block-wrapper {
  background-color: var(--card-color);
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.1);
  margin: 0.5rem 0;
}

.code-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.2);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding: 0.5rem 0.75rem;
}

.language-tag {
  font-size: 0.875rem;
  color: var(--text-color);
  opacity: 0.7;
  text-transform: uppercase;
  font-weight: 500;
}

.copy-button {
  background: transparent;
  border: 1px solid var(--accent-color);
  color: var(--accent-color);
  padding: 0.25rem 0.75rem;
  border-radius: 4px;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.copy-button:hover {
  background-color: var(--accent-color);
  color: var(--background-color);
}

pre {
  margin: 0;
  padding: 0.75rem;
  overflow-x: auto;
}

code {
  font-family: "Fira Code", monospace;
  font-size: 0.875rem;
  line-height: 1.6;
  color: var(--text-color);
}

pre::-webkit-scrollbar {
  height: 8px;
}

pre::-webkit-scrollbar-track {
  background: var(--card-color);
}

pre::-webkit-scrollbar-thumb {
  background: var(--accent-color);
  border-radius: 4px;
}

pre::-webkit-scrollbar-thumb:hover {
  background: var(--primary-color);
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .code-header {
    padding: 0.35rem 0.5rem;
  }

  pre {
    padding: 0.75rem;
    padding: 0.5rem;
  }

  code {
    font-size: 0.8rem;
  }
}
</style>
