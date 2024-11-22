<script setup>
import { ref, onMounted, onUnmounted } from "vue";

const activeSection = ref(0);
const sections = ["Main", "Portfolio", "Articles", "Timeline", "Contact"];

const updateActiveSection = () => {
  const container = document.querySelector(".scroll-container");
  if (!container) return;

  const scrollPosition = container.scrollTop;
  const sectionHeight = container.clientHeight;
  const currentSection = Math.floor(
    (scrollPosition + sectionHeight / 2) / sectionHeight,
  );
  activeSection.value = currentSection;
};

onMounted(() => {
  const container = document.querySelector(".scroll-container");
  if (container) {
    container.addEventListener("scroll", updateActiveSection);
  }
});

onUnmounted(() => {
  const container = document.querySelector(".scroll-container");
  if (container) {
    container.removeEventListener("scroll", updateActiveSection);
  }
});

const scrollToSection = (index) => {
  const container = document.querySelector(".scroll-container");
  if (!container) return;

  const sectionHeight = container.clientHeight;
  container.scrollTo({
    top: index * sectionHeight,
    behavior: "smooth",
  });
};
</script>

<template>
  <div class="scroll-progress">
    <div
      v-for="(section, index) in sections"
      :key="index"
      class="progress-dot"
      @click.prevent="scrollToSection(index)"
      :class="{ active: index === activeSection }"
      :title="section"
    >
      <div class="dot-label">{{ section }}</div>
    </div>
  </div>
</template>

<style scoped>
.scroll-progress {
  position: fixed;
  right: 2rem;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  z-index: 1000;
}

.progress-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: var(--hover-background);
  cursor: pointer;
  position: relative;
  transition: all 0.3s ease;
}

.progress-dot::after {
  content: "";
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: var(--accent-color);
  transform: scale(0);
  transition: transform 0.3s ease;
}

.progress-dot.active::after {
  transform: scale(1);
}

.dot-label {
  position: absolute;
  right: 24px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-color);
  font-size: 0.875rem;
  opacity: 0;
  transition: opacity 0.3s ease;
  white-space: nowrap;
  pointer-events: none;
}

.progress-dot:hover .dot-label {
  opacity: 1;
}

@media (max-width: 768px) {
  .scroll-progress {
    right: 1rem;
  }
}

@media (max-width: 576px) {
  .scroll-progress {
    display: none;
  }
}
</style>
