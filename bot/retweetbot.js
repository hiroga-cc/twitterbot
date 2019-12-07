const promisify = require('util').promisify

const Twit = require('twit');
const T = new Twit(require('./config.js'));

const RETWEETED = 'You have already retweeted this Tweet.'

const search = async (query) => {
    const result = await promisify(T.get).bind(T)('search/tweets', query).catch(error => {
        console.log('There was an error with your hashtag search:', error);
    })
    return result.statuses
}

const retweet = async (tweet_id) => {
    return await promisify(T.post).bind(T)('statuses/retweet/' + tweet_id, {}).catch(error => {
        if (error.message == RETWEETED) {
            console.log(RETWEETED, { tweet_id: tweet_id })
        } else {
            console.log('There was an error with Twitter:', error);
        }
    })
}

exports.retweetLatest = async (event, context, callback) => {
    const query = { q: process.env.query, count: 10, result_type: "recent" };
    const statuses = await search(query)
    console.log({ statuses })
    statuses.forEach(async status => {
        const tweet_id = status.id_str
        await retweet(tweet_id)
    })
}
