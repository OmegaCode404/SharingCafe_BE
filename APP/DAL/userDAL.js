import { Role, User, UserInterest } from '../utility/DbHelper.js';

export async function getUserDetails(email, password) {
  const user = await User.findOne({
    attributes: [
      'user_id',
      'user_name',
      'password',
      'phone',
      'email',
      'profile_avatar',
      'Bio',
      'registration',
    ],
    include: [
      {
        model: Role,
        attributes: ['role_name'],
        where: {
          role_name: 'USER',
        },
        as: 'UserRole',
      },
    ],
    where: {
      email: email,
      password: password,
    },
    limit: 1,
  });
  console.log(user.dataValues);
  return user;
}

export async function getUser(userId){
  const result = await User.findByPk(userId);
  return result;
}

export async function getInterests(userId){
  const result = await UserInterest.findAll({
    where: {user_id: userId}
  })
  return result;
}

export async function createInterest (userInterestId, userInterestDetails){
  return await UserInterest.create({
    user_interest_id: userInterestId,
    interest_id: userInterestDetails.interest_id,
    user_id: userInterestDetails.user_id
  });
}

export async function getInterest(userInterestId){
  const result = await UserInterest.findByPk(userInterestId);
  return result;
}

export async function updateInterest(userInterest, userInterestDetails){
  await userInterest.update({
    interest_id: userInterestDetails.interest_id
  });
  return userInterest;
}

export async function deleteInterests(interestIds){
  const deletedInterest = await UserInterest.destroy({
    where: { user_interest_id: interestIds },
  });
  return deletedInterest;
}