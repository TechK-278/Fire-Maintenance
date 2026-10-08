function calculateDistance(lat1, lon1, lat2, lon2) {
    const toRad = (value) => (value * Math.PI) / 180;
    const R = 6371;

    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);

    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRad(lat1)) *
        Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;

    return Number(distance.toFixed(2));
}

function findNearestTechnician(orgLat, orgLon, technicians) {
    if (!technicians || technicians.length === 0) {
        return null;
    }

    let nearest = null;
    let minDistance = Infinity;

    for (const tech of technicians) {
        const dist = calculateDistance(
            Number(orgLat),
            Number(orgLon),
            Number(tech.latitude),
            Number(tech.longitude)
        );

        if (dist < minDistance) {
            minDistance = dist;
            nearest = {
                ...tech,
                distance: dist
            };
        }
    }

    return nearest;
}

module.exports = {
    calculateDistance,
    findNearestTechnician
};
