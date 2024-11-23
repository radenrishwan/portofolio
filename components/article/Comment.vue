<script setup lang="ts">
type Theme = "github-light" | "github-dark";

const currentTheme = ref<Theme>("github-light");

const buildComments = (title: string, theme: Theme) => {
  const utterancesContainer = document.querySelector(".comments-section");

  // check if utterances script already exist
  if (document.querySelector(".utterances")) {
    // remove existing script
    utterancesContainer?.removeChild(
      document.querySelector(".utterances") as Node,
    );
  }

  const utterancesScript = document.createElement("script");
  utterancesScript.src = "https://utteranc.es/client.js";
  utterancesScript.setAttribute("repo", "radenrishwan/portofolio");
  utterancesScript.setAttribute("issue-term", title);
  utterancesScript.setAttribute("theme", theme);
  utterancesScript.setAttribute("crossorigin", "anonymous");
  utterancesScript.async = true;

  if (utterancesContainer) {
    utterancesContainer.appendChild(utterancesScript);
  }
};

onMounted(() => {
  // get current theme form root class
  if (document.documentElement.classList.contains("light-mode")) {
    currentTheme.value = "github-light";
  } else {
    currentTheme.value = "github-dark";
  }

  const title = document.querySelector(".article-title")?.textContent;

  buildComments(title || "general", currentTheme.value);
});

// TODO: sync with theme toggle
</script>

<template>
  <ClientOnly>
    <div ref="utterancesContainer"></div>
  </ClientOnly>
</template>
