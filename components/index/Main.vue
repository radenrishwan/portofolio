<script setup>
import { ref, onMounted } from "vue";
import Github from "~/assets/icons/Github.vue";
import Linkedin from "~/assets/icons/Linkedin.vue";
import X from "~/assets/icons/Twitter.vue";
import Mail from "~/assets/icons/Mail.vue";

const wordsArray = [
  "Golang",
  "Dart",
  "Javascript",
  "Typescript",
  "Rust",
  "V",
  "Kotlin",
  "PHP",
  "Docker",
  "Linux",
  "GCP",
  "AWS",
  "Flutter",
  "Jetpack Compose",
  "Deno",
  "Bun",
  "Node",
  "React",
  "Vue",
  "NextJS",
  "NuxtJS",
];

const generateWordPosition = () => {
  let top = Math.random() * 80 + 10 + "%";
  let left = Math.random() * 75 + 10 + "%";
  let positionCorrect = false;

  while (!positionCorrect) {
    if (
      parseFloat(top) > 20 &&
      parseFloat(top) < 70 &&
      parseFloat(left) > 20 &&
      parseFloat(left) < 70
    ) {
      top = Math.random() * 80 + 10 + "%";
      left = Math.random() * 75 + 10 + "%";
    } else {
      positionCorrect = true;
    }
  }

  return {
    top,
    left,
    animationDelay: Math.random() * 5 + "s",
    animationDuration: Math.random() * 10 + 5 + "s",
  };
};

const words = ref([]);

const repositionWord = (index) => {
  const newPosition = generateWordPosition();
  words.value[index] = {
    ...words.value[index],
    ...newPosition,
  };
};

onMounted(() => {
  words.value = wordsArray.map((word) => {
    const position = generateWordPosition();
    return {
      text: word,
      ...position,
    };
  });
});
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

    <div class="floating-words-container">
      <span
        v-for="(word, index) in words"
        :key="index"
        class="floating-word"
        :style="{
          top: word.top,
          left: word.left,
          animationDelay: word.animationDelay,
          animationDuration: word.animationDuration,
        }"
        @click="repositionWord(index)"
      >
        {{ word.text }}
      </span>
    </div>
  </main>
</template>

<style scoped>
.main-content {
  position: relative;
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

/* floating effect */
.floating-words-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  pointer-events: none;
}

.floating-word {
  position: absolute;
  font-size: 1.2rem;
  color: var(--accent-color);
  opacity: 0;
  transition:
    opacity 0.5s,
    top 0.5s,
    left 0.5s;
  animation: float 15s infinite;
  cursor: pointer;
  pointer-events: auto;
}

/* .floating-word:hover {
  /* opacity: 1;
} */

.main-content:hover .floating-word {
  opacity: 0.7;
}

@keyframes float {
  0% {
    transform: translate(0, 0) scale(1);
  }
  25% {
    transform: translate(-20px, -30px) scale(1.2);
  }
  50% {
    transform: translate(30px, 20px) scale(1);
  }
  75% {
    transform: translate(-10px, 30px) scale(0.8);
  }
  100% {
    transform: translate(0, 0) scale(1);
  }
}
</style>
