<script setup lang="ts">
import { useRoute } from "vue-router";
import "~/assets/css/markdown.css";
import ArticleScrollProgress from "~/components/article/ArticleScrollProgress.vue";
import Comment from "~/components/article/Comment.vue";

const route = useRoute();
const slug = route.params.slug as string;

const { data: article } = await useAsyncData(slug, () =>
  // @ts-ignore
  queryContent().where({ slug: slug }).findOne(),
);

const { data: articles } = await useAsyncData("articles", () => {
  // @ts-ignore
  return queryContent().sort({ pubDate: -1 }).limit(3).find();
});

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

if (article.value) {
  const keywords: string = article.value.tags.join(", ");

  useHead({
    title: article.value.title || "Raden Mohamad Rishwan",
  });

  useSeoMeta({
    title: article.value.title || "Raden Mohamad Rishwan",
    description:
      article.value.description ||
      "Articles that written by Raden Mohamad Rishwan",
    ogTitle: "Raden Mohamad Rishwan",
    ogDescription:
      article.value.description ||
      "Articles that written by Raden Mohamad Rishwan",
    ogImage: article.value.heroImage || "https://i.ibb.co.com/gWjmQ8q/logo.png",
    ogUrl: `https://mohamadrishwan.me/article/${slug}`,
    twitterCard: "summary_large_image",
    twitterTitle: "Raden Mohamad Rishwan",
    twitterDescription:
      article.value.description ||
      "Articles that written by Raden Mohamad Rishwan",
    twitterImage:
      article.value.heroImage || "https://i.ibb.co.com/gWjmQ8q/logo.png",
    twitterCreator: "@seioraswel",
    author: "Raden Mohamad Rishwan",
    keywords:
      "Raden Mohamad Rishwan, Rishwan, Raden, Mohamad, Portfolio, Personal, Website, Projects, Articles, Timeline, Web Development, Mobile Development, Backend, Frontend, " +
      keywords,
  });
}
</script>

<template>
  <AppBarNavigation />
  <ArticleScrollProgress />

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

    <div class="newest-articles-section">
      <h2 class="section-title">You might also like</h2>
      <div class="newest-articles">
        <NuxtLink
          v-for="newestArticle in articles"
          :key="newestArticle.slug"
          :to="`/article/${newestArticle.slug}`"
          class="article-card"
        >
          <div class="article-card-image-container">
            <img
              :src="newestArticle.heroImage || '/images/default-article.jpg'"
              :alt="newestArticle.title"
              class="article-card-image"
            />
          </div>
          <div class="article-card-content">
            <h3 class="article-card-title">{{ newestArticle.title }}</h3>
            <p class="article-card-date">
              {{ formatDate(newestArticle.pubDate) }}
            </p>
          </div>
        </NuxtLink>
      </div>
    </div>

    <div class="comments-section">
      <Comment />
    </div>
  </article>
</template>

<style scoped>
article {
  max-width: 100dvw;
  overflow: auto;
  text-overflow: ellipsis;
}

.article-container {
  max-width: 65dvw;
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

.newest-articles-section {
  margin-top: 4rem;
  padding-top: 2rem;
  border-top: 1px solid var(--border-color);
}

.section-title {
  font-size: 1.75rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  color: var(--text-color);
}

.newest-articles {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
}

.article-card {
  display: block;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
  background-color: var(--card-color);
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
  text-decoration: none;
  height: 100%;
}

.article-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}

.article-card-image-container {
  width: 100%;
  height: 160px;
  overflow: hidden;
}

.article-card-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.article-card:hover .article-card-image {
  transform: scale(1.05);
}

.article-card-content {
  padding: 1rem;
}

.article-card-title {
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: var(--text-color);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.article-card-date {
  font-size: 0.85rem;
  color: var(--accent-color);
  margin: 0;
}

.comments-section {
  margin-top: 4rem;
  padding-top: 2rem;
  border-top: 1px solid var(--border-color);
}

/* Responsive Design */
@media (max-width: 768px) {
  .article-container {
    margin: 1rem auto;
    max-width: 100dvw;
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

  .newest-articles {
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
  }

  .section-title {
    font-size: 1.5rem;
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

  .newest-articles {
    grid-template-columns: 1fr;
  }

  .article-card-image-container {
    height: 180px;
  }
}
</style>
