/**
 * Compares two location objects
 * @param {Object} l1 First location
 * @param {Object} l2 Second location
 */
const locationsEqual = (l1, l2) => {
    return l1 && l2 &&
        l1.name === l2.name &&
        l1.coordinates && l2.coordinates &&
        l1.coordinates[0] === l2.coordinates[0] &&
        l1.coordinates[1] === l2.coordinates[1];
};

module.exports = {
    locationsEqual,
};
