<script setup lang="ts">
type Articles = {
  title: string;
  description: string;
  image: string;
  link: string;
  tags: string[];
};

const articles: Articles[] = [
  {
    title: "HTTP Framework from scratch tanpa library",
    description:
      "bikin http framework kaya express js atau fiber tanpa library",
    image:
      "https://mohamadrishwan.vercel.app/_next/image?url=https%3A%2F%2Fthingstoday-3f186.web.app%2Fassets%2Fimg%2Fthumbnail%2Fcara-deploy-server-go-ke-cloud-run.png&w=640&q=75",
    link: "https://mohamadrishwan.vercel.app/articles/cara-deploy-server-go-ke-cloud-run",
    tags: ["golang", "http", "backend", "frontend"],
  },
  {
    title: "Bikin script buat download lebih kenceng kaya IDM",
    description: "bikin script kaya IDM pake metode parrarel download",
    image:
      "https://mohamadrishwan.vercel.app/_next/image?url=https%3A%2F%2Fthingstoday-3f186.web.app%2Fassets%2Fimg%2Fthumbnail%2Fcara-deploy-server-go-ke-cloud-run.png&w=640&q=75",
    link: "https://mohamadrishwan.vercel.app/articles/cara-deploy-server-go-ke-cloud-run",
    tags: ["golang", "http", "backend"],
  },
  {
    title: "Nyobain serverless function di netlify pake Go",
    description: "nyoba serverless function di netlify",
    image:
      "https://mohamadrishwan.vercel.app/_next/image?url=https%3A%2F%2Fthingstoday-3f186.web.app%2Fassets%2Fimg%2Fthumbnail%2Fcara-deploy-server-go-ke-cloud-run.png&w=640&q=75",
    link: "https://mohamadrishwan.vercel.app/articles/cara-deploy-server-go-ke-cloud-run",
    tags: ["golang", "http", "backend"],
  },
];
</script>

<template>
  <section id="articles">
    <div>
      <div class="articles-grid">
        <article
          v-for="article in articles"
          :key="article.title"
          class="article-card"
        >
          <img
            :src="article.image"
            :alt="article.title"
            class="article-image"
          />
          <div class="article-content">
            <h3 class="article-title">{{ article.title }}</h3>
            <p class="article-description">{{ article.description }}</p>
            <div class="article-tags">
              <span v-for="tag in article.tags" :key="tag" class="tag">
                {{ tag }}
              </span>
            </div>
          </div>
        </article>
      </div>
      <div class="more-articles">
        <a class="button-link" href="/articles">More Articles</a>
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

.articles-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  width: 100%;
  max-width: 1200px;
  margin-bottom: 2rem;
}

.article-card {
  background-color: var(--card-color);
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
  cursor: pointer;
}

.article-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3);
}

.article-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.article-content {
  padding: 1.5rem;
}

.article-title {
  margin-bottom: 0.5rem;
  color: var(--accent-color);
}

.article-description {
  color: var(--text-color);
  font-size: 0.9rem;
  margin-bottom: 1rem;
}

.article-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.tag {
  background-color: var(--hover-background);
  color: var(--accent-color);
  padding: 0.3rem 0.8rem;
  border-radius: 20px;
  font-size: 0.8rem;
}

.more-articles {
  text-align: center;
  margin-top: 2rem;
}
</style>
