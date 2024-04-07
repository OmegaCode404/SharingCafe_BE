import { SequelizeInstance } from '../utility/DbHelper.js';

export async function getMatchStatus() {
  const sqlQuery = `
    SELECT * FROM user_match_status 
  `;

  const result = await SequelizeInstance.query(sqlQuery, {
    type: SequelizeInstance.QueryTypes.SELECT,
    raw: true,
  });

  return result;
}
export async function upsertMatch(
  matchId,
  userId,
  userId2,
  statusId,
  upsertOnly,
) {
  console.log(matchId, userId, userId2, statusId);
  let sqlQuery = '';
  if (upsertOnly)
    sqlQuery = `
    INSERT INTO public.user_match (user_match_id, current_user_id, user_id_liked, user_match_status_id, created_at) 
    VALUES (:user_match_id, :current_user_id, :user_id_liked, :user_match_status_id, NOW())
    ON CONFLICT (user_match_id)
    DO UPDATE SET 
        user_match_status_id = :user_match_status_id, 
        created_at = NOW()
    RETURNING *;
  `;
  else
    sqlQuery = `UPDATE public.user_match 
                   SET user_match_status_id=:user_match_status_id
                   , created_at=now() 
                   WHERE user_match_id=:user_match_id`;

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
      ums.*
    FROM 
      public.user_match um
      inner join user_match_status ums 
        on ums.user_match_status_id  = um.user_match_status_id 
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
export async function countUserByStatus() {
  const sqlQuery = `
   SELECT current_user_id as user_id, user_match_status, COUNT(*) AS status_count
FROM user_match um
INNER JOIN user_match_status ums ON um.user_match_status_id = ums.user_match_status_id
GROUP BY user_match_status, current_user_id
union
SELECT user_id_liked as user_id, user_match_status, COUNT(*) AS status_count
FROM user_match um
INNER JOIN user_match_status ums ON um.user_match_status_id = ums.user_match_status_id
GROUP BY user_match_status, user_id_liked
  `;

  const result = await SequelizeInstance.query(sqlQuery, {
    type: SequelizeInstance.QueryTypes.SELECT,
    raw: true,
  });

  return result;
}
