import preprocess from "svelte-preprocess"; // tailwindcss
//import adapter from "@sveltejs/adapter-auto"; // https://kit.svelte.dev/docs/adapter-auto
import adapter from '@sveltejs/adapter-static'; // https://kit.svelte.dev/docs/adapter-static


/** @type {import('@sveltejs/kit').Config} */
const config = {
  kit: {
    adapter: adapter({
      // these are the options: https://kit.svelte.dev/docs/adapter-static#options
      pages: 'build', // default
      assets: 'build', // default
      fallback: null, // default
      precompress: false, // default. consider to true when needed
      strict: true // default
    }),
  },

  preprocess: [
    preprocess({
      postcss: true,
    }),
  ],
};

export default config;
