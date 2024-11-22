<script setup>
import { ref, onMounted, onUnmounted } from "vue";

const activeSectionIndex = ref(0);
const sections = ref([]);

const sectionStyles = {
  H1: { size: "16px", color: "var(--primary-color)" },
  H2: { size: "14px", color: "#4ECDC4" },
  H3: { size: "12px", color: "#45B7D1" },
  H4: { size: "10px", color: "#96CEB4" },
  H5: { size: "9px", color: "#FFEEAD" },
  H6: { size: "8px", color: "#D4A5A5" },
  IMG: { size: "10px", color: "#9B59B6" },
  BLOCKQUOTE: { size: "10px", color: "#E67E22" },
  DEFAULT: { size: "8px", color: "var(--accent-color)" },
};

const getSections = () => {
  const content = document.querySelector(".article-content");
  if (!content) return [];

  const elements = content.querySelectorAll(
    "h1, h2, h3, h4, h5, h6, img, blockquote",
  );
  return Array.from(elements).map((element) => ({
    element,
    text: element.tagName === "IMG" ? "Image" : element.textContent,
    type: element.tagName,
  }));
};

const updateActiveSection = () => {
  const scrollPosition = window.scrollY + window.innerHeight / 3;

  for (let i = sections.value.length - 1; i >= 0; i--) {
    const section = sections.value[i];
    if (section.element.offsetTop <= scrollPosition) {
      activeSectionIndex.value = i;
      return;
    }
  }

  activeSectionIndex.value = 0;
};

const scrollToSection = (index) => {
  const section = sections.value[index];
  if (section) {
    const appBar = document.querySelector(".navbar") || { offsetHeight: 0 };
    const offset = appBar.offsetHeight || 0;

    window.scrollTo({
      top: section.element.offsetTop - offset,
      behavior: "smooth",
    });

    activeSectionIndex.value = index;
  }
};

onMounted(() => {
  setTimeout(() => {
    sections.value = getSections();
    window.addEventListener("scroll", updateActiveSection);
    updateActiveSection();
  }, 500);
});

onUnmounted(() => {
  window.removeEventListener("scroll", updateActiveSection);
});

const getSectionStyle = (type) => {
  return sectionStyles[type] || sectionStyles.DEFAULT;
};
</script>

<template>
  <div class="article-scroll-progress-container">
    <div class="article-scroll-progress">
      <div
        v-for="(section, index) in sections"
        :key="index"
        class="progress-dot"
        @click="scrollToSection(index)"
        :class="{ active: index === activeSectionIndex }"
        :title="section.text"
        :style="{
          width: getSectionStyle(section.type).size,
          height: getSectionStyle(section.type).size,
        }"
      >
        <div
          class="dot-inner"
          :style="{ background: getSectionStyle(section.type).color }"
        ></div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.article-scroll-progress-container {
  position: fixed;
  right: 2rem;
  top: 50%;
  transform: translateY(-50%);
  z-index: 1000;
  height: 80vh;
  display: flex;
  align-items: center;
}

.article-scroll-progress {
  max-height: 100%;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding-right: 1rem;

  scrollbar-width: thin;
  scrollbar-color: var(--accent-color) var(--hover-background);
}

.article-scroll-progress::-webkit-scrollbar {
  width: 4px;
}

.article-scroll-progress::-webkit-scrollbar-track {
  background: var(--hover-background);
  border-radius: 2px;
}

.article-scroll-progress::-webkit-scrollbar-thumb {
  background: var(--accent-color);
  border-radius: 2px;
}

.progress-dot {
  border-radius: 50%;
  background: var(--hover-background);
  cursor: pointer;
  position: relative;
  transition: all 0.3s ease;
}

.dot-inner {
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  transform: scale(0);
  transition: transform 0.3s ease;
}

.progress-dot.active .dot-inner {
  transform: scale(1);
}

@media (max-width: 768px) {
  .article-scroll-progress-container {
    right: 1rem;
  }
}

@media (max-width: 576px) {
  .article-scroll-progress-container {
    display: none;
  }
}
</style>
