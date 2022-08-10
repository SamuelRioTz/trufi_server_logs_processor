const events = require('events');
const fs = require('fs');
const nReadlines = require('n-readlines');

const AsyncFunction = (async () => { }).constructor;
const processFileLineByLine = async (fromFile, toFile, onLine, header) => {
    const broadbandLines = new nReadlines(fromFile);

    const output = fs.createWriteStream(toFile, { flags: 'a' })
    output.write(header)
    let line;

    while (line = broadbandLines.next()) {
        line = line.toString('ascii')
        let toWrite
        if (onLine instanceof AsyncFunction) {
            toWrite = await onLine(line).catch(error => {
                console.log(error)
                return null
            })
        } else {
            toWrite = onLine(line)
        }
        if (toWrite) output.write(toWrite)
    }
}
module.exports = processFileLineByLine