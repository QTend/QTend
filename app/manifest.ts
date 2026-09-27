import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {

  return {

    name: 'QTend - Smart Menu & Restaurant Operations',

    short_name: 'QTend',

    description: 'QR menus, live order tracking, and restaurant dashboard',

    start_url: '/auth/sign-in',

    display: 'standalone',

    background_color: '#000000',

    theme_color: '#F67D26',

    icons: [

      {

        src: '/icons/icon-192x192.png',

        sizes: '192x192',

        type: 'image/png',

        purpose: 'maskable',

      },

      {

        src: '/icons/icon-512x512.png',

        sizes: '512x512',

        type: 'image/png',

        purpose: 'any',

      },

    ],

  };

}