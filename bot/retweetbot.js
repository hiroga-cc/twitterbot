// Our Twitter library
const Twit = require('twit');

// We need to include our configuration file
const T = new Twit(require('./config.js'));

const promisify = require('util').promisify

const RETWEETED = 'You have already retweeted this Tweet.'

const search = async (query) => {
    const result = await promisify(T.get)('search/tweets', query).catch(error => {
        console.log('There was an error with your hashtag search:', error);
    })
    return result.statuses
}

const retweet = async (tweet_id) => {
    return await promisify(T.post)('statuses/retweet/' + tweet_id, {}).catch(error => {
        if (error.message == RETWEETED) {
            console.log(RETWEETED)
        } else {
            console.log('There was an error with Twitter:', error);
        }
    })
}

// This function finds the latest tweet with the #mediaarts hashtag, and retweets it.
exports.retweetLatest = (event, context, callback) => {
    const query = { q: process.env.query, count: 10, result_type: "recent" };
    const statuses = search(query)
    statuses.forEach(status => {
        const tweet_id = status.id_str
        retweet(tweet_id)
    })
}
