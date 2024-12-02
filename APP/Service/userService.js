import { Error } from 'sequelize'
import * as userDAL from '../DAL/userDAL.js'
import * as matchDAL from '../DAL/matchDAL.js'
import * as scheduleDAL from '../DAL/scheduleDAL.js'

import * as commonEnum from '../common/CommonEnums.js'
import * as commonFunctions from '../common/CommonFunctions.js'
import { v4 as uuidv4 } from 'uuid'
import * as firebaseHelper from '../utility/FirebaseHelper.js'
import * as notificationDAL from '../DAL/notificationDAL.js'
import axios from 'axios'

export async function getUserDetails(email, password) {
  return await userDAL.getUserDetails(email, password)
}

export async function updateUserToken(email, token) {
  await userDAL.updateUserToken(email, token)
}

export async function getUserByPhone(phone) {
  return await userDAL.getUserByPhone(phone)
}

export async function getUserByEmail(email) {
  return await userDAL.getUserByEmail(email)
}

export async function register(user) {
  const userId = uuidv4()
  const email = await getUserByEmail(user.email)
  let phone = user.phone
  if (phone != null) {
    phone = await getUserByPhone(user.phone)
  } else if (phone != null || email != null) {
    throw new Error('Email/Phone already in use 😕')
  }
  return await userDAL.register(userId, user)
}

export async function getUser(userId) {
  // return await userDAL.getUserDetailsById(userId);
  var rawResult = await userDAL.getProfile(userId)
  let userProfile = {
    user_id: userId,
    user_name: '',
    profile_avatar: '',
    story: '',
    gender_id: '',
    gender: '',
    age: '',
    purpose: '',
    favorite_location: '',
    address: '',
    dob: '',
    province_id: '',
    province: '',
    district_id: '',
    district: '',
    avg_rating: '',
    interest: [],
    problem: [],
    unlike_topic: [],
    favorite_drink: [],
    free_time: [],
  }

  rawResult.forEach((row) => {
    if (!userProfile.user_name) {
      userProfile = {
        ...userProfile,
        user_name: row.user_name,
        profile_avatar: row.profile_avatar,
        story: row.story,
        gender_id: row.gender_id,
        gender: row.gender,
        age: row.age,
        purpose: row.purpose,
        favorite_location: row.favorite_location,
        address: row.address,
        dob: row.dob,
        province_id: row.province_id,
        province: row.province,
        district_id: row.district_id,
        district: row.district,
        avg_rating: row.avg_rating,
      }
    }

    if (
      row.interest_id &&
      !userProfile.interest.some(
        (interest) => interest.interest_id === row.interest_id
      )
    ) {
      userProfile.interest.push({
        interest_id: row.interest_id,
        interest_name: row.interest_name,
      })
    }

    if (
      row.personal_problem_id &&
      !userProfile.problem.some(
        (problem) => problem.personal_problem_id === row.personal_problem_id
      )
    ) {
      userProfile.problem.push({
        personal_problem_id: row.personal_problem_id,
        problem: row.problem,
      })
    }
    if (
      row.unlike_topic_id &&
      !userProfile.unlike_topic.some(
        (topic) => topic.unlike_topic_id === row.unlike_topic_id
      )
    ) {
      userProfile.unlike_topic.push({
        unlike_topic_id: row.unlike_topic_id,
        topic: row.topic,
      })
    }
    if (
      row.favorite_drink_id &&
      !userProfile.favorite_drink.some(
        (favorite_drink) =>
          favorite_drink.favorite_drink_id === row.favorite_drink_id
      )
    ) {
      userProfile.favorite_drink.push({
        favorite_drink_id: row.favorite_drink_id,
        favorite_drink: row.favorite_drink,
      })
    }
    if (
      row.free_time_id &&
      !userProfile.free_time.some(
        (free_time) => free_time.free_time_id === row.free_time_id
      )
    ) {
      userProfile.free_time.push({
        free_time_id: row.free_time_id,
        free_time: row.free_time,
      })
    }
  })

  return userProfile
}

export async function updateProfile(userId, profile) {
  const user = await getUser(userId)
  if (!user) throw new Error('User not found')
  return await userDAL.updateProfile(userId, profile)
}

export async function upsertInterests(userId, interests) {
  await userDAL.deleteUserInterests(userId)
  const data = interests.map((interest) => ({
    user_id: userId,
    interest_id: interest.interest_id,
  }))
  for (const user of data) {
    await userDAL.upsertInterests(user)
  }
}

export async function upsertUnlikeTopics(userId, unlike_topics) {
  await userDAL.deleteUnlikeTopics(userId)
  const data = unlike_topics.map((unlike_topic) => ({
    user_id: userId,
    topic: unlike_topic.topic,
  }))
  for (const user of data) {
    await userDAL.upsertUnlikeTopics(user)
  }
}

export async function upsertPersonalProblems(userId, personal_problems) {
  await userDAL.deletePersonalProblems(userId)
  const data = personal_problems.map((personal_problem) => ({
    user_id: userId,
    problem: personal_problem.problem,
  }))
  for (const user of data) {
    await userDAL.upsertPersonalProblems(user)
  }
}

export async function upsertFavoriteDrinks(userId, favorite_drinks) {
  await userDAL.deleteFavoriteDrinks(userId)
  const data = favorite_drinks.map((favorite_drink) => ({
    user_id: userId,
    favorite_drink: favorite_drink.favorite_drink,
  }))
  for (const user of data) {
    await userDAL.upsertFavoriteDrinks(user)
  }
}

export async function upsertFreeTimes(userId, free_times) {
  await userDAL.deleteFreeTimes(userId)
  const data = free_times.map((free_time) => ({
    user_id: userId,
    free_time: free_time.free_time,
  }))
  for (const user of data) {
    await userDAL.upsertFreeTimes(user)
  }
}

export async function updateAvatar(userId, fileData) {
  const user = await getUser(userId)
  if (!user) throw new Error('User not found')
  return await userDAL.updateAvatar(userId, fileData)
}

export async function createInterest(userInterestDetails) {
  const user_interest_id = uuidv4()
  return await userDAL.createInterest(user_interest_id, userInterestDetails)
}

export async function getInterests(userId) {
  return await userDAL.getInterests(userId)
}

export async function getInterest(userInterestId) {
  return await userDAL.getInterest(userInterestId)
}

export async function updateInterest(userInterestId, userInterestDetails) {
  const userInterest = await getInterest(userInterestId)
  if (!userInterest) throw new Error('User Interest not found')
  return await userDAL.updateInterest(userInterest, userInterestDetails)
}

export async function deleteInterest(interestIds) {
  return await userDAL.deleteInterests(interestIds)
}
export async function getUserInfoById(userId) {
  const result = await userDAL.getUserDetailsById(userId)
  return result
}
export async function getUserInfoByEmail(email) {
  const result = await userDAL.getUserDetailsByEmail(email)
  return result
}
export async function getUserMatchByInterest(
  userId,
  filterByAge,
  filterByGender,
  filterByAddress
) {
  const result = await userDAL.getUserMatchByInterest(
    userId,
    filterByAge,
    filterByGender,
    filterByAddress
  )
  return result
}
export async function getUserMatchWithStatus(userId, status) {
  const result = await userDAL.getUserMatchWithStatus(userId, status)
  return result
}

export async function countUserByStatus() {
  const result = await matchDAL.countUserByStatus()
  return result
}

export async function getUserMatchWithPendingStatus(userId) {
  const result = await userDAL.getUserMatchWithPendingStatus(userId)
  return result
}
export async function getUserMatchByInterestPaging(
  userId,
  filterByAge,
  filterByGender,
  filterByAddress,
  limit,
  offset
) {
  const [user] = await userDAL.getUserInfoById(userId)
  let result = await userDAL.getUserMatchByInterestPaging(
    userId,
    filterByAge,
    filterByGender,
    filterByAddress,
    limit,
    offset
  )
  result = result.map((e) => {
    return {
      ...e,
      distance: commonFunctions.calculateDistance(
        e.lat,
        e.lng,
        user.lat,
        user.lng
      ),
    }
  })
  const list = await userDAL.getUserMatchByInterest(
    userId,
    filterByAge,
    filterByGender,
    filterByAddress
  )
  return { total: list.length, limit, offset, data: result }
}

export async function getMyEvents(userId) {
  return await userDAL.getMyEvents(userId)
}

export async function getEventsByInterest(interestId) {
  return await userDAL.getEventsByInterest(interestId)
}

export async function getBlogsByInterest(interestId) {
  return await userDAL.getBlogsByInterest(interestId)
}

export async function getSuggestEvent(userId) {
  return await userDAL.getSuggestEvent(userId)
}
export async function updateUserMatchStatus(userId, dataObj) {
  const [userCurrent] = await userDAL.getUserInfoById(userId)
  const [userLiked] = await userDAL.getUserInfoById(dataObj.user_id)
  const status = await matchDAL.getMatchStatus()
  const [match] = await matchDAL.getMatchCouple(userId, dataObj.user_id)
  console.log(match)
  const upsertOnly = !match
  const user_match_id = match ? match.user_match_id : uuidv4()
  const statusStage =
    !match && dataObj.status
      ? status.filter(
          (e) => e.user_match_status === commonEnum.MATCH_STATUS.PENDING
        )[0]
      : match && dataObj.status
      ? status.filter(
          (e) => e.user_match_status === commonEnum.MATCH_STATUS.MATCHED
        )[0]
      : status.filter(
          (e) => e.user_match_status === commonEnum.MATCH_STATUS.DISLIKE
        )[0]
  console.log(statusStage)
  await matchDAL.upsertMatch(
    user_match_id,
    userId,
    dataObj.user_id,
    statusStage.user_match_status_id,
    upsertOnly
  )

  const title = `TÍNH NĂNG KẾT NỐI`
  const bodyCurrent = `Bạn ${commonFunctions.getValueByLabel(
    statusStage.user_match_status
  )} với ${userLiked.user_name}`
  const bodyLike = `Bạn ${commonFunctions.getValueByLabel(
    statusStage.user_match_status
  )} bởi ${userCurrent.user_name}`

  const [newNotificationStatus] =
    await notificationDAL.getNotificationNewStatus()

  await notificationDAL.createNotification(
    userId,
    bodyCurrent,
    newNotificationStatus.notification_status_id
  )
  await notificationDAL.createNotification(
    dataObj.user_id,
    bodyLike,
    newNotificationStatus.notification_status_id
  )
  firebaseHelper.sendNotification(userLiked.token_id, title, bodyLike)
  firebaseHelper.sendNotification(userCurrent.token_id, title, bodyCurrent)

  return await matchDAL.getMatchCouple(userId, dataObj.user_id)
}

export async function updateLocation(userId, lat, lng) {
  return await userDAL.updateLocation(userId, lat, lng)
}

export async function getTokenId(userId) {
  return await userDAL.getTokenId(userId)
}

export async function getLocation(userId) {
  return await userDAL.getLocationByUserId(userId)
}

export async function getDistance(
  originsLAT,
  originsLNG,
  destinationsLAT,
  destinationsLNG
) {
  const apiKey = 'KnB6OOmQcQpYSTnqzYhjqUmcGSBKUob1cDF9oOPw'
  const response = await axios.get(
    `https://rsapi.goong.io/DistanceMatrix?origins=${originsLAT},${originsLNG}&destinations=${destinationsLAT},${destinationsLNG}&vehicle=bike&api_key=${apiKey}`
  )
  if (response.status == 200) {
    return response.data.rows[0].elements[0].distance.text
  } else {
    return null
  }
}

//get profile
export async function getProfile(userId, currentUserId) {
  var currentUserLocation = await userDAL.getLocationByUserId(currentUserId)
  var userLocation = await userDAL.getLocationByUserId(userId)
  var distance = await commonFunctions.calculateDistance(
    userLocation.lat,
    userLocation.lng,
    currentUserLocation.lat,
    currentUserLocation.lng
  )
  var rawResult = await userDAL.getProfile(userId)
  let userProfile = {
    user_id: userId,
    user_name: '',
    profile_avatar: '',
    story: '',
    gender: '',
    age: '',
    purpose: '',
    favorite_location: '',
    address: '',
    dob: '',
    province: '',
    district: '',
    avg_rating: '',
    distance: distance,
    interest: [],
    problem: [],
    unlike_topic: [],
    favorite_drink: [],
    free_time: [],
  }

  rawResult.forEach((row) => {
    if (!userProfile.user_name) {
      userProfile = {
        ...userProfile,
        user_name: row.user_name,
        profile_avatar: row.profile_avatar,
        story: row.story,
        gender: row.gender,
        age: row.age,
        purpose: row.purpose,
        favorite_location: row.favorite_location,
        address: row.address,
        dob: row.dob,
        province: row.province,
        district: row.district,
        avg_rating: row.avg_rating,
      }
    }

    if (
      row.interest_id &&
      !userProfile.interest.some(
        (interest) => interest.interest_id === row.interest_id
      )
    ) {
      userProfile.interest.push({
        interest_id: row.interest_id,
        interest_name: row.interest_name,
      })
    }

    if (
      row.personal_problem_id &&
      !userProfile.problem.some(
        (problem) => problem.personal_problem_id === row.personal_problem_id
      )
    ) {
      userProfile.problem.push({
        personal_problem_id: row.personal_problem_id,
        problem: row.problem,
      })
    }
    if (
      row.unlike_topic_id &&
      !userProfile.unlike_topic.some(
        (topic) => topic.unlike_topic_id === row.unlike_topic_id
      )
    ) {
      userProfile.unlike_topic.push({
        unlike_topic_id: row.unlike_topic_id,
        topic: row.topic,
      })
    }
    if (
      row.favorite_drink_id &&
      !userProfile.favorite_drink.some(
        (favorite_drink) =>
          favorite_drink.favorite_drink_id === row.favorite_drink_id
      )
    ) {
      userProfile.favorite_drink.push({
        favorite_drink_id: row.favorite_drink_id,
        favorite_drink: row.favorite_drink,
      })
    }
    if (
      row.free_time_id &&
      !userProfile.free_time.some(
        (free_time) => free_time.free_time_id === row.free_time_id
      )
    ) {
      userProfile.free_time.push({
        free_time_id: row.free_time_id,
        free_time: row.free_time,
      })
    }
  })

  return userProfile
}

export async function getMiniUser(userId) {
  var rawResult = await userDAL.getUserToken(userId)
  return rawResult
}

export async function getProvince() {
  return await userDAL.getProvince()
}

export async function getUserBlockedByUser(userId) {
  return await userDAL.getUserBlockedByUser(userId)
}
export async function blockingAUser(userId, blockedId) {
  // const [userCurrent] = await userDAL.getUserInfoById(userId);
  // const [userLiked] = await userDAL.getUserInfoById(blockedId);
  const status = await matchDAL.getMatchStatus()
  const [match] = await matchDAL.getMatchCouple(userId, blockedId)
  console.log(match)
  const upsertOnly = !match
  const user_match_id = match ? match.user_match_id : uuidv4()
  const statusStage =
    !match &&
    status.filter(
      (e) => e.user_match_status === commonEnum.MATCH_STATUS.DISLIKE
    )[0]
  console.log(statusStage)
  await matchDAL.upsertMatch(
    user_match_id,
    userId,
    blockedId,
    statusStage.user_match_status_id,
    upsertOnly
  )
  await scheduleDAL.canceledSchedule(userId, blockedId)
  return await userDAL.blockingAUser(userId, blockedId)
}

export async function unBlockingAUser(userId, blockedId) {
  return await userDAL.unBlockingAUser(userId, blockedId)
}

export async function getUserFilterSetting(userId) {
  return await userDAL.getUserFilterSetting(userId)
}

export async function upsertUserFilterSetting(userId, dataObj) {
  await userDAL.upsertUserFilterSetting(userId, dataObj)
}
export async function getUserByFilterSetting(
  interest_ids,
  userId,
  limit,
  offset
) {
  return await userDAL.getUserByFilterSetting(
    interest_ids,
    userId,
    limit,
    offset
  )
}

export async function getGender() {
  return await userDAL.getGender()
}
