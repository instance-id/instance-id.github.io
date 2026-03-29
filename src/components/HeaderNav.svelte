<script lang="ts">
  import { onMount } from 'svelte';

  export let items: {
    label: string;
    href: string;
    children?: { label: string; href: string }[];
  }[] = [];

  export let socialLinks: {
    label: string;
    href: string;
    iconClass: string;
  }[] = [];

  export let variant: 'overlay' | 'sticky' | 'page' = 'sticky';
  export let observeSections = false;

  let mobileOpen = false;
  let activeHref = '';

  function isHashLink(href: string) {
    return href.startsWith('#') || href.startsWith('/#');
  }

  function normalizeHash(href: string) {
    const hashIndex = href.indexOf('#');
    return hashIndex >= 0 ? href.slice(hashIndex) : href;
  }

  function updateActiveFromHash() {
    if (window.location.hash) {
      activeHref = window.location.hash;
    }
  }

  function closeMobileMenu() {
    mobileOpen = false;
  }

  $: navClass = `site-nav site-nav--${variant}`;
  $: innerClass = `site-nav__inner ${variant === 'overlay' ? 'site-nav__inner--full' : 'shell'}`;

  function setupObservers() {
    if (!observeSections || typeof window === 'undefined') {
      return;
    }

    const sectionIds = items
      .map((item) => normalizeHash(item.href))
      .filter((href) => href.startsWith('#'))
      .map((href) => href.slice(1));

    const sections = sectionIds
      .map((id) => document.getElementById(id))
      .filter(Boolean) as HTMLElement[];

    if (!sections.length) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntries = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        if (!visibleEntries.length) {
          return;
        }

        activeHref = `#${visibleEntries[0].target.id}`;
      },
      {
        rootMargin: '-20% 0px -60% 0px',
        threshold: [0.15, 0.35, 0.6],
      },
    );

    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }

  onMount(() => {
    updateActiveFromHash();

    const cleanup = setupObservers();

    return () => {
      cleanup?.();
    };
  });
</script>

<svelte:window on:hashchange={updateActiveFromHash} />

<div class={navClass}>
  <div class={innerClass}>
    <!-- <div class="site-nav__brand">
      <a href="/#home">instance.id</a>
    </div> -->

    <nav class="site-nav__desktop" aria-label="Primary">
      <ul>
        {#each items as item}
          <li class:has-children={Boolean(item.children?.length)}>
            <a
              href={item.href}
              class:active={isHashLink(item.href) ? normalizeHash(item.href) === activeHref : false}
            >
              <span class="site-nav__label">{item.label}</span>
            </a>
            {#if item.children?.length && variant !== 'overlay'}
              <div class="site-nav__dropdown-trigger">
                <button class="site-nav__caret-trigger" type="button" aria-label={`Show ${item.label} links`}>
                  <span class="site-nav__caret" aria-hidden="true">▾</span>
                </button>
                <ul class="site-nav__dropdown">
                  {#each item.children as child}
                    <li>
                      <a href={child.href}>{child.label}</a>
                    </li>
                  {/each}
                </ul>
              </div>
            {:else if item.children?.length}
              <ul class="site-nav__dropdown">
                {#each item.children as child}
                  <li>
                    <a href={child.href}>{child.label}</a>
                  </li>
                {/each}
              </ul>
            {/if}
          </li>
        {/each}
      </ul>
    </nav>

    <div class="site-nav__social">
      {#each socialLinks as social}
        <a href={social.href} target="_blank" rel="noreferrer" aria-label={social.label}>
          <i class={social.iconClass}></i>
        </a>
      {/each}
    </div>

    <button
      class="site-nav__toggle"
      type="button"
      aria-label="Toggle menu"
      aria-expanded={mobileOpen}
      on:click={() => {
        mobileOpen = !mobileOpen;
      }}
    >
      <span></span>
      <span></span>
      <span></span>
    </button>
  </div>

  <div class:site-nav__mobile-open={mobileOpen} class="site-nav__mobile">
    <nav aria-label="Mobile">
      <ul>
        {#each items as item}
          <li>
            <a href={item.href} on:click={closeMobileMenu}>{item.label}</a>
            {#if item.children?.length}
              <ul class="site-nav__mobile-children">
                {#each item.children as child}
                  <li>
                    <a href={child.href} on:click={closeMobileMenu}>{child.label}</a>
                  </li>
                {/each}
              </ul>
            {/if}
          </li>
        {/each}
      </ul>
      <div class="site-nav__mobile-social">
        {#each socialLinks as social}
          <a href={social.href} target="_blank" rel="noreferrer" aria-label={social.label}>
            <i class={social.iconClass}></i>
          </a>
        {/each}
      </div>
    </nav>
  </div>
</div>
