<script setup lang="ts">
// @ts-ignore
const { data: articles } = await useAsyncData("articles", () => {
  // @ts-ignore
  return queryContent().sort({ pubDate: -1 }).find();
});

useSeoMeta({
  title: "Raden Mohamad Rishwan",
  description: "Articles that written by Raden Mohamad Rishwan",
  ogTitle: "Raden Mohamad Rishwan",
  ogDescription: "Articles that written by Raden Mohamad Rishwan",
  ogImage: "https://i.ibb.co.com/gWjmQ8q/logo.png",
  ogUrl: "https://mohamadrishwan.me",
  twitterCard: "summary_large_image",
  twitterTitle: "Raden Mohamad Rishwan",
  twitterDescription: "Articles that written by Raden Mohamad Rishwan",
  twitterImage: "https://i.ibb.co.com/gWjmQ8q/logo.png",
  twitterCreator: "@seioraswel",
  author: "Raden Mohamad Rishwan",
  keywords:
    "Raden Mohamad Rishwan, Rishwan, Raden, Mohamad, Portfolio, Personal, Website, Projects, Articles, Timeline, Web Development, Mobile Development, Backend, Frontend",
});
</script>

<template>
  <AppBarNavigation />

  <main class="articles-container">
    <h1 class="page-title">Articles</h1>

    <div class="articles-grid" v-if="articles">
      <ArticleCard
        v-for="article in articles"
        :key="article._id"
        :article="article"
      />
    </div>
  </main>
</template>

<style scoped>
.articles-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.page-title {
  font-size: 2.5rem;
  margin-bottom: 2rem;
  color: var(--text-color);
}

.articles-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
}

@media (max-width: 768px) {
  .articles-container {
    padding: 1rem;
  }

  .articles-grid {
    grid-template-columns: 1fr;
  }

  .page-title {
    font-size: 2rem;
  }
}
</style>
