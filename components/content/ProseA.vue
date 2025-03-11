<script setup lang="ts">
import type { PropType } from "vue";

const props = defineProps({
  href: {
    type: String,
    default: "",
  },
  target: {
    type: String as PropType<
      | "_blank"
      | "_parent"
      | "_self"
      | "_top"
      | (string & object)
      | null
      | undefined
    >,
    default: undefined,
    required: false,
  },
});

type urlType = "twitter" | "youtube" | "other";
type urlMeta = {
  title: string;
  description: string;
  image: string;
  url: string;
};

var type: urlType = "other";
var meta: urlMeta = {
  title: "",
  description: "",
  image: "",
  url: "",
};

// check the type of url using regex
const regex = {
  twitter: /(?:twitter|x)\.com/,
  youtube: /youtube/, // TODO: add more url type later
};
</script>

<template>
  <NuxtLink :href="props.href" :target="props.target">
    <slot />
  </NuxtLink>
</template>

<style scoped></style>
