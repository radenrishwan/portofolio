<script setup lang="ts">
const timelines = [
  {
    title: "First time writing program",
    description: "writing an Hello World using python",
    date: "2019-06-23",
  },
  {
    title: "Making a chat bot on line",
    description:
      "learning how to code using python, consuming an api, making rest api, and deploying it on heroku",
    date: "2019-??-??",
  },
  {
    title: "Learning HTML, CSS, and JS",
    description:
      "with a big gap hiatus, i'm start learning web development(also waiting for my fasting month)",
    date: "2020-04-23",
  },
  {
    title: "Making a portofolio website",
    description: "my first website project",
    date: "2020-05-??",
  },
  {
    title: "Learn C/C++",
    description: "Start learning another language",
    date: "2021-??-??",
  },
  {
    title: "Learning Java",
    description:
      "Learning most pain ever language for me (learn on low spec laptop)",
    date: "2021-??-??",
  },
  {
    title: "Writing Backend Related using Spring ",
    description: "Learning how to write backend using spring",
    date: "2021-??-??",
  },
  {
    title: "Learning another backend language (PHP and NodeJS)",
    description:
      "Learning another backend language and made some backend project",
    date: "2021-??-??",
  },
  {
    title: "Learning Golang",
    description: "Start learning and writing first code golang on my birthday",
    date: "2022-01-15",
  },
  {
    title: "Continue Learning",
    description: "Continue learning anything related about programming...",
  },
];
</script>

<template>
  <section id="timeline">
    <h2 class="section-title">My Learning Journey</h2>
    <div class="timeline-container">
      <div class="timeline-wrapper">
        <div class="timeline-line"></div>
        <div class="timeline-items">
          <div
            v-for="(item, index) in timelines"
            :key="index"
            class="timeline-item"
          >
            <div class="timeline-dot"></div>
            <div class="timeline-content">
              <h3 class="timeline-title">{{ item.title }}</h3>
              <p class="timeline-date">{{ item.date }}</p>
              <p class="timeline-description">{{ item.description }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
#timeline {
  min-height: 100dvh;
  width: 100%;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.section-title {
  font-size: 2rem;
  margin-bottom: 3rem;
  color: var(--accent-color);
}

.timeline-container {
  width: 100%;
  overflow-x: auto;
  padding: 2rem 0;
}

.timeline-wrapper {
  position: relative;
  min-width: max-content;
  padding: 0 2rem;
}

.timeline-line {
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 2px;
  background: var(--accent-color);
  transform: translateY(-50%);
}

.timeline-items {
  display: flex;
  gap: 4rem;
  position: relative;
}

.timeline-item {
  position: relative;
  width: 250px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.timeline-dot {
  width: 12px;
  height: 12px;
  background: var(--accent-color);
  border-radius: 50%;
  margin: 1rem 0;
  position: relative;
  z-index: 1;
}

.timeline-content {
  text-align: center;
  padding: 1rem;
  background: var(--card-color);
  border-radius: 8px;
  transition: transform 0.3s ease;
}

.timeline-content:hover {
  transform: translateY(-5px);
}

.timeline-title {
  color: var(--accent-color);
  font-size: 1.1rem;
  margin-bottom: 0.5rem;
}

.timeline-date {
  color: var(--primary-color);
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
}

.timeline-description {
  font-size: 0.9rem;
  line-height: 1.4;
}

/* Alternate items above and below the line */
.timeline-item:nth-child(even) .timeline-content {
  margin-top: 3rem;
}

.timeline-item:nth-child(odd) .timeline-content {
  margin-bottom: 3rem;
}

.timeline-container {
  width: 100%;
  overflow-x: auto;
  padding: 2rem 0;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.timeline-container::-webkit-scrollbar {
  display: none;
}

@media (max-width: 768px) {
  .timeline-container {
    padding: 1rem 0;
  }

  .timeline-item {
    width: 200px;
  }

  .timeline-content {
    padding: 0.8rem;
  }

  .timeline-title {
    font-size: 1rem;
  }

  .timeline-date,
  .timeline-description {
    font-size: 0.8rem;
  }
}
</style>
