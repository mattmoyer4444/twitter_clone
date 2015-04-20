/**
 * Created by Matt on 4/4/2015.
 */
var tweets = [
    // tweet objects

    {
        id: '2',
        userId: 'billgates',
        created: 1418212800,
        text: 'Write more code'
    },

    {
        id: '3',
        userId: 'billgates',
        created: 1418288400,
        text: '2 billion people don\'t have a bank account'
    }

];

tweets.sort(function (a, b) {
    if (a.created < b.created) {
        return 1;
    }
    if (a.created > b.created) {
        return -1;
    }
    // a must be equal to b
    return 0;
});

console.log(tweets)