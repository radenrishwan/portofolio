<script setup lang="ts">
import { useRoute } from "vue-router";
import "~/assets/css/markdown.css";

const route = useRoute();
const slug = route.params.slug as string;

// Fetch the content using useAsyncData and queryContent
// @ts-ignore
const { data: article } = await useAsyncData(slug, () =>
  // @ts-ignore
  queryContent().where({ slug: slug }).findOne(),
);

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};
</script>

<template>
  <AppBarNavigation />

  <article v-if="article" class="article-container">
    <header class="article-header">
      <h1 class="article-title">{{ article.title }}</h1>

      <div class="article-meta">
        <div class="author-date">
          <span class="author">{{ article.author }}</span>
          <span class="date">{{ formatDate(article.pubDate) }}</span>
        </div>

        <div class="tags">
          <span v-for="tag in article.tags" :key="tag" class="tag">
            #{{ tag }}
          </span>
        </div>
      </div>

      <div class="hero-image-container" v-if="article.heroImage">
        <img :src="article.heroImage" :alt="article.title" class="hero-image" />
      </div>
    </header>

    <div class="article-content">
      <ContentRenderer :value="article" />
    </div>
  </article>
</template>

<style scoped>
.article-container {
  max-width: 970px;
  margin: 2rem auto;
  padding: 0 1.5rem;
}

.article-header {
  margin-bottom: 3rem;
}

.article-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--text-color);
  margin-bottom: 1.5rem;
  line-height: 1.2;
}

.article-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  font-size: 0.95rem;
}

.author-date {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.author {
  color: var(--accent-color);
  font-weight: 600;
}

.date {
  color: #888;
}

.tags {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.tag {
  background-color: var(--card-color);
  color: var(--accent-color);
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.85rem;
}

.hero-image-container {
  width: 100%;
  margin-bottom: 2rem;
  border-radius: 8px;
  overflow: hidden;
}

.hero-image {
  width: 100%;
  height: auto;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.hero-image:hover {
  transform: scale(1.02);
}

.article-content {
  line-height: 1.8;
  font-size: 1.1rem;
}

/* Responsive Design */
@media (max-width: 768px) {
  .article-container {
    margin: 1rem auto;
  }

  .article-title {
    font-size: 2rem;
  }

  .article-meta {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .article-content {
    font-size: 1rem;
  }
}

@media (max-width: 480px) {
  .article-container {
    padding: 0 1rem;
  }

  .article-title {
    font-size: 1.75rem;
  }

  .author-date {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
}
</style>
