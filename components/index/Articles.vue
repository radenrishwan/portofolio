<script setup lang="ts">
// @ts-ignore
const { data: articles } = await useAsyncData("articles", () => {
  // @ts-ignore
  return queryContent().sort({ pubDate: -1 }).limit(3).find();
});
</script>

<template>
  <section id="articles">
    <div class="articles-container">
      <div class="articles-grid" v-if="articles">
        <ArticleCard
          v-for="article in articles"
          :key="article._id"
          :article="article"
        />
      </div>
      <div class="more-articles">
        <NuxtLink to="/articles" class="button-link">More Articles</NuxtLink>
      </div>
    </div>
  </section>
</template>

<style scoped>
#articles {
  min-height: 100dvh;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.articles-container {
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
}

.articles-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
}

.more-articles {
  text-align: center;
  margin-top: 2rem;
}

@media (max-width: 768px) {
  #articles {
    padding: 1rem;
  }

  .articles-grid {
    grid-template-columns: 1fr;
  }
}
</style>
