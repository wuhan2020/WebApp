module.exports = {
    globDirectory: 'dist/',
    globPatterns: ['**/*.{css,js,ico,gif,png,jpg,jpeg,webp}'],
    swDest: 'dist/sw.js',
    importScripts: [
        'https://cdn.jsdelivr.net/npm/workbox-sw@6.0.2/build/workbox-sw.min.js'
    ]
};
