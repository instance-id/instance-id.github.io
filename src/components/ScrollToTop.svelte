<script lang="ts">
  let visible = false;

  function handleScroll() {
    visible = window.scrollY > 600;
  }

  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
</script>

<svelte:window on:scroll={handleScroll} />

<button type="button" class:scroll-up-show={visible} class="scroll-up" aria-label="Scroll to top" on:click={scrollToTop}>
  <i class="fa fa-chevron-up"></i>
</button>
