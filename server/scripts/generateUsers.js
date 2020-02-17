/* eslint-disable */
const faker = require('faker');
const Promise = require('bluebird');
const mongoose = require('mongoose');
const minimist = require('minimist');

const config = require('../config');
const { User, Profile } = require('../models/User');

const cities = require('./uscities.json');
const bayAreaFilter = ['San Fancisco', 'Mountain View', 'Fremont', 'Newark', 'Oakland', 'San Jose', 'Palo Alto'];
const bayAreaCities = cities.filter(c => bayAreaFilter.includes(c.city) && c.state_name === 'California');

const usage = `usage: node generateUsers.js --amount <number> [--local]
    --amount - Amount of users to generate
    --local - Generate local users only(from Bay Area)`;
const params = minimist(process.argv.slice(2));

const generateUserName = () => {
    let username = faker.internet.userName();
    if (params.local)
        return `local_${username}`;
    return username;
};

const generateLocation = () => {
    const citiPull = params.local ? bayAreaCities : cities;
    const city = faker.random.arrayElement(citiPull);

    return {
        name: `${city.city}, ${city.state_name}`,
        coordinates: [city.lng, city.lat],
    };
};

const generateUser = () => {
    const user = {
        username: generateUserName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
        verifiedUser: true,
        dateJoined: faker.date.past(),
    };
    console.log('Generated new user');
    console.log(user);
    return user;
};

const generateUserProfile = (user) => {
    const interestsCount = faker.random.number({ min: 5, max: 10 });
    const profile = {
        profileId: user._id,
        username: user.username,
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        age: faker.random.number({ min: 18, max: 50 }),
        gender: faker.random.arrayElement(['male', 'female', 'other']),
        interestedIn: faker.random.arrayElement(['men', 'women', 'both']),
        fameRating: faker.random.number({ min: 0, max: 100 }),
        interests: Array.from(Array(interestsCount)).map(() => faker.random.word()),
        profileImage: faker.image.avatar(),
        profileImage0: faker.image.avatar(),
        profileImage1: faker.image.avatar(),
        profileImage2: faker.image.avatar(),
        profileImage3: faker.image.avatar(),
        bio: faker.hacker.phrase(),
        location: generateLocation(),
    };
    return profile;
};

const generateUsers = (amount) => {
    console.log(`Generating ${amount} users`);
    const users = Array.from(Array(amount)).map(generateUser);
    return Promise.each(users, saveUser);
};

const saveUser = async (user) => {
    const userInDb = await (new User(user)).save();
    const profile = generateUserProfile(userInDb);
    console.log(profile);
    const profileInDb = await (new Profile(profile)).save();
    userInDb.profile = profileInDb._id;
    await userInDb.save();
};

const amount = Number(params.amount);

if (isNaN(amount) || amount <= 0) {
    console.log(`Invalid amount: ${amount}`);
    console.log(usage);
    process.exit();
}

if (params.local)
    console.log('Generating local users!');

Promise
.each([
    () => mongoose.connect(config.DB_URI),
    () => generateUsers(amount),
    () => mongoose.disconnect(),
], (f) => f())
.catch((err) => console.log(err));
