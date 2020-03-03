require('dotenv').config()
export default {
  axios: {
    baseURL: process.env.BASE_URL || process.env.URL,
    progress: true,
		proxy: true
  },
  build: {
    extend (config, ctx) {}
  },
  buildModules: [
    '@nuxtjs/vuetify',
		'@nuxtjs/moment'
  ],
  env: {
		apiKey: process.env.apiKey,
		authDomain: process.env.authDomain,
		databaseURL: process.env.databaseURL,
		projectId: process.env.projectId,
		storageBucket: process.env.storageBucket,
		messagingSenderId: process.env.messagingSenderId,
	},
  head: {
    titleTemplate: '%s - ' + process.env.npm_package_name,
    title: process.env.npm_package_name || '',
    meta: [
      { 
        charset: 'utf-8' 
      }, 
      { 
        name: 'viewport', 
        content: 'width=device-width, initial-scale=1' 
      },
      { 
        hid: "Aplikasi Bantu Puskesmas Jayengan",
				name: "Puskesmas Jayengan",
        content: process.env.npm_package_description || '' 
      }
    ],
    link: [
      { 
        rel: 'icon', 
        type: 'image/x-icon', 
        href: '/favicon.ico' 
      }
    ]
  },
  loading: { 
    color: '#fff' 
  },
  mode: 'spa',
  modules: [
    '@nuxtjs/axios',
    '@nuxtjs/pwa',
    '@nuxtjs/dotenv',
    '@nuxtjs/proxy',
		['vue-currency-input/nuxt', { globalOptions: { currency: 'IDR' } }]
  ],
  moment: {
		defaultLocale: 'id',
		locales: ['id']
	},
	plugins: [
		{
			src: '~/plugins/auth',
			ssr: false
		},
	],

  proxy: process.env.NODE_ENV !== 'production' ? {
    '/graphiql': process.env.BACKEND_URL,
		'/graphql': process.env.BACKEND_URL,
  } : {},
	server: {
		host: '0.0.0.0',
		port: 3002
  },
  vuetify: {
		treeShake: true
	}

}
