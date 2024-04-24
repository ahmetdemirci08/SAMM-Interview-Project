const express = require('express');
const fs = require('fs');
const app = express();
const port = 3000;

app.use(express.static('public'));

app.post('/save',  (req, res) => {
    let body = '';
    req.on('data', chunk => {
        body += chunk.toString();
    });
    req.on('end', () => {
        const points =  JSON.parse(body);
        const fileName = `points_${new Date().toISOString().replace(/:/g, '-')}.json`;
        fs.writeFile(`data/${fileName}`, body, err => {
            if (err) {
                console.error(err);
                res.status(500).send('Internal Server Error');
            } else {
                console.log('File saved successfully:', fileName);
                res.status(200).send('File saved successfully');
            }
        });
    });
});

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
