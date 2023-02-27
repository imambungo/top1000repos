import preprocess from "svelte-preprocess"; // tailwindcss
import adapter from "@sveltejs/adapter-auto"; // https://kit.svelte.dev/docs/adapter-auto


/** @type {import('@sveltejs/kit').Config} */
const config = {
  kit: {
    adapter: adapter(),
  },

  preprocess: [
    preprocess({
      postcss: true,
    }),
  ],
};

export default config;
