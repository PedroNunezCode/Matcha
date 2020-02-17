## Matcha - MERN Stack Online Dating website with messaging.

### Build the project

To build the matcha project you need to run two different development servers and install their dependencies.

```
$ cd client && npm install
$ cd server && npm install
```

Once you install all the dependencies you need to separately run the two development servers:

```
$ cd client && npm run start
$ cd server && nodemon index.js
```

Before the application fully works you also need to update the dev.js file inside of the server/config directory.
You will need to create a [MongoAtlas Database](https://www.mongodb.com/cloud/atlas), create a [AWS S3 Account](https://aws.amazon.com/free/storage/?sc_channel=PS&sc_campaign=acquisition_US&sc_publisher=google&sc_medium=ACQ-P%7CPS-GO%7CBrand%7CDesktop%7CSU%7CStorage%7CS3%7CUS%7CEN%7CText&sc_content=s3_e&sc_detail=aws%20s3&sc_category=Storage&sc_segment=293617570035&sc_matchtype=e&sc_country=US&s_kwcid=AL!4422!3!293617570035!e!!g!!aws%20s3&ef_id=Cj0KCQiA7aPyBRChARIsAJfWCgJdI-H7ml_rNY9a8VT0uC6jv4tHrJmgCdV264rKPky52riKPpLpMaQaAvGiEALw_wcB:G:s) for image uploads, and finally link your gmail to send out emails to the users that sign up. Once you do all of this you will be able to use the whole application and even host it if you'd like.

### Landing Page
[landingPage](MatchaImages/LandingPage.png)
### Matcha Homepage
[MatchaPage](MatchaImages/index.png)
