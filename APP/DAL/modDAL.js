import {Role, User} from '../utility/DbHelper.js';

export async function getModDetails(email, password) {
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
            role_name: 'MODERATOR',
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
