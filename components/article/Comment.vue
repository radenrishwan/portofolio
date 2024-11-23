<script setup>
onMounted(() => {
  const title = document.querySelector(".article-title").textContent;

  const utterancesScript = document.createElement("script");
  utterancesScript.src = "https://utteranc.es/client.js";
  utterancesScript.setAttribute("repo", "radenrishwan/portofolio");
  utterancesScript.setAttribute("issue-term", title || "General");
  utterancesScript.setAttribute("theme", "github-light");
  utterancesScript.setAttribute("crossorigin", "anonymous");
  utterancesScript.async = true;

  const utterancesContainer = document.querySelector(".comments-section");
  if (utterancesContainer) {
    utterancesContainer.appendChild(utterancesScript);
  }
});
</script>

<template>
  <ClientOnly>
    <div ref="utterancesContainer"></div>
  </ClientOnly>
</template>
