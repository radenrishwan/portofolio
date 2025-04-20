<script setup>
import { ref, onMounted, onUnmounted } from "vue";

const activeSectionIndex = ref(0);
const sections = ref([]);
const isTableOfContentsVisible = ref(false);

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

const toggleTableOfContents = () => {
  isTableOfContentsVisible.value = !isTableOfContentsVisible.value;
};

const handleSectionClick = (index) => {
  scrollToSection(index);
  if (window.innerWidth < 768) {
    isTableOfContentsVisible.value = false;
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

const getSectionIndent = (type) => {
  switch (type) {
    case "H1":
      return 0;
    case "H2":
      return 1;
    case "H3":
      return 2;
    case "H4":
      return 3;
    case "H5":
      return 4;
    case "H6":
      return 5;
    default:
      return 0;
  }
};
</script>

<template>
  <div class="article-scroll-progress-container">
    <div class="table-of-contents" v-show="isTableOfContentsVisible">
      <div class="toc-header">
        <h3>Table of Contents</h3>
      </div>
      <div class="toc-content">
        <div
          v-for="(section, index) in sections"
          :key="index"
          class="toc-item"
          :class="{ active: index === activeSectionIndex }"
          @click="handleSectionClick(index)"
          :style="{
            paddingLeft: `${getSectionIndent(section.type) * 16 + 8}px`,
          }"
        >
          <div
            class="toc-item-marker"
            :style="{ background: getSectionStyle(section.type).color }"
          ></div>
          <span class="toc-item-text">{{ section.text }}</span>
        </div>
      </div>
    </div>

    <div class="article-scroll-progress">
      <button
        class="toc-toggle"
        @click="toggleTableOfContents"
        :class="{ active: isTableOfContentsVisible }"
        title="Table of Contents"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <line x1="4" y1="6" x2="20" y2="6"></line>
          <line x1="4" y1="12" x2="20" y2="12"></line>
          <line x1="4" y1="18" x2="20" y2="18"></line>
        </svg>
      </button>

      <div class="dots-container">
        <div
          v-for="(section, index) in sections"
          :key="index"
          class="progress-dot"
          @click="scrollToSection(index)"
          :class="{ active: index === activeSectionIndex }"
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
  </div>
</template>

<style scoped>
.article-scroll-progress-container {
  position: fixed;
  right: 2rem;
  top: 50%;
  transform: translateY(-50%);
  z-index: 1000;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.toc-toggle {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: var(--card-background, rgba(255, 255, 255, 0.9));
  border: 1px solid var(--border-color, rgba(0, 0, 0, 0.1));
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  margin-bottom: 0.75rem;
  color: var(--text-color, #333);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  padding: 0;
}

.toc-toggle:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.toc-toggle.active {
  background: var(--primary-color, #4ecdc4);
  color: white;
}

.table-of-contents {
  position: absolute;
  right: calc(100% + 15px);
  top: 0;
  width: 280px;
  max-height: 70vh;
  background: var(--card-background, rgba(255, 255, 255, 0.95));
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  border: 1px solid var(--border-color, rgba(0, 0, 0, 0.1));
  overflow: hidden;
  display: flex;
  flex-direction: column;
  transition: all 0.3s ease;
  z-index: 1001;
}

.toc-header {
  padding: 12px 16px;
  border-bottom: 1px solid var(--border-color, rgba(0, 0, 0, 0.1));
}

.toc-header h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: var(--text-color, #333);
}

.toc-content {
  padding: 8px 0;
  overflow-y: auto;
  max-height: calc(70vh - 48px);
  scrollbar-width: thin;
  scrollbar-color: var(--accent-color) var(--hover-background);
}

.toc-content::-webkit-scrollbar {
  width: 4px;
}

.toc-content::-webkit-scrollbar-track {
  background: var(--hover-background, rgba(0, 0, 0, 0.05));
}

.toc-content::-webkit-scrollbar-thumb {
  background: var(--accent-color, rgba(0, 0, 0, 0.2));
  border-radius: 4px;
}

.toc-item {
  display: flex;
  align-items: center;
  padding: 6px 16px;
  cursor: pointer;
  transition: background 0.2s ease;
  position: relative;
  font-size: 14px;
  color: var(--text-color, #333);
}

.toc-item:hover {
  background: var(--hover-background, rgba(0, 0, 0, 0.05));
}

.toc-item.active {
  background: var(--hover-background, rgba(0, 0, 0, 0.05));
  font-weight: 500;
}

.toc-item-marker {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  margin-right: 8px;
  flex-shrink: 0;
}

.toc-item-text {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Progress dots */
.article-scroll-progress {
  max-height: calc(70vh - 30px);
  display: flex;
  flex-direction: column;
  align-items: center;
  background: var(--card-background, rgba(255, 255, 255, 0.8));
  border-radius: 24px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  border: 1px solid var(--border-color, rgba(0, 0, 0, 0.1));
  padding: 0.75rem 0.5rem;
}

.dots-container {
  max-height: 100%;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  align-items: center;
  scrollbar-width: none;
  padding-bottom: 0.5rem;
}

.dots-container::-webkit-scrollbar {
  display: none;
}

.progress-dot {
  border-radius: 50%;
  background: var(--hover-background, rgba(0, 0, 0, 0.05));
  cursor: pointer;
  position: relative;
  transition: all 0.3s ease;
}

/* .progress-dot:hover {
  transform: scale(1.2);
} */

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

  .table-of-contents {
    width: 240px;
    max-height: 60vh;
    right: calc(100% + 10px);
  }

  .toc-content {
    max-height: calc(60vh - 48px);
  }
}

@media (max-width: 576px) {
  .article-scroll-progress-container {
    bottom: 2rem;
    top: auto;
    transform: none;
    right: 1rem;
  }

  .table-of-contents {
    position: fixed;
    top: auto;
    bottom: 5rem;
    right: 1rem;
    left: 1rem;
    width: auto;
    max-width: 320px;
    max-height: 50vh;
  }

  .toc-content {
    max-height: calc(50vh - 48px);
  }

  .article-scroll-progress {
    padding: 0.5rem;
  }

  .dots-container {
    display: none;
  }
}
</style>
