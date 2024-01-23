const fs = require('fs');
const axios = require('axios');

function cat(path) {
    fs.readFile(path, 'utf8', (err, data) => {
        if (err) {
            console.error(`Error reading ${path}:\n  ${err.message}`);
            process.exit(1);
        }
        console.log(data);
    });
}

async function webCat(url) {
    try {
        const response = await axios.get(url);
        console.log(response.data);
    } catch (err) {
        console.error(`Error fetching ${url}:\n  ${err.message}`);
        process.exit(1);
    }
}

const pathOrUrl = process.argv[2];

if (pathOrUrl.startsWith('http://') || pathOrUrl.startsWith('https://')) {
    webCat(pathOrUrl);
} else {
    cat(pathOrUrl);
}
