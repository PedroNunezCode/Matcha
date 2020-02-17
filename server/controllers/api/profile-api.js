const { Profile } = require('../../models/User');
const ObjectID = require('mongoose').Types.ObjectId;

const INTERESTIN_GENDER_LOOKUP = {
    both: { $exists: true },
    men: 'male',
    women: 'female',
};

const toObjectID = (id) => {
    if (ObjectID.isValid(id))
        return ObjectID(id);
    return null;
};

const buildNumberFilter = (values) => {
    return values
        .map((v) => {
            const [gt, ls] = v.split('-').map(Number);
            if (isNaN(gt))
                return null;
            return isNaN(ls) ? { $eq: gt } : { $gte: gt, $lte: ls };
        })
        .filter(v => v !== null);
};

const validSort = (value) => value === -1 || value === 1;

class ProfileAPI {
    constructor(currentProfile, options = {}) {
        this.currentProfile = currentProfile;
        this._schema = Profile;
        this._options = options;

        this._defaultSort = {
            interestMatch: -1,
            fameRating: -1,
            age: 1,
        };
    }

    async list(filters, sort) {
        sort = this._buildSort(sort);
        const query = this._buildQuery(filters);
        const pipeline = this._buildAggregationPipeline(query, sort);

        const profiles = await this._performQuery(pipeline);
        return profiles;
    }

    _buildSort(sort) {
        if (!sort || Object.keys(sort).length === 0)
            return this._defaultSort;

        if (sort.maxDistance)
            this._maxDistance = Number(sort.maxDistance);

        const sortInOrder = {
            distance: null,
            interestMatch: null,
            fameRating: null,
            age: null,
        };
        const orderedSort = Object.assign({}, sortInOrder, sort);

        for (let field in orderedSort)
            if (!validSort(orderedSort[field]))
                delete orderedSort[field];

        if (Object.keys(orderedSort).length === 0)
                return this._defaultSort;
        return orderedSort;
    }

    _buildAggregationPipeline(query, sort) {
        const { interests, location } = this.currentProfile;

        const pipeline = [
            {
                $geoNear: {
                    distanceField: "distance",
                    near: { type: 'Point', coordinates: location.coordinates },
                    maxDistance: this._maxDistance,
                    spherical: true,
                },
            },
            {
                $match: query,
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'profileId',
                    foreignField: '_id',
                    as: 'userInfo',
                },
            },
            {
                $match: {
                    'userInfo.verifiedUser': { $eq: true },
                    profileImage: { $exists: true },
                },
            },
            {
                $addFields: {
                    matchingInterests: {
                        $filter: {
                            input: '$interests',
                            as: 'interest',
                            cond: {
                                $in: ['$$interest', interests],
                            },
                        },
                    },
                },
            },
            {
                $addFields: { interestMatch: { $size: '$matchingInterests' }, },
            },
            {
                $project: {
                    username: 1,
                    firstName: 1,
                    lastName: 1,
                    location: 1,
                    bio: 1,
                    age: 1,
                    fameRating: 1,
                    interests: 1,
                    profileImage: 1,
                    matchingInterests: 1,
                    interestMatch: 1,
                    distance: 1,
                },
            },
            {
                $sort: sort,
            },
        ];

        return pipeline;
    }

    _buildQuery(filters) {
        const {
            _id,
            gender,
            interestedIn,
            likedProfiles,
            dislikedProfiles,
            blockedUsers
        } = this.currentProfile;
        const query = {};
        let porfilesToDisregard = [_id].concat(blockedUsers.map(toObjectID));
        const likedProfilesIds = likedProfiles.map(toObjectID);
        const dislikedProfilesIds = dislikedProfiles.map(toObjectID);

        if (this._options.match)
        {
            porfilesToDisregard =
                porfilesToDisregard.concat(likedProfilesIds, dislikedProfilesIds);
            const interestedInQuery = { $in: ['both'] };
            if (gender === 'male' || gender === 'other')
                interestedInQuery.$in.push('men');
            if (gender === 'female' || gender === 'other')
                interestedInQuery.$in.push('women');

            Object.assign(query, {
                gender: INTERESTIN_GENDER_LOOKUP[interestedIn],
                interestedIn: interestedInQuery,
            });
        }

        if (filters) {
            const { text, age, fameRating, interests } = filters;
            const and = [];

            if (text) {
                const textFilterQuery = [];

                this._schema.schema.eachPath((path, schemaType) => {
                    if (schemaType.options.__textSearchable)
                        textFilterQuery.push({ [`${path}`]: new RegExp(`.*${text}.*`, 'gi') });
                });
                and.push({ $or: textFilterQuery });
            }
            if (interests && interests.length) {
                and.push({ interests: { $elemMatch: { $in: interests }}  });
            }
            if (age && age.length) {
                and.push({ $or: buildNumberFilter(age).map(filter => ({ age: filter })) });
            }
            if (fameRating && fameRating.length) {
                and.push({ $or: buildNumberFilter(fameRating).map(filter => ({ fameRating: filter })) });
            }
            if (and.length > 0)
                query.$and = and;
        }
        Object.assign(query, {
            _id: { $not: { $in: porfilesToDisregard } },
        })
        return query;
    }

    _performQuery(pipeline) {
        return this._schema.aggregate(pipeline).exec();
    }
}

module.exports = ProfileAPI;
