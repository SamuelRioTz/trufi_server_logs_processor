const axios = require('axios');
const processFileLineByLine = require('./processFileLineByLine');

const fromFile = process.argv[2] || "./old_server_logs.csv";
const toFile = process.argv[3] || "out.csv"

processFileLineByLine(
    fromFile,
    toFile,
    async (line) => {
        const values = line.split(";")
        const fromPlace = values[1]
        const toPlace = values[2]
        const response = await axios({
            method: 'get',
            url: `http://localhost:8090/otp/routers/default/plan?fromPlace=${fromPlace}&toPlace=${toPlace}&date=03-01-2022&time=12%3A00%3A00&numItineraries=5&mode=TRANSIT%2CWALK`,
            headers: {}
        })
        const itinerary = response.data?.plan?.itineraries[0]
        let transits = 0
        let route = ""
        if (itinerary) {
            for (const leg of itinerary.legs) {
                route = `${route}->${leg.mode}`
                if (leg.mode != "WALK") {
                    route = `${route}(${leg.route})`
                    transits++
                }
            }
        }
        let out = `${line}${transits};${route}\n`
        return out
    }, "date;fromPlace;toPlace;transits;route\n")