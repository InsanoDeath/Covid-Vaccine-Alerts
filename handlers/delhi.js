const axios = require("axios")
const sampleUserAgent = [
    'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Mobile Safari/537.36',
    "Mozilla/5.0 (Linux; U; Android 2.3.6; en-us; Nexus S Build/GRK39F) AppleWebKit/533.1 (KHTML, like Gecko) Version/4.0 Mobile Safari/533.1",
    "Mozilla/5.0 (BB10; Touch) AppleWebKit/537.1+ (KHTML, like Gecko) Version/10.0.0.1337 Mobile Safari/537.1+"
]

const X_API_KEY = 'M3NqT3Iycm1NNTJHemhwTUhqREVFMWtwUWVSeHdGRHI0WWNCRWltaQo=';

module.exports = (client, Discord, db) => {

    let xApiKey = '';
    if (typeof Buffer.from === "function") {
        xApiKey = Buffer.from(X_API_KEY, 'base64');
    } else {
        xApiKey = new Buffer(X_API_KEY, 'base64');
    }


    let sent = db.get("sent") || []

    setInterval(() => {
        try {
            db.delete("sent")
        } catch (error) {
            console.log("DB Clear error")
        }
    }, 1000 * 60);

    setInterval(() => {
        let useragent = sampleUserAgent[Math.floor(Math.random() * sampleUserAgent.length)]

        const HEADERS = {
            'Accept': 'application/json',
            'Accept-Language': 'hi_IN',
            'User-Agent': useragent,
            'origin': 'https://www.cowin.gov.in',
            'referer': 'https://www.cowin.gov.in/',
            'cache-control': 'no-cache',
            'x-api-key': xApiKey.toString('ascii').trim()
        };

        const today = new Date().toLocaleDateString()
        const halfreplacedtoday = today.replace("/", "-")
        const replacedtoday = halfreplacedtoday.replace("/", "-")

        const channel = client.channels.cache.get("842699032686100481")

        axios.get(`https://api.demo.co-vin.in/api/v2/admin/location/districts/9`).then((response) => {
            //https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/calendarByDistrict?district_id=141&date=14-05-2021
            for (var i = 0; i < response.data.districts.length; i++) {
                let config = {
                    method: "GET",
                    url: `https://cdn-api.co-vin.in/api/v2/appointment/sessions/calendarByDistrict?district_id=${response.data.districts[i].district_id}&date=${replacedtoday}`,
                    headers: HEADERS
                };
                axios(config).then((res) => {
                    console.log("LOGGED")
                    for (var c = 0; c < res.data.centers.length; c++) {
                        for (var s = 0; s < res.data.centers[c].sessions.length; s++) {
                            if (res.data.centers[c].sessions[s].available_capacity > 50) {
                                if (res.data.centers[c].sessions[s].min_age_limit === 18) {
                                    if (!sent.includes(res.data.centers[c].sessions[s].session_id)) {
                                        let embed = new Discord.MessageEmbed()
                                            .setColor("#0FEDF0")
                                            .setTitle(`For Age Group ${res.data.centers[c].sessions[s].min_age_limit}+ Available in`)
                                            .setDescription(`District: **${res.data.centers[c].district_name}**
                                    Pincode: **${res.data.centers[c].pincode}**
                                    Name: **${res.data.centers[c].name}**
                                    Fee Type: **${res.data.centers[c].fee_type}**
                                    Vaccine: **${res.data.centers[c].sessions[s].vaccine}**
                                    Date: **${res.data.centers[c].sessions[s].date}**
                                    Slots Avaiable: **${res.data.centers[c].sessions[s].available_capacity}**`)
                                            .addField("Register Now", "https://selfregistration.cowin.gov.in/")
                                            .setFooter("Made with love by InsanoDeath#1972 (Sameer Arora)")

                                        if (!sent.includes(res.data.centers[c].sessions[s].session_id)) {
                                            channel.send("<@&842697937359470602>", embed)
                                            db.push("sent", res.data.centers[c].sessions[s].session_id)
                                        }
                                    }
                                }
                            } //else console.log("NOPE")
                        }
                    }
                }).catch((err) => { console.log(`Error: ${err.message}`) })
            }
        }).catch((err) => console.log(err.message))
    }, 1000 * 10);
}