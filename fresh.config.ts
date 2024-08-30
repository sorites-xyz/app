import { FreshConfig } from "$fresh/server.ts";
import { asset } from "$fresh/runtime.ts";

// Use any plugins you want
import { postCssPlugin } from "https://deno.land/x/fresh_plugin_postcss@2.1.0/mod.ts";

export const config = {
  plugins: [
    postCssPlugin({
      // By default, looks for all CSS files in "./static"
      // {exts} and {walkPath} can be left out
      exts: ["css"],
      walkPath: ".",

      // Add your PostCSS plugins
      // {plugins} can be an array or an async function that returns an array
      // I suggest the async function because PostCSS plugins are not needed
      // in production (if you use Fresh's build step)
      async plugins() {
        const [
          { default: cssAutoprefixer },
          { default: cssPresetEnv },
        ] = await Promise.all([
          import("npm:autoprefixer@10.4.19"),
          import("npm:postcss-preset-env@9.5.2"),
        ]);

        return [
          cssAutoprefixer,
          cssPresetEnv,
        ];
      },

      // Pass in {asset} from Fresh's runtime
      // (Not included in the plugin to avoid importing another Fresh version)
      asset,
    }),
  ],
} satisfies FreshConfig;

export default config;
