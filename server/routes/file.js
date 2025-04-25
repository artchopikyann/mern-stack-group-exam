const express = require('express');
const path = require('path');
const router = express.Router();
const fs = require('fs');

router.get('/:filename', (req, res) => {
    const filename = req.params.filename;
    const filePath = path.join(__dirname, '../controllers/uploads', filename);

    // console.log(filename);
    // console.log(filePath);

    if (!fs.existsSync(filePath)) {
        return res.status(404).json({ error: 'File not found' });
    }

    res.download(filePath, filename, (err) => {
        if (err) {
            res.status(404).json({ error: 'File not found' });
        }
    });
});

module.exports = router;
