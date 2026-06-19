export const geoService = {
  haversine(pointA, pointB) {
    if (!pointA || !pointB) return null;
    if (pointA.lat === pointB.lat && pointA.lng === pointB.lng) return 0;
    
    const R = 6371; // Earth radius in km
    const dLat = (pointB.lat - pointA.lat) * (Math.PI / 180);
    const dLng = (pointB.lng - pointA.lng) * (Math.PI / 180);
    
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(pointA.lat * (Math.PI / 180)) * Math.cos(pointB.lat * (Math.PI / 180)) * 
      Math.sin(dLng / 2) * Math.sin(dLng / 2);
      
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }
};
