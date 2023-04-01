import { defineConfig } from 'vite';
import Unfonts from 'unplugin-fonts/vite';

export default defineConfig({
  plugins: [
    Unfonts({
      custom: {
        families: [
          {
            name: 'Monocraft',
            local: 'Monocraft',
            src: './public/assets/fonts/Monocraft.ttf',
          },
        ],
        preload: true,
      },
    }),
  ],
});
