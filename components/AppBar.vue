<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import SecondLogo from "~/assets/SecondLogo.vue";

const activeSection = ref("profile");
const currentFont = ref("Doto");
const isDropdownOpen = ref(false);

const navbarMenu = ["profile", "project", "articles", "timeline", "contact"];
const fontMenu = ["Doto", "Host Grotesk", "Anton SC"];

const handleHashChange = () => {
  const hash = window.location.hash.slice(1); // Remove the # symbol
  if (hash && navbarMenu.includes(hash)) {
    activeSection.value = hash;
    scrollToSection(hash);
  }
};

const updateActiveSection = () => {
  const container = document.querySelector(".scroll-container");
  if (!container) return;

  const scrollPosition = container.scrollTop;
  const sectionHeight = container.clientHeight;
  const currentSection = Math.floor(
    (scrollPosition + sectionHeight / 2) / sectionHeight,
  );

  activeSection.value = navbarMenu[currentSection];
};

const updateActiveSectionMobile = () => {
  const scrollPosition = window.scrollY;
  const profileHeight = document.querySelector("#profile")?.clientHeight || 0;

  if (scrollPosition > profileHeight) {
    activeSection.value = "project";

    return;
  }

  activeSection.value = "profile";
};

const changeFont = (fontFamily) => {
  document.body.style.fontFamily = fontFamily;
  currentFont.value = fontFamily;
};

const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value;
};

const closeDropdown = (event) => {
  const dropdown = document.querySelector(".font-switcher");
  if (dropdown && !dropdown.contains(event.target)) {
    isDropdownOpen.value = false;
  }
};

onMounted(() => {
  const container = document.querySelector(".scroll-container");
  if (container) {
    container.addEventListener("scroll", updateActiveSection);
  }

  if (window.innerWidth < 768) {
    window.addEventListener("scroll", updateActiveSectionMobile);
  }

  document.addEventListener("click", closeDropdown);

  window.addEventListener("hashchange", handleHashChange);
  handleHashChange();
});

onUnmounted(() => {
  const container = document.querySelector(".scroll-container");
  if (container) {
    container.removeEventListener("scroll", updateActiveSection);
  }

  document.removeEventListener("click", closeDropdown);

  window.removeEventListener("hashchange", handleHashChange);
});

const scrollToSection = (sectionId) => {
  const container = document.querySelector(".scroll-container");
  const sectionIndex = [
    "profile",
    "project",
    "articles",
    "timeline",
    "contact",
  ].indexOf(sectionId);
  if (container && sectionIndex !== -1) {
    container.scrollTo({
      top: sectionIndex * container.clientHeight,
      behavior: "smooth",
    });

    history.pushState(null, null, `#${sectionId}`);
    activeSection.value = sectionId;
  }
};
</script>

<template>
  <nav
    class="navbar"
    :class="{ 'navbar-scrolled': activeSection !== 'profile' }"
  >
    <SecondLogo
      class="navbar-logo"
      @click="$router.push('/')"
      style="cursor: pointer"
    />
    <ul class="navbar-menu">
      <li v-for="item in navbarMenu" :key="item">
        <a
          :href="`#${item}`"
          @click.prevent="scrollToSection(item)"
          :class="{ active: activeSection === item }"
        >
          {{ item.charAt(0).toUpperCase() + item.slice(1) }}
        </a>
      </li>
    </ul>
    <div class="navbar-actions">
      <div class="font-switcher">
        <button class="dropdown-toggle" @click="toggleDropdown">
          {{ currentFont }}
          <span class="arrow" :class="{ 'arrow-up': isDropdownOpen }">▼</span>
        </button>
        <ul class="dropdown-menu" v-show="isDropdownOpen">
          <li
            v-for="font in fontMenu"
            :key="font"
            @click="changeFont(font)"
            :class="{ active: currentFont === font }"
          >
            {{ font }}
          </li>
        </ul>
      </div>
      <ThemeToggle />
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
  padding: 1.5rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: all 0.3s ease;
}

.navbar-scrolled {
  /* box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1); */
  background: var(--appbar-color) 0.8;
  backdrop-filter: blur(10px);
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
  position: relative;
}

.dropdown-toggle {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  background: var(--card-color);
  color: var(--text-color);
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.dropdown-toggle:hover {
  background: var(--hover-background);
}

.arrow {
  font-size: 0.8em;
  transition: transform 0.3s ease;
}

.arrow-up {
  transform: rotate(180deg);
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 0.5rem;
  background: var(--card-color);
  border-radius: 4px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  z-index: 1000;
  min-width: 120px;
}

.dropdown-menu li {
  padding: 0.5rem 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.dropdown-menu li:hover {
  background: var(--hover-background);
  color: var(--accent-color);
}

.dropdown-menu li.active {
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

  .dropdown-toggle {
    padding: 0.25rem 0.5rem;
    font-size: 0.875rem;
  }

  .dropdown-menu {
    min-width: 100px;
  }

  .dropdown-menu li {
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
