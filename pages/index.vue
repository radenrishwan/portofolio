<script setup>
import Main from "~/components/index/Main.vue";
import Portofolio from "~/components/index/Portofolio.vue";
import Articles from "~/components/index/Articles.vue";
import Contact from "~/components/index/Contact.vue";
import ScrollProgress from "~/components/index/ScrollProgress.vue";
import Timeline from "~/components/index/Timeline.vue";

useSeoMeta({
  title: "Raden Mohamad Rishwan",
  description:
    "Personal portfolio website of Raden Mohamad Rishwan, showcasing projects, articles, and timeline.",
  ogTitle: "Raden Mohamad Rishwan",
  ogDescription:
    "Personal portfolio website of Raden Mohamad Rishwan, showcasing projects, articles, and timeline.",
  ogImage: "https://i.ibb.co.com/gWjmQ8q/logo.png",
  ogUrl: "https://mohamadrishwan.me",
  twitterCard: "summary_large_image",
  twitterTitle: "Raden Mohamad Rishwan",
  twitterDescription:
    "Personal portfolio website of Raden Mohamad Rishwan, showcasing projects, articles, and timeline.",
  twitterImage: "https://i.ibb.co.com/gWjmQ8q/logo.png",
  twitterCreator: "@seioraswel",
  author: "Raden Mohamad Rishwan",
  keywords:
    "Raden Mohamad Rishwan, Rishwan, Raden, Mohamad, Portfolio, Personal, Website, Projects, Articles, Timeline, Web Development, Mobile Development, Backend, Frontend",
});
</script>

<template>
  <AppBar />
  <ScrollProgress />
  <div class="scroll-container">
    <section class="scroll-section">
      <Main />
    </section>
    <section class="scroll-section">
      <Portofolio />
    </section>
    <section class="scroll-section">
      <Articles />
    </section>
    <section class="scroll-section">
      <Timeline />
    </section>
    <section class="scroll-section">
      <Contact />
    </section>
  </div>
</template>

<style>
.scroll-container {
  height: 100dvh;
  overflow-y: scroll;
  scroll-snap-type: y mandatory;
}

.scroll-section {
  height: 100dvh;
  scroll-snap-align: start;
}

@media (max-width: 768px) {
  .scroll-container {
    scroll-snap-type: none;
  }

  .scroll-section {
    scroll-snap-align: none;
  }
}
</style>
