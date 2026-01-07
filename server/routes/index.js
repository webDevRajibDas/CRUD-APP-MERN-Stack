const express = require('express');
const router = express.Router();

// Routes
const authRoute = require('./auth.route');
const usersRoute = require('./users.route');
const articlesRoute  = require('./articles.route');

// Central route index
const routesIndex = [
    { path: '/auth', route: authRoute },
    { path: '/users', route: usersRoute },
    { path: '/articles', route: articlesRoute }
];

// Check each route before mounting
routesIndex.forEach(({ path, route }) => {
    console.log(`Checking ${path}:`, typeof route);
    if (typeof route !== 'function') {
        console.error(`ERROR: ${path} route is not a function! Value:`, route);
    }
});

// Mount all routes dynamically
routesIndex.forEach(({ path, route }) => {
    router.use(path, route);
});

module.exports = router;
