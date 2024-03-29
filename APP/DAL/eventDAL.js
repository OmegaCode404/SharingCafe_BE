import { Event, SequelizeInstance } from '../utility/DbHelper.js';

export async function getEvents(title, date, page) {
  let sqlQuery = '';
  let name = title;
  if (name == null) {name = ''}
  let date1 = new Date(date);
  if (date1 == 'Invalid Date') {date1 = new Date(Date.now())}
  console.log(date1.toUTCString());
  if (page){
    sqlQuery = `
    select 
      e.*, u.user_name, i.name, i.is_available
    from
      public."event" e 
    left join 
      interest i 
      on 1=1 
      and e.interest_id = i.interest_id
    join
      "user" u
      on u.user_id = e.organizer_id
    where  (e.time_of_event >= '${date1.toUTCString()}' or e.end_of_event <= '${date1.toUTCString()}') and e.title  like '%${name}%'
    offset ((${page} - 1) * 5) rows 
 	  fetch next 5 rows only
  `;
  } else {
    sqlQuery = `
    select 
      e.*, u.user_name, i.name, i.is_available
    from
      public."event" e 
    left join 
      interest i 
      on 1=1 
      and e.interest_id = i.interest_id
    join
      "user" u
      on u.user_id = e.organizer_id
      where (e.time_of_event >= '${date1.toUTCString()}' or e.end_of_event >= '${date1.toUTCString()}') and e.title  like '%${name}%'
    `
  }
  const result = await SequelizeInstance.query(sqlQuery, {
    type: SequelizeInstance.QueryTypes.SELECT,
    raw: true,
  });
  return result;
}

export async function getEvent(eventId) {
  const sqlQuery = `
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
    on e.organizer_id = u.user_id
  where e.event_id = '${eventId}'
  `;
  const result = await SequelizeInstance.query(sqlQuery, {
    type: SequelizeInstance.QueryTypes.SELECT,
    raw: true,
  });
  return result;
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
    is_visible: dataObj.is_visible,
    interest_id: dataObj.interest_id,
  });
}

export async function updateImage(fileData) {
  return await {
    background_img: fileData?.path
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
      is_visible: true,
    },
    {
      where: { event_id: eventId },
    },
  );
}

export async function deleteEvent(eventId) {
  const deletedEvent = await Event.destroy({
    where: { event_id: eventId },
  });
  return deletedEvent;
}

export async function getNewEvents() {
  const date = new Date(Date.now());
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
    where e.time_of_event >= '${date.toUTCString()}' or e.end_of_event >= '${date.toUTCString()}'
  order by e.time_of_event
  `;
  const result = await SequelizeInstance.query(sqlQuery, {
    type: SequelizeInstance.QueryTypes.SELECT,
    raw: true,
  });
  return result;
}

export async function getEventsByDate(dateString) {
  const date = new Date(dateString.date);
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
  order by e.time_of_event
  `;
  const result = await SequelizeInstance.query(sqlQuery, {
    type: SequelizeInstance.QueryTypes.SELECT,
    raw: true,
  });
  return result;
}

export async function getEventsByName(dataObj) {
  let name = dataObj.title;
  if (name == null) {name = ''}
  let date1 = new Date(dataObj.date);
  if (date1 == 'Invalid Date') {date1 = new Date('1/1/1000')}
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
  `;
  const result = await SequelizeInstance.query(sqlQuery, {
    type: SequelizeInstance.QueryTypes.SELECT,
    raw: true,
  });
  return result;
}

export async function getPopularEvents() {
  let date = new Date(Date.now());
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
  where e.time_of_event >= '${date.toISOString()}' or e.end_of_event <= '${date.toISOString()}'
  order by 
    e.time_of_event desc
    , e.participants_count desc
  limit 10
  `;
  const result = await SequelizeInstance.query(sqlQuery, {
    type: SequelizeInstance.QueryTypes.SELECT,
    raw: true,
  });
  return result;
}