<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import SecondLogo from "~/assets/SecondLogo.vue";

const currentFont = ref("Doto");
const isDropdownOpen = ref(false);

const navbarMenu = ["profile", "project", "articles", "timeline", "contact"];
const fontMenu = ["Doto", "Host Grotesk", "Anton SC"];

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
  document.addEventListener("click", closeDropdown);
});

onUnmounted(() => {
  document.removeEventListener("click", closeDropdown);
});
</script>

<template>
  <nav class="navbar">
    <SecondLogo
      class="navbar-logo"
      @click="$router.push('/')"
      style="cursor: pointer"
    />
    <ul class="navbar-menu">
      <li v-for="item in navbarMenu" :key="item">
        <a :href="`/#${item}`">
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
  top: 0;
  left: 0;
  right: 0;
  z-index: 10000;
  position: sticky;
  /* padding: 1.5rem 2rem; */
  padding: 0.7rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: all 0.3s ease;
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

.navbar-menu li a:hover {
  color: var(--accent-color);
}

.navbar-menu li a:hover::after {
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
