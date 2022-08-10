const processFileLineByLine = require('./processFileLineByLine');

const fromFile = process.argv[2] || "./httprequests.log";
const toFile = process.argv[3] || "out.csv"

processFileLineByLine(fromFile, toFile, (line) => {
    let out = null
    const regexOTP = "\\[(.*)\\].*fromPlace=(.*)&toPlace=(.*)&date"
    const match = line.match(regexOTP)
    if (match && match.length > 0) {
        out = `${match[1]};${match[2]};${match[3]};\n`
    }
    return out
}, "date;fromPlace;toPlace\n")