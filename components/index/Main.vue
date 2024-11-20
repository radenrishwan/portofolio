<script setup>
import Github from "~/assets/icons/Github.vue";
import Linkedin from "~/assets/icons/Linkedin.vue";
import X from "~/assets/icons/Twitter.vue";
import Mail from "~/assets/icons/Mail.vue";
</script>

<template>
  <main class="main-content">
    <div class="intro">
      <h1 class="greeting">
        Hello
        <span class="wave-emoji"> 👋 </span>
      </h1>
      <h2 class="name">
        I'm <span class="highlight">Raden Mohamad Rishwan</span>
      </h2>
      <h3 class="role">Backend & Mobile Developer</h3>
    </div>

    <ul class="social-links">
      <li>
        <a href="https://github.com/radenrishwan" target="_blank">
          <Github />
        </a>
      </li>
      <li>
        <a href="https://linkedin.com/in/yourusername" target="_blank">
          <Linkedin />
        </a>
      </li>
      <li>
        <a href="https://x.com/seioraswel" target="_blank"> <X /> </a>
      </li>
      <li>
        <a href="mailto:radenrishwan@gmail.com">
          <Mail />
        </a>
      </li>
    </ul>
  </main>
</template>

<style scoped>
.main-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100dvh;
  width: 100dvw;
  padding: 2rem;
  text-align: center;
}

.intro {
  margin-bottom: 2rem;
}

.greeting {
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.name {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.highlight {
  color: var(--accent-color);
}

.role {
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
  opacity: 0.8;
}

.social-links {
  display: flex;
  gap: 2rem;
  margin-top: 2rem;
}

.social-links a {
  color: var(--accent-color);
  transition: color 0.3s ease;
}

.social-links a:hover {
  color: var(--text-color);
}

@media (max-width: 768px) {
  .greeting {
    font-size: 2rem;
  }

  .wave-emoji svg {
    width: 30px;
    height: 30px;
  }

  .name {
    font-size: 2.5rem;
  }

  .role {
    font-size: 1.2rem;
  }

  .subtitle {
    font-size: 1rem;
  }
}

@media (max-width: 480px) {
  .social-links {
    gap: 1.5rem;
  }
}
</style>
