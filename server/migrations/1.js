const mongo = require('mongodb');
const config = require('../config');

const defaultLocation = {
    name: 'Fremont, California',
    coordinates: [37.4718, -121.92],
}

let mongoClient = null;

mongo.connect(config.DB_URI, { useNewUrlParser: true })
    .then((client) => {
        const profiles = client.db('test').collection('profiles');

        mongoClient = client;
        return profiles.updateMany({}, {
            $set: {
                location: defaultLocation,
            }
        });
    })
    .then(() => console.log('migration #1 has been run'))
    .catch(err => console.error(err))
    .finally(() => mongoClient ? mongoClient.close() : 0);
