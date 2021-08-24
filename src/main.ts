import App from './App.svelte';

const app = new App({
  target: document.body,
  props: {
      latestImageURL: "http://136.159.57.131/weatherimages/lastimage",
  },
});

export default app;
