import {
  Role,
  SequelizeInstance,
  User,
  Blog,
  Event,
} from '../utility/DbHelper.js'

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
      'gender_id',
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
  })
  console.log(user.dataValues)
  return user
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
   select 'Matched Succeed' as entity_type, count(um.user_match_id) 
   from user_match um 
   join user_match_status ums 
    on um.user_match_status_id = ums.user_match_status_id
   where ums.user_match_status = 'Matched'
   union 
   select 'Matched Failed' as entity_type, (count(case when ums.user_match_status = 'Dislike' then 1 end) + count(case when ums.user_match_status = 'Declined' then 1 end))
   from user_match um 
   join user_match_status ums 
    on um.user_match_status_id = ums.user_match_status_id
    UNION
  SELECT 'Schedule' AS entity_type, COUNT(*) AS entity_count
  FROM schedule
    `
  const statics = await SequelizeInstance.query(sqlQuery, {
    type: SequelizeInstance.QueryTypes.SELECT,
    raw: true,
  })
  return statics
}
export async function getUsers({ page, size }) {
  const sqlQuery = `
  SELECT 
    u.user_id,
    u.user_name,
    u.phone,
    u.email,
    u.profile_avatar,
    u.story,
    u.registration,
    u.is_available,
    u.purpose,
    u.favorite_location,
    DATE_PART('year', AGE(current_date, u.dob)) AS age,
    u.lat,
    u.lng,
    u.token_id, 
    g.gender, d.district, p.province,
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
  LEFT JOIN 
    gender g ON g.gender_id = u.gender_id
  LEFT JOIN
    district d ON d.district_id = u.district_id
  LEFT JOIN
    province p ON p.province_id = u.province_id
  GROUP BY 
      u.user_id, u.role_id, g.gender, d.district, p.province
  ORDER BY
      u.registration desc
  ${page && size ? ` limit ${page}, ${(page - 1) * size}` : ''}
  `
  const result = await SequelizeInstance.query(sqlQuery, {
    type: SequelizeInstance.QueryTypes.SELECT,
    raw: true,
  })
  return result
}

export async function getUser(userId) {
  const result = await User.findByPk(userId, {
    attributes: { exclude: ['password'] },
  })
  return result
}

export async function updateUserStatus(userId, userDetails) {
  return await User.update(
    {
      is_available: userDetails.is_available,
    },
    {
      where: { user_id: userId },
    }
  )
}

export async function updateBlogStatus(blogId, blogDetails) {
  return await Blog.update(
    {
      is_approve: blogDetails.is_approve,
    },
    {
      where: { blog_id: blogId },
    }
  )
}

export async function updateEventStatus(eventId, eventDetails) {
  return await Event.update(
    {
      is_approve: eventDetails.is_approve,
    },
    {
      where: { event_id: eventId },
    }
  )
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
    `
  const statics = await SequelizeInstance.query(sqlQuery, {
    type: SequelizeInstance.QueryTypes.SELECT,
    raw: true,
  })
  return statics
}

export async function getScheduleList() {
  const sqlQuery = `
  select 
  s.schedule_id , 
  u.user_name as sender, 
  u2.user_name as receiver, 
  s."content" , 
  s."location" , 
  s.schedule_time ,
  s.is_accept,
  s.created_at,
  coalesce(jsonb_agg(
    jsonb_build_object(
    'rating_id', r.rating_id ,
    'user_id', u.user_id ,
    'user_name', u.user_name ,
    'content', r."content"  ,
    'rating', r.rating
    ) 
  ) FILTER (WHERE r.rating_id IS NOT NULL), '[]') as rating
  from schedule s
  LEFT JOIN
    rating r 
    on r.schedule_id = s.schedule_id
  left join 
    "user" u 
    on u.user_id = s.sender_id
  left join 
    "user" u2
    on u2.user_id = s.receiver_id
  left join
    "user" u3 
    on r.user_id = u3.user_id
  group by s.schedule_id, u.user_name, u2.user_name
  order by s.created_at desc
    `
  const list = await SequelizeInstance.query(sqlQuery, {
    type: SequelizeInstance.QueryTypes.SELECT,
    raw: true,
  })
  return list
}

export async function getBlogStatics() {
  const sqlQuery = `
  SELECT 
  EXTRACT(YEAR FROM created_at) AS blog_year,
  EXTRACT(MONTH FROM created_at) AS blog_month,
  COUNT(*) AS blog_count
FROM 
  public."blog"
GROUP BY 
  blog_year, blog_month
ORDER BY 
  blog_year, blog_month;
    `
  const statics = await SequelizeInstance.query(sqlQuery, {
    type: SequelizeInstance.QueryTypes.SELECT,
    raw: true,
  })
  return statics
}
