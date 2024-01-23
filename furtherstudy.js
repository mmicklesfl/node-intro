const fs = require('fs');
const axios = require('axios');

function handleOutput(data, outputFile) {
    if (outputFile) {
        fs.appendFile(outputFile, data + '\n', 'utf8', (err) => {
            if (err) {
                console.error(`Couldn't write to ${outputFile}:\n  ${err.message}`);
                process.exit(1);
            }
        });
    } else {
        console.log(data);
    }
}

function cat(path, outputFile) {
    fs.readFile(path, 'utf8', (err, data) => {
        if (err) {
            console.error(`Error reading ${path}:\n  ${err.message}`);
            process.exit(1);
        }
        handleOutput(data, outputFile);
    });
}

async function webCat(url, outputFile) {
    try {
        const response = await axios.get(url);
        handleOutput(response.data, outputFile);
    } catch (err) {
        console.error(`Error fetching ${url}:\n  ${err.message}`);
        process.exit(1);
    }
}

let outputFile;
let paths = [];
if (process.argv[2] === '--out') {
    outputFile = process.argv[3];
    paths = process.argv.slice(4);
} else {
    paths = process.argv.slice(2);
}

(async () => {
    for (let pathOrUrl of paths) {
        if (pathOrUrl.startsWith('http://') || pathOrUrl.startsWith('https://')) {
            await webCat(pathOrUrl, outputFile);
        } else {
            cat(pathOrUrl, outputFile);
        }
    }
})();
