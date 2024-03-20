import { SequelizeInstance } from '../utility/DbHelper.js';

export async function getMatchStatus(status) {
  const sqlQuery = `
    SELECT * FROM user_match_status WHERE user_match_status = :status
  `;

  const result = await SequelizeInstance.query(sqlQuery, {
    replacements: { status },
    type: SequelizeInstance.QueryTypes.SELECT,
    raw: true,
  });

  return result;
}
export async function upsertMatch(matchId, userId, userId2, statusId) {
  console.log(matchId, userId, userId2, statusId);
  const sqlQuery = `
    INSERT INTO public.user_match (user_match_id, current_user_id, user_id_liked, user_match_status_id, created_at) 
    VALUES (:user_match_id, :current_user_id, :user_id_liked, :user_match_status_id, NOW())
    ON CONFLICT (user_match_id) -- Assuming user_match_id is the primary key
    DO UPDATE SET 
        user_match_status_id = :user_match_status_id, -- Update user_match_status_id
        created_at = NOW() -- Update created_at timestamp
    RETURNING *;
  `;

  const result = await SequelizeInstance.query(sqlQuery, {
    replacements: {
      user_match_id: matchId,
      current_user_id: userId,
      user_id_liked: userId2,
      user_match_status_id: statusId,
    },
    type: SequelizeInstance.QueryTypes.SELECT,
    raw: true,
  });

  return result;
}

export async function getMatchCouple(userId, userId2) {
  const sqlQuery = `
    SELECT 
      user_match_id, 
      current_user_id, 
      user_id_liked, 
      user_match_status_id, 
      created_at 
    FROM 
      public.user_match
    WHERE 
      (current_user_id = :userId AND user_id_liked = :userId2)
      OR (current_user_id = :userId2 AND user_id_liked = :userId)
  `;

  const result = await SequelizeInstance.query(sqlQuery, {
    replacements: { userId, userId2 },
    type: SequelizeInstance.QueryTypes.SELECT,
    raw: true,
  });

  return result;
}
