// Our Twitter library
var Twit = require('twit');

// We need to include our configuration file
var T = new Twit(require('./config.js'));

// This is the URL of a search for the latest tweets on the '@love_prototyper' hashtag.
const query = process.env.query ? process.env.query : "from:love_prototyper"
const mediaArtsSearch = { q: query, count: 10, result_type: "recent" };

// This function finds the latest tweet with the #mediaarts hashtag, and retweets it.
exports.constretweetLatest = (event, context, callback) => {
    T.get('search/tweets', mediaArtsSearch, function (error, data) {
        // log out any errors and responses
        console.log({ error: error, data: data });
        // If our search request to the server had no errors...
        if (!error) {
            console.log(data.statuses)
            // ...then we grab the ID of the tweet we want to retweet...
            var retweetId = data.statuses[0].id_str;
            // ...and then we tell Twitter we want to retweet it!
            T.post('statuses/retweet/' + retweetId, {}, function (error, response) {
                console.log({ error, response })
                if (response) {
                    console.log('Success! Check your bot, it should have retweeted something.')
                }
                // If there was an error with our Twitter call, we print it out here.
                if (error) {
                    console.log('There was an error with Twitter:', error);
                }
            })
        }
        // However, if our original search request had an error, we want to print it out here.
        else {
            console.log('There was an error with your hashtag search:', error);
        }
    });
}
