export default defineNuxtConfig({
    app: {
        head: {
            title: 'Sales Admin | KOLINGO',
            titleTemplate: '%s | KOLINGO',
            htmlAttrs: {
                lang: 'en',
            },
            meta: [
                { charset: 'utf-8' },
                {
                    name: 'viewport',
                    content: 'width=device-width, initial-scale=1, maximum-scale=1, shrink-to-fit=no',
                },
                { hid: 'description', name: 'description', content: 'KOLINGO' },
                { name: 'format-detection', content: 'telephone=no' },
            ],
            link: [
                { rel: 'icon', type: 'image/x-icon', href: '/favicon.png' },
                {
                    rel: 'stylesheet',
                    href: 'https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;600;700;800&display=swap',
                },
            ],
        },
    },

    css: ['~/assets/css/app.css'],
    postcss: {
        plugins: {
            tailwindcss: {},
            autoprefixer: {},
        },
    },
    modules: ['@pinia/nuxt', '@nuxtjs/i18n', '@element-plus/nuxt', '@ant-design-vue/nuxt'],
    i18n: {
        locales: [{ code: 'en', file: 'en.json' }],
        lazy: true,
        defaultLocale: 'en',
        strategy: 'no_prefix',
        langDir: 'locales/',
    },
    vite: {
        optimizeDeps: { include: ['quill'] },
    },
    runtimeConfig: {
        public: {
            baseURL: process.env.BASE_URL,
        },
    },
});
