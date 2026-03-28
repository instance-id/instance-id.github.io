<script lang="ts">
  import { onMount } from 'svelte';

  export let skills: { name: string; percentage: number }[] = [];

  let visible = false;
  let rootElement: HTMLElement;

  onMount(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          visible = true;
          observer.disconnect();
        }
      },
      { threshold: 0.2 },
    );

    if (rootElement) {
      observer.observe(rootElement);
    }

    return () => observer.disconnect();
  });
</script>

<div class="skill-progress-bar" bind:this={rootElement}>
  {#each skills as skill}
    <div class="skill-progress">
      <div class="skill-progress__meta">
        <span class="skillbar-title">{skill.name}</span>
        <span class="skill-bar-percent">{skill.percentage}%</span>
      </div>
      <div class="skillbar">
        <div class="skillbar-bar" style={`width: ${visible ? skill.percentage : 0}%`}></div>
      </div>
    </div>
  {/each}
</div>
