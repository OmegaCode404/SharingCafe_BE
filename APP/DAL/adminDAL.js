import { Role, SequelizeInstance, User } from '../utility/DbHelper.js';

export async function getAdmDetails(email, password) {
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
    FROM event;`;
  const statics = await SequelizeInstance.query(sqlQuery, {
    type: SequelizeInstance.QueryTypes.SELECT,
    raw: true,
  });
  return statics;
}
export async function getUsers() {
  const sqlQuery = `
  Select 
	  *
  from public."user" u 
  inner join 
	  role r
	  on u.role_id = r.role_id
  where 
    r.role_name = 'USER'
  `;
  const result = await SequelizeInstance.query(sqlQuery, {
    type: SequelizeInstance.QueryTypes.SELECT,
    raw: true,
  });
  return result;
}
