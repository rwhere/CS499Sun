var request = require('request');
var parseString = require('xml2js').parseString;
const uuidV1 = require('uuid/v1');
const elasticsearch = require('elasticsearch');

var client = new elasticsearch.Client({
    host: 'https://search-elastic-wait-times-kbxk5z6vczn5tucwteldlx4zwe.us-west-2.es.amazonaws.com',
    log: 'info'
});

//feed the data every 20 mins
var timer = function () {
    setInterval(function () {
        fetchWaitingtimes();
    }, 20*60*1000)
};
//do a health check every 19 mins
var timerTwo = function () {
    setInterval(function () {
        healthCheck();
    }, 19*60*1000)
};

var healthCheck = function () {
    client.ping({
        // ping usually has a 3000ms timeout
        requestTimeout: 5000
    }, function (error) {
        if (error) {
            console.trace('elasticsearch cluster is down!');
        } else {
            console.log('All is well');
        }
    });
}

var elasticUpload = function (itemsToUpload) {
    for (var i = 0; i < itemsToUpload.length; ++i) {
        client.create({
            index: '499-a4',
            type: 'rideWaitTime',
            id: uuidV1(),
            body: itemsToUpload[i]
        }, function (error, response) {
            if (error) {
                console.error(error);
            }
        });
    }
    console.log("Elastic upload complete.");
};

function fetchWaitingtimes() {
    request('http://www.universalstudioshollywood.com/waittimes/?type=all&site=USH', function (error, response, body) {
        if (!error && response.statusCode == 200) {
            // console.log(body);
            parseString(body, function (err, result) {
                // console.dir(result.rss.channel[0].item);
                var items = result.rss.channel[0].item;
                var itemsToUpload = [];
                for (var i = 0; i < items.length; ++i) {
                    var attraction = JSON.stringify(items[i].description[0]);
                    if (attraction.match(/(\d+) min/)) {
                        itemsToUpload.push({
                            'title': items[i].title[0],
                            'timestamp': Date.now(),
                            'waittime': attraction.replace(' min', '').replace('"', '').trim()
                        });
                    }
                }
                elasticUpload(itemsToUpload);
            });
        }
    })
}

timer();
timerTwo();
