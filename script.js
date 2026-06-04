const { createApp } = Vue;

createApp({
  data() {
    return {
      status: 'Site upgrade in progress',
      highlights: [
        {
          icon: '🛠️',
          title: 'Rebuilding',
          copy: 'A cleaner personal site is being assembled piece by piece.'
        },
        {
          icon: '🧪',
          title: 'Experimenting',
          copy: 'Future updates will include small web experiments and project notes.'
        },
        {
          icon: '🪐',
          title: 'Orbiting',
          copy: 'The page is temporary, but the vibe is already from Mars.'
        }
      ]
    };
  }
}).mount('#app');
