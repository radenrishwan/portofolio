<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import SecondLogo from "~/assets/SecondLogo.vue";

const activeSection = ref("profile");
const currentFont = ref("Host Grotesk");

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

const changeFont = (fontFamily) => {
  document.body.style.fontFamily = fontFamily;
  currentFont.value = fontFamily;
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
  <nav class="navbar">
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
    <div class="navbar-actions">
      <div class="font-switcher">
        <button
          @click="changeFont('Host Grotesk')"
          :class="{ active: currentFont === 'Host Grotesk' }"
        >
          Host
        </button>
        <button
          @click="changeFont('Doto')"
          :class="{ active: currentFont === 'Doto' }"
        >
          Doto
        </button>
        <button
          @click="changeFont('Anton SC')"
          :class="{ active: currentFont === 'Anton SC' }"
        >
          Anton
        </button>
      </div>
    </div>
  </nav>
</template>

<style scoped>
/* navbar section */
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background: rgba(26, 26, 26, 0.8); /* Semi-transparent background */
  backdrop-filter: blur(10px); /* Blur effect for the background */
  padding: 1.5rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

/* navbar menu section */
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

/* navbar action section */
.navbar-actions {
  display: flex;
  align-items: center;
}

.font-switcher {
  display: flex;
  gap: 0.5rem;
}

.font-switcher button {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  background: var(--card-color);
  color: var(--text-color);
  cursor: pointer;
  transition: all 0.3s ease;
}

.font-switcher button:hover {
  background: var(--hover-background);
  color: var(--accent-color);
}

.font-switcher button.active {
  background: var(--accent-color);
  color: var(--background-color);
}

/* responsive section */
@media (max-width: 768px) {
  .navbar {
    padding: 1rem;
  }

  .navbar-menu {
    gap: 2rem;
  }

  .font-switcher {
    gap: 0.25rem;
  }

  .font-switcher button {
    padding: 0.25rem 0.5rem;
    font-size: 0.875rem;
  }
}

@media (max-width: 576px) {
  .navbar-menu {
    display: none;
  }

  .navbar-actions {
    margin-left: auto; /* make the list font to the right  */
  }
}
</style>
