export const siteMeta = {
  title: 'instance.id',
  description: 'Indie Game Developer',
  siteUrl: 'https://instance.id',
  author: 'instance.id',
};

export const featuredProjectLinks = [
  { label: 'ProStream', href: '/projects/prostream' },
  { label: 'Searcher', href: '/projects/searcher' },
];

export const homeNavItems = [
  { label: 'Home', href: '#home' },
  { label: 'About', href: '#about' },
  { label: 'Contact', href: '#contact' },
  { label: 'Projects', href: '#projects' /*, children: featuredProjectLinks */ },
];

export const siteNavItems = [
  { label: 'Home', href: '/#home' },
  { label: 'About', href: '/#about' },
  { label: 'Contact', href: '/#contact' },
  { label: 'Projects', href: '/#projects', children: featuredProjectLinks },
];

export const socialLinks = [
  { label: 'Twitter', href: 'https://twitter.com/instance_id', iconClass: 'fa fa-twitter' },
  { label: 'GitHub', href: 'https://github.com/instance-id', iconClass: 'fa fa-github' },
];

export const hero = {
  backgroundImage: '/images/backgrounds/full-nav-bg.png',
};

export const about = {
  title: 'ABOUT US',
  contentHtml:
    'Welcome to instance.id. <br> We love making neat stuff. From tools and addons for popular content creation packages and game engines to games and short-films in the Unity game engine.',
  image: '/images/backgrounds/square-1024x585.png',
};

export const recentProjects = [
  {
    name: 'ProStream',
    href: '/projects/prostream',
    company: 'Unity',
    duration: '2020-Current',
    content: 'Unity DOTS/ECS world streaming toolkit',
  },
  {
    name: 'Searcher',
    href: '/projects/searcher',
    company: 'Houdini',
    duration: '2020',
    content: 'Houdini search addon',
  },
  {
    name: 'Verifier',
    company: 'Discord Bot',
    duration: '2018-2019',
    content: 'Unity asset verification bot',
  },
  {
    name: 'Repentence',
    company: 'Unity',
    duration: '2019',
    content: 'Paladin Cinematic',
  },
  {
    name: 'Busy_Richard',
    company: 'Unity',
    duration: '2019',
    content: 'Paladin Cinematic',
  },
];

export const skills = [
  { name: 'C#/.Net', percentage: 95 },
  { name: 'Python', percentage: 90 },
  { name: 'Rust', percentage: 90 },
  { name: 'Golang', percentage: 85 },
  { name: 'Dart/Flutter', percentage: 70 },
];

export const services = [
  {
    name: 'Performance Oriented Game Development',
    image: '/images/icons/Game-Development.png',
  },
  {
    name: 'Optimized Software and Tool Development',
    image: '/images/icons/monitor-keyboard.png',
  },
  {
    name: 'IAC (Infrastructure as Code) Management',
    image: '/images/icons/infrastructure.png',
  },
];

export const contact = {
  title: 'Contact',
  backgroundImage: '/images/backgrounds/contactus.png',
};

export const footer = {
  copyright: 'Copyright © 2026 instance.id',
};
