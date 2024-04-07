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
