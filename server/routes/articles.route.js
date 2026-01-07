const express = require('express');
const router = express.Router();

router.get('/articles', (req, res) => {
    console.log(res.json({ message: 'Articles API working' }))
    res.json({ message: 'Articles API working' });
});

module.exports = router;