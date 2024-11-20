<script setup>
import Main from "~/components/index/Main.vue";
import Portofolio from "~/components/index/Portofolio.vue";
import Articles from "~/components/index/Articles.vue";
</script>

<template>
  <AppBar />
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
</style>
