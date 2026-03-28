<script lang="ts">
  export let projects: {
    name: string;
    slug: string;
    category: string;
    platform: string;
    dateDisplay: string;
    image: string;
  }[] = [];

  let activeFilter = 'All Items';

  $: categories = ['All Items', ...new Set(projects.map((project) => project.category))];
  $: visibleProjects =
    activeFilter === 'All Items'
      ? projects
      : projects.filter((project) => project.category === activeFilter);
</script>

<div class="project-gallery">
  <div class="filtering">
    <ul class="project-navigation">
      {#each categories as category}
        <li>
          <button
            type="button"
            class:active={category === activeFilter}
            on:click={() => {
              activeFilter = category;
            }}
          >
            {category}
          </button>
        </li>
      {/each}
    </ul>
  </div>

  <div class="project-grid">
    {#each visibleProjects as project}
      <article class="project-card">
        <a href={`/projects/${project.slug}`} class="project-card__link">
          <div class="project-card__media">
            <img src={project.image.startsWith('/') ? project.image : `/${project.image}`} alt={project.name} loading="lazy" />
          </div>
          <div class="project-card__content">
            <p class="project-card__meta">{project.platform} <span>•</span> {project.category}</p>
            <h3>{project.name}</h3>
            <p class="project-card__date">{project.dateDisplay}</p>
          </div>
        </a>
      </article>
    {/each}
  </div>
</div>
