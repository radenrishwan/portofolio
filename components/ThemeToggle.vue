<script setup>
import { ref, onMounted } from "vue";
import Sun from "~/assets/icons/Sun.vue";
import Moon from "~/assets/icons/Moon.vue";

const isDark = ref(true);

const toggleTheme = () => {
  isDark.value = !isDark.value;
  document.documentElement.classList.toggle("light-mode");

  localStorage.setItem("theme", isDark.value ? "dark" : "light");
};

onMounted(() => {
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const storedTheme = localStorage.getItem("theme");

  isDark.value =
    storedTheme === "dark" || (storedTheme === null && prefersDark);

  if (!isDark.value) {
    document.documentElement.classList.add("light-mode");
  }
});
</script>

<template>
  <button
    class="theme-toggle"
    @click="toggleTheme"
    :aria-label="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
  >
    <Transition name="fade" mode="out-in">
      <Sun v-if="isDark" class="icon" />
      <Moon v-else class="icon" />
    </Transition>
  </button>
</template>

<style scoped>
.theme-toggle {
  background: none;
  border: none;
  cursor: pointer;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.3s ease;
  position: relative;
  outline: none;
}

.theme-toggle:hover {
  transform: scale(1.1);
}

.theme-toggle:active {
  transform: scale(0.95);
}

.icon {
  width: 24px;
  height: 24px;
  color: var(--text-color);
}

.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: rotate(30deg) scale(0.7);
}

.fade-enter-to,
.fade-leave-from {
  opacity: 1;
  transform: rotate(0) scale(1);
}
</style>
