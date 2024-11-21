<script setup lang="ts">
defineProps<{
  article: {
    heroImage: string;
    title: string;
    pubDate: string;
    short: string;
    tags: string[];
    description: string;
    slug: string;
  };
}>();

const getReadTime = (content: string) => {
  const wordsPerMinute = 200;
  const wordCount = content.split(/\s+/).length;
  const readTime = Math.ceil(wordCount / wordsPerMinute);
  return readTime;
};
</script>

<template>
  <article class="article-card">
    <div class="article-image">
      <img :src="article.heroImage" :alt="article.title" />
    </div>

    <div class="article-content">
      <div class="article-upper-content">
        <div class="article-meta">
          <span class="article-date">
            {{ new Date(article.pubDate).toLocaleDateString() }}
          </span>
          <span class="article-readtime">
            {{ getReadTime(article.short) }} min read
          </span>
        </div>

        <h2 class="article-title">{{ article.title }}</h2>

        <div class="article-tags">
          <span v-for="tag in article.tags" :key="tag" class="tag">
            #{{ tag }}
          </span>
        </div>

        <p class="article-description">{{ article.description }}</p>
      </div>

      <NuxtLink :to="`/article/${article.slug}`" class="read-more">
        Read more →
      </NuxtLink>
    </div>
  </article>
</template>

<style scoped>
.article-card {
  background: var(--card-color);
  border-radius: 12px;
  overflow: hidden;
  transition: transform 0.3s ease;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.article-card:hover {
  transform: translateY(-5px);
}

.article-image {
  width: 100%;
  height: 200px;
  overflow: hidden;
}

.article-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.article-card:hover .article-image img {
  transform: scale(1.05);
}

.article-content {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  justify-content: space-between;
}

.article-meta {
  display: flex;
  justify-content: space-between;
  font-size: 0.875rem;
  color: #666;
  margin-bottom: 0.5rem;
}

.article-title {
  font-size: 1.5rem;
  margin: 0.5rem 0;
  color: var(--text-color);
  line-height: 1.3;
}

.article-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin: 0.5rem 0;
}

.tag {
  background: var(--primary-color);
  color: var(--background-color);
  padding: 0.25rem 0.75rem;
  border-radius: 15px;
  font-size: 0.875rem;
}

.article-description {
  color: var(--text-color);
  opacity: 0.8;
  margin: 0.5rem 0;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.article-upper-content {
  flex-grow: 1;
}

.read-more {
  display: inline-block;
  margin-top: 1rem;
  color: var(--accent-color);
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s ease;
  align-self: flex-start;
}

.read-more:hover {
  color: var(--primary-color);
}
</style>
