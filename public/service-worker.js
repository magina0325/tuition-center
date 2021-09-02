var cacheName = 'beyond-tuition-center';
var filesToCache = [
    /* html pages */
    '/',
    "/pages/contact/contact.html",
    "/pages/course-detail/course-detail.html",
    "/pages/courses/courses.html",
    "/pages/favorite-courses/favorite-courses.html",
    '/index.html',
    "/pages/tutors/tutors.html",

    /* css */
    '/style.css',

    /* images */
        /* about */
    "/images/about/about-header.jpg",
    "/images/about/member.jpg",
        /* app-icon */
    "/images/app-icon/icon-128x128.png",
    "/images/app-icon/icon-192x192.png",
    "/images/app-icon/icon-256x256.png",
    "/images/app-icon/icon-384x384.png",
    "/images/app-icon/icon-512x512.png",
        /* call-to-action */
    "/images/call-to-action/call-to-action-bg.jpg",
    "/images/call-to-action/call-to-action-bg-2.jpg",
        /* client-logo */
    "/images/client-logo/clients-1.jpg",
    "/images/client-logo/clients-2.jpg",
    "/images/client-logo/clients-3.jpg",
        /* courses */
    "/images/courses/account.jpg",
    "/images/courses/english.jpg",
    "/images/courses/math.jpg",
    "/images/courses/science.jpg",
        /* notification_icons */
    "/images/notification_icons/checkmark.png",
    "/images/notification_icons/notification-flat.png",
    "/images/notification_icons/xmark.png",
        /* slider */
    "/images/slider/call-to-action-bg.jpg",
    "/images/slider/slider-bg-1.jpg",
    "/images/slider/slider-bg-2.jpg",
    "/images/slider/slider-bg-3.jpg",
        /* team */
    "/images/team/member-1.jpg",
    "/images/team/member-2.jpg",
    "/images/team/member-3.jpg",
        /* miscellaneous */
    "/images/logo.png",
    "/images/logo-white.png",
    "/images/favicon.png",

    /* js */
    "/pages/contact/script.js",
    "/pages/course-detail/script.js",
    "/pages/courses/script.js",
    "/pages/favorite-courses/script.js",
    "/index.js",
    '/script.js',

    /* plugins */
    "/plugins/animate/animate.css",

    "/plugins/bootstrap/css/bootstrap.min.css",
    "/plugins/bootstrap/js/bootstrap.min.js",
    "/plugins/bootstrap/js/bootstrap.min.js.map",

    "/plugins/filterizr/jquery.filterizr.min.js",

    "/plugins/form-validation/jquery.form.js",
    "/plugins/form-validation/jquery.validate.min.js",

    "/plugins/jquery/jquery.min.js",

    "/plugins/lightbox2/dist/css/lightbox.css",
    "/plugins/lightbox2/dist/css/lightbox.min.css",
    "/plugins/lightbox2/dist/images/close.png",
    "/plugins/lightbox2/dist/images/loading.gif",
    "/plugins/lightbox2/dist/images/next.png",
    "/plugins/lightbox2/dist/images/prev.png",
    "/plugins/lightbox2/dist/js/lightbox-plus-jquery.js",
    "/plugins/lightbox2/dist/js/lightbox-plus-jquery.min.js",
    "/plugins/lightbox2/dist/js/lightbox-plus-jquery.min.map",
    "/plugins/lightbox2/dist/js/lightbox.js",
    "/plugins/lightbox2/dist/js/lightbox.min.js",
    "/plugins/lightbox2/dist/js/lightbox.min.map",

    "/plugins/mixitup/mixitup.min.js",

    "/plugins/parallax/jquery.parallax-1.1.3.js",

    "/plugins/slick/fonts/slick.eot",
    "/plugins/slick/fonts/slick.svg",
    "/plugins/slick/fonts/slick.ttf",
    "/plugins/slick/fonts/slick.woff",
    "/plugins/slick/ajax-loader.gif",
    "/plugins/slick/slick.css",
    "/plugins/slick/slick.min.js",

    "/plugins/smooth-scroll/smooth-scroll.min.js",

    "/plugins/themefisher-font/fonts/themefisher-font.eot",
    "/plugins/themefisher-font/fonts/themefisher-font.ttf",
    "/plugins/themefisher-font/fonts/themefisher-font.woff",
    "/plugins/themefisher-font/style.css",

    /* scss */
        /* templates */
        "/scss/templates/_404.scss",
        "/scss/templates/_about_us.scss",
        "/scss/templates/_blog.scss",
        "/scss/templates/_call-to-action.scss",
        "/scss/templates/_contact.scss",
        "/scss/templates/_counter.scss",
        "/scss/templates/_footer.scss",
        "/scss/templates/_header.scss",
        "/scss/templates/_hero-area.scss",
        "/scss/templates/_navigation.scss",
        "/scss/templates/_portfolio.scss",
        "/scss/templates/_pricing.scss",
        "/scss/templates/_services.scss",
        "/scss/templates/_single-post.scss",
        "/scss/templates/_skills.scss",
        "/scss/templates/_team.scss",
        "/scss/templates/_testimonials.scss",
        /* miscellaneous */
    "/scss/_color.scss",
    "/scss/_common.scss",
    "/scss/_responsive.scss",
    "/scss/_typography.scss",
    "/scss/_variables.scss",
    "/scss/style.scss",

];

/* Start the service worker and cache all of the app's content */
self.addEventListener('install', function (e) {
    e.waitUntil(
        caches.open(cacheName).then(function (cache) {
            return cache.addAll(filesToCache);
        })
    );
});

/* Serve cached content when offline */
self.addEventListener('fetch', function (e) {
    e.respondWith(
        caches.match(e.request).then(function (response) {
            return response || fetch(e.request);
        })
    );
});


self.addEventListener('notificationclick', e => {
    const notification = e.notification;
    const action = e.action;

    if (action !== 'close') {
        clients.openWindow(action);
    }
    notification.close();
});