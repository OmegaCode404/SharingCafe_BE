import { Interest } from '../utility/DbHelper.js';

export async function getInterests() {
  const interests = await Interest.findAll();
  return interests;
}
export async function getInterest(interestId) {
  const interest = await Interest.findOne({
    where: { interest_id: interestId },
  });
  return interest;
}

export async function createInterest(interestDetails) {
  const interests = await Interest.create(interestDetails);
  return interests;
}
export async function updateInterest(interest, interestDetail) {
  await interest.update({
    name: interestDetail.name,
  });
}
export async function deleteInterests(interestIds) {
  const deletedInterest = await Interest.destroy({
    where: { interest_id: interestIds },
  });
  return deletedInterest;
}
