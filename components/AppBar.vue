<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import SecondLogo from "~/assets/SecondLogo.vue";

const activeSection = ref("profile");

const updateActiveSection = () => {
  const container = document.querySelector(".scroll-container");
  if (!container) return;

  const scrollPosition = container.scrollTop;
  const sectionHeight = container.clientHeight;
  const currentSection = Math.floor(
    (scrollPosition + sectionHeight / 2) / sectionHeight,
  );

  const sections = ["profile", "portfolio", "articles", "contact"];
  activeSection.value = sections[currentSection];
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

// Smooth scroll function
const scrollToSection = (sectionId) => {
  const container = document.querySelector(".scroll-container");
  const sectionIndex = ["profile", "portfolio", "articles", "contact"].indexOf(
    sectionId,
  );
  if (container && sectionIndex !== -1) {
    container.scrollTo({
      top: sectionIndex * container.clientHeight,
      behavior: "smooth",
    });
  }
};
</script>

<template>
  <nav
    class="navbar"
    :class="{ 'navbar-scrolled': activeSection !== 'profile' }"
  >
    <SecondLogo class="navbar-logo" />
    <ul class="navbar-menu">
      <li>
        <a
          href="#profile"
          @click.prevent="scrollToSection('profile')"
          :class="{ active: activeSection === 'profile' }"
        >
          Profile
        </a>
      </li>
      <li>
        <a
          href="#portfolio"
          @click.prevent="scrollToSection('portfolio')"
          :class="{ active: activeSection === 'portfolio' }"
        >
          Portfolio
        </a>
      </li>
      <li>
        <a
          href="#articles"
          @click.prevent="scrollToSection('articles')"
          :class="{ active: activeSection === 'articles' }"
        >
          Articles
        </a>
      </li>
      <li>
        <a
          href="#contact"
          @click.prevent="scrollToSection('contact')"
          :class="{ active: activeSection === 'contact' }"
        >
          Contact
        </a>
      </li>
    </ul>
    <div class="navbar-actions"></div>
  </nav>
</template>

<style scoped>
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  padding: 1.5rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: all 0.3s ease;
}

.navbar-scrolled {
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  background: rgba(26, 26, 26, 0.8);
  backdrop-filter: blur(10px);
}

.navbar-menu {
  display: flex;
  gap: 4rem;
}

.navbar-menu li a {
  color: var(--text-color);
  text-decoration: none;
  font-weight: 500;
  padding: 0.5rem 1rem;
  transition: all 0.3s ease;
  border-radius: 6px;
  position: relative;
}

.navbar-menu li a::after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 50%;
  width: 0;
  height: 2px;
  background: var(--accent-color);
  transition: all 0.3s ease;
  transform: translateX(-50%);
}

.navbar-menu li a:hover,
.navbar-menu li a.active {
  color: var(--accent-color);
}

.navbar-menu li a:hover::after,
.navbar-menu li a.active::after {
  width: 100%;
}

@media (max-width: 768px) {
  .navbar {
    padding: 1rem;
  }

  .navbar-menu {
    gap: 2rem;
  }
}

@media (max-width: 576px) {
  .navbar-menu {
    display: none;
  }
}
</style>
