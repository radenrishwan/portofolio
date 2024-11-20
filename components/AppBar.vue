<script setup>
import SecondLogo from "~/assets/SecondLogo.vue";
</script>

<template>
  <nav class="navbar">
    <SecondLogo class="navbar-logo" />
    <ul class="navbar-menu">
      <li><a href="#profile">Profile</a></li>
      <li><a href="#portfolio">Portfolio</a></li>
      <li><a href="#articles">Articles</a></li>
      <li><a href="#contact">Contact</a></li>
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
  background: transparent;
  padding: 1.5rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
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
}

.navbar-menu li a:hover {
  color: var(--accent-color);
  background: var(--hover-background);
}
</style>
