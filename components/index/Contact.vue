<template>
  <section id="contact">
    <h1>You can reach me on.</h1>
    <ul>
      <li>
        <a href="https://github.com/radenrishwan">
          https://github.com/radenrishwan
        </a>
      </li>
      <li><a href="https://x.com/seioraswel">https://x.com/seioraswel</a></li>
      <li>
        <a href="mailto:radenrishwan@gmail.com">radenrishwan@gmail.com</a>
      </li>
    </ul>
  </section>
</template>

<style scoped>
#contact {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100dvh;
  box-sizing: border-box;
  width: 100dvw;
  padding: 2rem;
  text-align: center;
}

h1 {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 2rem;
  color: var(--text-color);
}

ul {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

a {
  color: var(--accent-color);
  text-decoration: none;
  font-size: 1.2rem;
  transition: all 0.3s ease;
  display: inline-block;
}

a:hover {
  color: var(--primary-color);
  transform: translateX(10px) scale(1.1);
}

a {
  transform-origin: center;
}

@media (max-width: 768px) {
  #contact {
    min-height: auto;
    padding: 2rem 1rem;
  }

  h1 {
    font-size: 2rem;
  }

  a {
    font-size: 1rem;
  }
}

@media (max-width: 480px) {
  h1 {
    font-size: 1.75rem;
  }
}
</style>
