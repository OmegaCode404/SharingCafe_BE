import dayjs from 'dayjs'
import {
  Event,
  SequelizeInstance,
  EventParticipation,
} from '../utility/DbHelper.js'

export async function getEvents(title, date, page, size) {
  let sqlQuery = ''
  let name = title
  if (name == null) {
    name = ''
  }
  let date1 = new Date(date)
  if (date1 == 'Invalid Date') {
    date1 = new Date('1/1/1000')
  }
  if (page) {
    sqlQuery = `
    select 
      e.*, u.user_name, i.name
    from
      public."event" e 
    left join 
      interest i 
      on 1=1 
      and e.interest_id = i.interest_id
    join
      "user" u
      on u.user_id = e.organizer_id
    where ${
      date
        ? `(e.time_of_event >= '${date1.toUTCString()}' or e.end_of_event <= '${date1.toUTCString()}') and `
        : `e.time_of_event >= '${new dayjs()
            .subtract(7, 'day')
            .format(
              'YYYY-MM-DD HH:mm:ss'
            )}' and (e.time_of_event <= '${new dayjs()
            .add(7, 'day')
            .format('YYYY-MM-DD 23:59:59')} or e.end_of_event <= '${new dayjs()
            .add(7, 'day')
            .format('YYYY-MM-DD 23:59:59')}')' and`
    } e.title like '%${name}%'
    order by e.created_at desc
    offset ((${page} - 1) * 5) rows 
  `
  } else {
    sqlQuery = `
    select 
      e.*, u.user_name, i.name
    from
      public."event" e 
    left join 
      interest i 
      on 1=1 
      and e.interest_id = i.interest_id
    join
      "user" u
      on u.user_id = e.organizer_id
    where ${
      date1
        ? `(e.time_of_event >= '${date1.toUTCString()}' or e.end_of_event <= '${date1.toUTCString()}') and `
        : ''
    } e.title  like '%${name}%'
    order by e.created_at desc
    `
  }
  const result = await SequelizeInstance.query(sqlQuery, {
    type: SequelizeInstance.QueryTypes.SELECT,
    raw: true,
  })
  return result
}

export async function getEvent(eventId) {
  const sqlQuery = `
  select 
    e.*, u.user_id, u.user_name, i.name, e.title
  from
    public."event" e 
  left join 
    interest i 
    on 1=1 
    and e.interest_id = i.interest_id
  join
    "user" u
    on e.organizer_id = u.user_id
  where e.event_id = '${eventId}'
  `
  const result = await SequelizeInstance.query(sqlQuery, {
    type: SequelizeInstance.QueryTypes.SELECT,
    raw: true,
  })
  return result
}
export async function createEvent(eventId, dataObj) {
  return await Event.create({
    event_id: eventId,
    organizer_id: dataObj.organizer_id,
    title: dataObj.title,
    description: dataObj.description,
    time_of_event: dataObj.time_of_event,
    end_of_event: dataObj.end_of_event,
    location: dataObj.location,
    address: dataObj.address,
    background_img: dataObj.background_img,
    is_approve: true,
    interest_id: dataObj.interest_id,
    is_visible: true,
    participants_count: 0,
  })
}

export async function updateImage(fileData) {
  return await {
    background_img: fileData?.path,
  }
}

export async function updateEvent(eventId, eventDetails) {
  return await Event.update(
    {
      organizer_id: eventDetails.organizer_id,
      interest_id: eventDetails.interest_id,
      title: eventDetails.title,
      description: eventDetails.description,
      time_of_event: eventDetails.time_of_event,
      end_of_event: eventDetails.end_of_event,
      location: eventDetails.location,
      participants_count: eventDetails.participants_count,
      interest_id: eventDetails.interest_id,
      background_img: eventDetails.background_img,
      address: eventDetails.address,
      is_visible: eventDetails.is_visible,
    },
    {
      where: { event_id: eventId },
    }
  )
}

export async function deleteEvent(eventId) {
  const deletedEvent = await Event.destroy({
    where: { event_id: eventId },
  })
  return deletedEvent
}

export async function getNewEvents() {
  const date = new Date(Date.now())
  const sqlQuery = `
  select 
    e.event_id, e.title, e.background_img, e.time_of_event, e.address, e.participants_count, e.end_of_event, e.created_at
  from
    public."event" e 
  left join 
    interest i 
    on 1=1 
    and e.interest_id = i.interest_id
  join
    "user" u
    on u.user_id = e.organizer_id
    where (e.time_of_event >= '${date.toUTCString()}' or e.end_of_event >= '${date.toUTCString()}') and e.is_approve = true and e.is_visible = true
    and not exists (
      select 1
      from public.user_block
      where (blocker_id = u.user_id and blocked_id = e.organizer_id)
          or (blocker_id = e.organizer_id and blocked_id = u.user_id)
    )
  order by e.created_at desc
  `
  const result = await SequelizeInstance.query(sqlQuery, {
    type: SequelizeInstance.QueryTypes.SELECT,
    raw: true,
  })
  return result
}

export async function getEventsByDate(dateString) {
  const date = new Date(dateString.date)
  const sqlQuery = `
  select 
    e.event_id, e.title, e.background_img, e.time_of_event, e.address, e.participants_count, e.end_of_event
  from
    public."event" e 
  left join 
    interest i 
    on 1=1 
    and e.interest_id = i.interest_id
  join
    "user" u
    on u.user_id = e.organizer_id
    where e.time_of_event >= '${date.toDateString()}'
    and not exists (
      select 1
      from public.user_block
      where (blocker_id = u.user_id and blocked_id = e.organizer_id)
          or (blocker_id = e.organizer_id and blocked_id = u.user_id)
    )
  order by e.time_of_event
  `
  const result = await SequelizeInstance.query(sqlQuery, {
    type: SequelizeInstance.QueryTypes.SELECT,
    raw: true,
  })
  return result
}

export async function getEventsByName(dataObj) {
  let name = dataObj.title
  if (name == null) {
    name = ''
  }
  let date1 = new Date(dataObj.date)
  if (date1 == 'Invalid Date') {
    date1 = new Date('1/1/1000')
  }
  const sqlQuery = `
  select 
    e.*, u.user_name, i."name"
  from
    public."event" e 
  left join 
    interest i 
    on 1=1 
    and e.interest_id = i.interest_id
  join
    "user" u
    on u.user_id = e.organizer_id
  where (e.time_of_event >= '${date1.toUTCString()}' or e.end_of_event <= '${date1.toUTCString()}') and e.title  like '%${name}%'
  and not exists (
    select 1
    from public.user_block
    where (blocker_id = u.user_id and blocked_id = e.organizer_id)
        or (blocker_id = e.organizer_id and blocked_id = u.user_id)
  )
  `
  const result = await SequelizeInstance.query(sqlQuery, {
    type: SequelizeInstance.QueryTypes.SELECT,
    raw: true,
  })
  return result
}

export async function getPopularEvents() {
  let date = new Date(Date.now())
  const sqlQuery = `
  select 
	e.event_id 
    , e.title
    , e.background_img
    , e.time_of_event
    , e.address
    , e.participants_count
    , e.end_of_event
    , u.user_name
    , i.name 
  from
    public."event" e 
  left join 
    interest i 
    on 1=1 
    and e.interest_id = i.interest_id
  join
    "user" u
    on u.user_id = e.organizer_id
  where e.end_of_event >= '${date.toISOString()}' and e.is_approve = true and e.is_visible = true
  and not exists (
    select 1
    from public.user_block
    where (blocker_id = u.user_id and blocked_id = e.organizer_id)
        or (blocker_id = e.organizer_id and blocked_id = u.user_id)
  )
  order by 
    e.time_of_event desc
    , e.participants_count desc
  limit 10
  `
  const result = await SequelizeInstance.query(sqlQuery, {
    type: SequelizeInstance.QueryTypes.SELECT,
    raw: true,
  })
  return result
}
export async function getEventOccurToday() {
  const sqlQuery = `
SELECT 
  e.event_id, 
  e.organizer_id, 
  e.title, 
  e.description as body, 
  e.time_of_event, 
  e."location", 
  e.participants_count, 
  e.is_approve, 
  e.created_at, 
  e.background_img, 
  e.is_visible, 
  e.interest_id, 
  e.end_of_event, 
  e.address,
  EXTRACT(HOUR FROM e.time_of_event) AS event_hour,
  EXTRACT(MINUTE FROM e.time_of_event) AS event_minute,
  EXTRACT(SECOND FROM e.time_of_event) AS event_second,
  string_to_array(u.token_id, ',') as user_token
FROM 
  public."event" e
LEFT JOIN event_participation ep 
  ON e.event_id = ep.event_id
LEFT JOIN public."user" u 
  ON ep.user_id = u.user_id
WHERE 
  DATE(e.time_of_event) = CURRENT_DATE and e.is_approve = true and e.is_visible = true
  and not exists (
    select 1
    from public.user_block
    where (blocker_id = u.user_id and blocked_id = e.organizer_id)
        or (blocker_id = e.organizer_id and blocked_id = u.user_id)
  )
GROUP BY 
  e.event_id, 
  e.organizer_id, 
  e.title, 
  e.description, 
  e.time_of_event, 
  e."location", 
  e.participants_count, 
  e.is_approve, 
  e.created_at, 
  e.background_img, 
  e.is_visible, 
  e.interest_id, 
  e.end_of_event, 
  e.address,
  event_hour,
  event_minute,
  event_second,
  user_token
  `
  const result = await SequelizeInstance.query(sqlQuery, {
    type: SequelizeInstance.QueryTypes.SELECT,
    raw: true,
  })
  return result
}

export async function getUserEvent(title, date, page) {
  let sqlQuery = ''
  let name = title
  if (name == null) {
    name = ''
  }
  let date1 = new Date(date)
  if (date1 == 'Invalid Date') {
    date1 = new Date(Date.now())
  }
  if (page) {
    sqlQuery = `
    select 
      e.*, u.user_name, i.name
    from
      public."event" e 
    left join 
      interest i 
      on 1=1 
      and e.interest_id = i.interest_id
    join
      "user" u
      on u.user_id = e.organizer_id
      where (e.time_of_event >= '${date1.toDateString()}' or e.end_of_event >= '${date1.toDateString()}') and e.title  like '%${name}%' and e.is_approve = true and e.is_visible = true
      and not exists (
        select 1
        from public.user_block
        where (blocker_id = u.user_id and blocked_id = e.organizer_id)
            or (blocker_id = e.organizer_id and blocked_id = u.user_id)
      )
    offset ((${page} - 1) * 5) rows 
 	  fetch next 5 rows only
  `
  } else {
    sqlQuery = `
    select 
      e.*, u.user_name, i.name
    from
      public."event" e 
    left join 
      interest i 
      on 1=1 
      and e.interest_id = i.interest_id
    join
      "user" u
      on u.user_id = e.organizer_id
      where (e.time_of_event >= '${date1.toDateString()}' or e.end_of_event >= '${date1.toDateString()}') and e.title  like '%${name}%' and e.is_approve = true and e.is_visible = true
      and not exists (
        select 1
        from public.user_block
        where (blocker_id = u.user_id and blocked_id = e.organizer_id)
            or (blocker_id = e.organizer_id and blocked_id = u.user_id)
      )
    `
  }
  const result = await SequelizeInstance.query(sqlQuery, {
    type: SequelizeInstance.QueryTypes.SELECT,
    raw: true,
  })
  return result
}

export async function joinEvent(participation_id, event_id, userId) {
  const sqlQuery = `
    UPDATE event 
    SET participants_count = participants_count + 1
    WHERE event_id = '${event_id}'
  `
  const result = await SequelizeInstance.query(sqlQuery, {
    type: SequelizeInstance.QueryTypes.SELECT,
    raw: true,
  })
  return await EventParticipation.create({
    participation_id: participation_id,
    user_id: userId,
    event_id: event_id,
    event_participation_status: 'Đã tham gia',
  })
}

export async function leaveEvent(event_id, userId) {
  const sqlQuery = `
    UPDATE event 
    SET participants_count = participants_count - 1
    WHERE event_id = '${event_id}'
  `
  const result = await SequelizeInstance.query(sqlQuery, {
    type: SequelizeInstance.QueryTypes.SELECT,
    raw: true,
  })
  const deletedEventParticipation = await EventParticipation.destroy({
    where: {
      event_id: event_id,
      user_id: userId,
    },
  })
  return deletedEventParticipation
}

export async function getEventParticipants(event_id) {
  const sqlQuery = `
  select 
   	 u.user_id , u.user_name ,u.profile_avatar 
   	 from "user" u 
   	 left join event_participation ep 
   	 on ep.user_id = u.user_id 
   	 where ep.event_id = '${event_id}'
  `
  const result = await SequelizeInstance.query(sqlQuery, {
    type: SequelizeInstance.QueryTypes.SELECT,
    raw: true,
  })
  return result
}
