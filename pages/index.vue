<script setup>
import Main from "~/components/index/Main.vue";
import Portofolio from "~/components/index/Portofolio.vue";
import Articles from "~/components/index/Articles.vue";
import Contact from "~/components/index/Contact.vue";
import ScrollProgress from "~/components/index/ScrollProgress.vue";
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
