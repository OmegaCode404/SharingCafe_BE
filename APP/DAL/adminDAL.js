import { Role, SequelizeInstance, User, Blog, Event } from '../utility/DbHelper.js';

export async function getAdmDetails(email, password) {
  const user = await User.findOne({
    attributes: [
      'user_id',
      'user_name',
      'password',
      'phone',
      'email',
      'profile_avatar',
      'story',
      'registration',
      'gender',
      'age',
      'purpose',
      'favorite_location',
      'lat',
      'lng',
      'address',
      'token_id',
    ],
    include: [
      {
        model: Role,
        attributes: ['role_name'],
        where: {
          role_name: 'ADMIN',
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
export async function getStatics() {
  const sqlQuery = `
    SELECT 'Account' AS entity_type, COUNT(*) AS entity_count
    FROM public.user
    UNION
    SELECT 'Blog' AS entity_type, COUNT(*) AS entity_count
    FROM blog
    UNION
    SELECT 'Event' AS entity_type, COUNT(*) AS entity_count
    FROM event
    union 
   	select 'Total Matched' as entity_type, count(um.user_match_id) 
   	from user_match um 
   	join user_match_status ums 
   	 on um.user_match_status_id = ums.user_match_status_id
   	where ums.user_match_status = 'Accepted'
    `;
  const statics = await SequelizeInstance.query(sqlQuery, {
    type: SequelizeInstance.QueryTypes.SELECT,
    raw: true,
  });
  return statics;
}
export async function getUsers() {
  const sqlQuery = `
  SELECT 
    u.*,
    json_agg(
        json_build_object(
            'interest_id', ui.interest_id,
            'interest_name', ui.name
        )
      ) AS interest_list
  FROM 
      public."user" u 
  INNER JOIN 
      (SELECT * FROM role WHERE role_name = 'USER') r ON u.role_id = r.role_id
  LEFT JOIN 
      (
          SELECT 
              ui.user_id,
              ui.interest_id,
              i.name
          FROM 
              user_interest ui 
          INNER JOIN 
              interest i ON i.interest_id = ui.interest_id
          ORDER BY 
              ui.user_id, ui.interest_id  
      ) ui ON ui.user_id = u.user_id
  GROUP BY 
      u.user_id, u.role_id; 
  `;
  const result = await SequelizeInstance.query(sqlQuery, {
    type: SequelizeInstance.QueryTypes.SELECT,
    raw: true,
  });
  return result;
}

export async function getUser(userId) {
  const result = await User.findByPk(userId);
  return result;
}

export async function updateUserStatus(userId, userDetails) {
  return await User.update(
    {
      is_available: userDetails.is_available,
    },
    {
      where: { user_id: userId },
    },
  );
}

export async function updateBlogStatus(blogId, blogDetails) {
  return await Blog.update(
    {
      is_approve: blogDetails.is_approve,
    },
    {
      where: { blog_id: blogId },
    },
  );
}

export async function updateEventStatus(eventId, eventDetails) {
  return await Event.update(
    {
      is_approve: eventDetails.is_approve,
    },
    {
      where: { event_id: eventId },
    },
  );
}

export async function getEventStatics() {
  const sqlQuery = `
  SELECT 
  EXTRACT(YEAR FROM time_of_event) AS event_year,
  EXTRACT(MONTH FROM time_of_event) AS event_month,
  COUNT(*) AS event_count
FROM 
  public."event"
GROUP BY 
  event_year, event_month
ORDER BY 
  event_year, event_month;
    `;
  const statics = await SequelizeInstance.query(sqlQuery, {
    type: SequelizeInstance.QueryTypes.SELECT,
    raw: true,
  });
  return statics;
}