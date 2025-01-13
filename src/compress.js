const fs = require('fs');
const path = require('path');

const outdir = path.join(__dirname, 'output');
const outfile = path.join(outdir, 'users.json');
const outcompressfile = path.join(outdir, 'users-compress.json');

const users = [];

if (!fs.existsSync(outdir)) {
    fs.mkdirSync(outdir, { recursive: true });
}

// read files in outdir
const files = fs.readdirSync(outdir);

// compress files
for (const file of files) {
    const data = fs.readFileSync(path.join(outdir, file));

    const json = JSON.parse(data.toString());

    users.push(json);

    console.log(`Compressed ${file}`);
}

fs.writeFileSync(outfile, JSON.stringify(users, null, 2));
fs.writeFileSync(outcompressfile, JSON.stringify(users));