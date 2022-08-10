const events = require('events');
const fs = require('fs');
const readline = require('readline');

async function processLineByLine(fromFile, toFile) {

    const regexOTP = "\\[(.*)\\].*fromPlace=(.*)&toPlace=(.*)&date"
    const output = fs.createWriteStream(toFile, {
        flags: 'a' // 'a' means appending (old data will be preserved)
    })
    const rl = readline.createInterface({
        input: fs.createReadStream(fromFile),
        crlfDelay: Infinity
    });

    rl.on('line', (line) => {
        const match = line.match(regexOTP)
        if (match && match.length > 0) {
            const out = `${match[1]};${match[2]};${match[3]};\n`
            output.write(out)
        }
    });

    await events.once(rl, 'close');

    console.log('Reading file line by line with readline done.');
    const used = process.memoryUsage().heapUsed / 1024 / 1024;
    console.log(`The script uses approximately ${Math.round(used * 100) / 100} MB`);

}
const fromFile = process.argv[2] || "./httprequests.log";
const toFile = process.argv[3]||"out.csv"
processLineByLine(fromFile, toFile);