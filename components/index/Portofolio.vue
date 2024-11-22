<script setup lang="ts">
import Github from "~/assets/icons/Github.vue";

type Portofolio = {
  title: string;
  description: string;
  link: string;
  tags: string[];
};

const projects: Portofolio[] = [
  {
    title: "markdown parser",
    description: "A dynamic markdown parser build using Golang",
    link: "https://github.com/radenrishwan/markdown-parser",
    tags: ["golang", "markdown", "parser"],
  },
  {
    title: "hfs",
    description: "http server from scratch with websocket support",
    link: "https://github.com/radenrishwan/hfs",
    tags: ["golang", "http", "websocket", "backend"],
  },
  {
    title: "phol",
    description: "v0 alternative",
    link: "https://github.com/radenrishwan/Phol",
    tags: ["typescript", "frontend", "react"],
  },
  {
    title: "pesen",
    description:
      "SMTP, POP3, and IMAP implementation from scratch using Golang",
    link: "https://github.com/radenrishwan/hfs",
    tags: ["golang"],
  },
  {
    title: "gogoanime",
    description: "unofficial gogoanime mobile app",
    link: "https://github.com/radenrishwan/gogoanime",
    tags: ["kotlin", "jetpack-compose", "mobile"],
  },
  {
    title: "gothon",
    description: "intepreter language using go",
    link: "https://github.com/radenrishwan/gothon",
    tags: ["golang"],
  },
];
</script>

<template>
  <section id="project">
    <div>
      <div class="project-grid">
        <a
          v-for="(project, index) in projects"
          :key="index"
          :href="project.link"
          target="_blank"
          class="project-item"
        >
          <div class="content">
            <div class="header">
              <h3>{{ project.title }}</h3>
              <Github class="github-icon" />
            </div>
            <p>{{ project.description }}</p>
            <div class="tags">
              <span v-for="tag in project.tags" :key="tag" class="tag">
                {{ tag }}
              </span>
            </div>
          </div>
        </a>
      </div>
      <div class="more-project">
        <a
          class="button-link"
          target="_blank"
          href="https://github.com/radenrishwan?tab=repositories"
          >More Project</a
        >
      </div>
    </div>
  </section>
</template>

<style scoped>
#project {
  min-height: 100dvh;
  width: 100dvw;
  padding: 2rem;
  display: flex;
  justify-content: center;
  align-items: center;
}

.project-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
  max-width: 1200px;
  margin: 0 auto;
}

.project-item {
  background-color: var(--card-color);
  border-radius: 8px;
  padding: 1.5rem;
  transition: transform 0.2s ease;
  text-decoration: none;
  color: var(--text-color);
}

.project-item:hover {
  transform: translateY(-5px);
}

.content {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.github-icon {
  color: var(--text-color);
  transition: color 0.2s ease;
}

.project-item:hover .github-icon {
  color: var(--accent-color);
}

h3 {
  font-size: 1.25rem;
  color: var(--text-color);
}

p {
  color: #a0a0a0;
  font-size: 0.9rem;
  line-height: 1.5;
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: auto;
}

.tag {
  background: var(--primary-color);
  color: var(--background-color);
  padding: 0.25rem 0.75rem;
  border-radius: 15px;
  font-size: 0.8rem;
}

.more-project {
  text-align: center;
  margin-top: 2rem;
}

.more-project-button:hover {
  color: var(--primary-color);
}

@media (max-width: 768px) {
  .project-grid {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  }
}

@media (max-width: 480px) {
  #project {
    padding: 1rem;
  }

  .project-grid {
    grid-template-columns: 1fr;
  }
}
</style>
