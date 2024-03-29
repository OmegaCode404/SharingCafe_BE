import { BlogReport, EventReport, UserReport, SequelizeInstance } from '../utility/DbHelper.js';

export async function getAllReportStatus(page) {
  let sqlQuery = '';
  if (page) {
    sqlQuery = `
      select * from report_status rs 
      offset ((${page} - 1 ) * 10) rows 
      fetch next 10 rows only`;
  } else {
    sqlQuery = `
    select * from report_status rs 
    `;
  }
  const result = await SequelizeInstance.query(sqlQuery, {
    type: SequelizeInstance.QueryTypes.SELECT,
    raw: true,
  });
  return result;
}

export async function getAllBlogReport(page) {
  let sqlQuery = '';
  if (page) {
    sqlQuery = `
        select 
            br.blog_id,
            b.title, b.image , b.is_approve,
            jsonb_agg(
                jsonb_build_object(
                'report_id', br.report_id ,
                'reporter_id', br.reporter_id ,
                'reporter', u.user_name,
                'profile_avatar', u.profile_avatar ,
                'report_status', rs.report_status,
                'created_at', br.created_at 
                ) 
            ) as user_report
        from
            blog_report br 
        inner join report_status rs
        on rs.report_status_id = br.report_status_id 
        join "user" u 
        on u.user_id = br.reporter_id
        join blog b 
        on br.blog_id = b.blog_id 
        group by br.blog_id, b.title, b.image, b.is_approve
        offset ((${page} - 1 ) * 10) rows 
        fetch next 10 rows only`;
  } else {
    sqlQuery = `
      select 
  	    br.blog_id,
  	    b.title, b.image, b.is_approve,
  	    jsonb_agg(
  		    jsonb_build_object(
  			    'report_id', br.report_id ,
  			    'reporter_id', br.reporter_id ,
  			    'reporter', u.user_name,
            'profile_avatar', u.profile_avatar ,
  			    'report_status', rs.report_status,
            'created_at', br.created_at 
  		    ) 
  	    ) as user_report
    from
  	  blog_report br 
    inner join report_status rs
    on rs.report_status_id = br.report_status_id 
    join "user" u 
    on u.user_id = br.reporter_id
    join blog b 
    on br.blog_id = b.blog_id 
    group by br.blog_id, b.title, b.image, b.is_approve
    `;
  }
  const result = await SequelizeInstance.query(sqlQuery, {
    type: SequelizeInstance.QueryTypes.SELECT,
    raw: true,
  });
  return result;
}

export async function createBlogReport(report_id, dataObj) {
  return await BlogReport.create({
    report_id: report_id,
    reporter_id: dataObj.reporter_id,
    blog_id: dataObj.blog_id,
    content: dataObj.content,
    report_status_id: dataObj.report_status_id,
  })
}

export async function deleteBlogReport(reportId) {
  const deletedBlogReport = await BlogReport.destroy({
    where: { report_id: reportId },
  });
  return deletedBlogReport;
}

export async function getAllEventReport(page) {
  let sqlQuery = '';
  if (page) {
    sqlQuery = `
    select 
      e.event_id ,e.title , e.background_img , e.is_approve,
      jsonb_agg(
        jsonb_build_object(
          'report_id', er.report_id ,
          'reporter_id', er.reporter_id ,
          'reporter', u.user_name ,
          'profile_avatar', u.profile_avatar ,
          'report_status', rs.report_status,
          'created_at', er.created_at 
        ) 
      ) as user_report
    from
      event_report er 
    inner join report_status rs 
    on rs.report_status_id = er.report_status_id 
    join "user" u
    on u.user_id = er.reporter_id 
    join "event" e 
    on er.event_id = e.event_id 
    group by e.event_id 
        offset ((${page} - 1 ) * 10) rows 
        fetch next 10 rows only`;
  } else {
    sqlQuery = `
    select 
      e.event_id ,e.title , e.background_img , e.is_approve,
      jsonb_agg(
        jsonb_build_object(
          'report_id', er.report_id ,
          'reporter_id', er.reporter_id ,
          'reporter', u.user_name ,
          'profile_avatar', u.profile_avatar ,
          'report_status', rs.report_status,
          'created_at', er.created_at 
        ) 
      ) as user_report
    from
      event_report er 
    inner join report_status rs 
    on rs.report_status_id = er.report_status_id 
    join "user" u
    on u.user_id = er.reporter_id 
    join "event" e 
    on er.event_id = e.event_id 
    group by e.event_id 
    `;
  }
  const result = await SequelizeInstance.query(sqlQuery, {
    type: SequelizeInstance.QueryTypes.SELECT,
    raw: true,
  });
  return result;
}

export async function createEventReport(report_id, dataObj) {
  return await EventReport.create({
    report_id: report_id,
    reporter_id: dataObj.reporter_id,
    event_id: dataObj.event_id,
    content: dataObj.content,
    report_status_id: dataObj.report_status_id,
  })
}

export async function deleteEventReport(reportId) {
  const deletedEventReport = await EventReport.destroy({
    where: { report_id: reportId },
  });
  return deletedEventReport;
}

export async function getAllUserReport(page) {
  let sqlQuery = '';
  if (page) {
    sqlQuery = `
    select 
    u2.user_id  ,u2.user_name  , u2.profile_avatar  ,
    jsonb_agg(
        jsonb_build_object(
          'report_id', ur.report_id ,
          'reporter_id', ur.reporter_id ,
          'reporter', u.user_name ,
          'report_status', rs.report_status,
          'created_at', ur.created_at 
        ) 
      ) as user_report
    from
      user_report ur 
    inner join report_status rs 
    on rs.report_status_id = ur.report_status_id 
    join "user" u
    on u.user_id = ur.reporter_id 
    join "user" u2 
     on u2.user_id = ur.user_id 
    group by u2.user_id
    offset ((${page} - 1 ) * 10) rows 
    fetch next 10 rows only`;
  } else {
    sqlQuery = `
    select 
    u2.user_id  ,u2.user_name  , u2.profile_avatar  ,
    jsonb_agg(
        jsonb_build_object(
          'report_id', ur.report_id ,
          'reporter_id', ur.reporter_id ,
          'reporter', u.user_name ,
          'report_status', rs.report_status,
          'created_at', ur.created_at 
        ) 
      ) as user_report
    from
      user_report ur 
    inner join report_status rs 
    on rs.report_status_id = ur.report_status_id 
    join "user" u
    on u.user_id = ur.reporter_id 
    join "user" u2 
     on u2.user_id = ur.user_id 
    group by u2.user_id
    `;
  }
  const result = await SequelizeInstance.query(sqlQuery, {
    type: SequelizeInstance.QueryTypes.SELECT,
    raw: true,
  });
  return result;
}

export async function createUserReport(report_id, dataObj) {
  return await UserReport.create({
    report_id: report_id,
    reporter_id: dataObj.reporter_id,
    user_id: dataObj.user_id,
    content: dataObj.content,
    report_status_id: dataObj.report_status_id,
  })
}

export async function deleteUserReport(reportId) {
  const deletedUserReport = await UserReport.destroy({
    where: { report_id: reportId },
  });
  return deletedUserReport;
}