import * as commonEnums from '../common/CommonEnums.js';
export function checkRole(loginUser, roleName) {
  console.log(loginUser, roleName);
  return loginUser.role === roleName;
}
export function is30minTillTheEventOccur(eventTime) {
  const currentTime = new Date();

  const thirtyMinutesFromNow = new Date(currentTime.getTime() + 30 * 60 * 1000);

  const eventDate = new Date(eventTime);

  return eventDate > currentTime && eventDate <= thirtyMinutesFromNow;
}
export function isMidnightToFourAM() {
  const now = new Date();
  const hours = now.getHours();
  const minutes = now.getMinutes();
  const seconds = now.getSeconds();

  // Check if the current time is between 00:00:00 and 03:59:59
  return hours >= 0 && hours < 4;
}
export function calculateDistance(lat1, lon1, lat2, lon2) {
  const earthRadiusKm = 6371;
  const degToRad = (deg) => deg * (Math.PI / 180);

  const dLat = degToRad(lat2 - lat1);
  const dLon = degToRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(degToRad(lat1)) *
      Math.cos(degToRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return earthRadiusKm * c;
}
export function getValueByLabel(label) {
  const matchTranslate = commonEnums.MATCH_TRANSLATE.find(
    (item) => item.label === label,
  );
  return matchTranslate ? matchTranslate.value : null;
}
