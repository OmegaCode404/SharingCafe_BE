// // DbHelper.js

// import pkg from 'pg';
// import dotenv from 'dotenv';
// dotenv.config();

// const { Pool } = pkg;

// console.log(
//   '~~~~DB_HOST',
//   DB_HOST,
//   '~~~~DB_PORT',
//   DB_PORT,
//   '~~~~DB_DATABASE',
//   DB_DATABASE,
//   '~~~~DB_USER',
//   DB_USER,
//   '~~~~DB_PASSWORD',
//   DB_PASSWORD,
// );

// const pool = new Pool({
//   host: DB_HOST,
//   port: DB_PORT,
//   database: DB_DATABASE,
//   user: DB_USER,
//   password: DB_PASSWORD,
// });

// export { pool };

import { Sequelize, DataTypes } from 'sequelize';
import dotenv from 'dotenv';
dotenv.config();
const DB_HOST = process.env.DB_HOST;
const DB_PORT = process.env.DB_PORT;
const DB_DATABASE = process.env.DB_DATABASE;
const DB_USER = process.env.DB_USER;
const DB_PASSWORD = process.env.DB_PASSWORD;
console.log(
  '~~~~DB_HOST',
  DB_HOST,
  '~~~~DB_PORT',
  DB_PORT,
  '~~~~DB_DATABASE',
  DB_DATABASE,
  '~~~~DB_USER',
  DB_USER,
  '~~~~DB_PASSWORD',
  DB_PASSWORD,
);

const sequelize = new Sequelize({
  dialect: 'postgres',
  host: DB_HOST,
  port: DB_PORT,
  username: DB_USER,
  password: DB_PASSWORD,
  database: DB_DATABASE,
  sync: false,
});
// sequelize
//   .authenticate()
//   .then(() => {
//     console.log('Connection has been established successfully.');
//   })
//   .catch((err) => {
//     console.error('Unable to connect to the database:', err);
//   });
const User = sequelize.define(
  'User',
  {
    user_id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    user_name: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    password: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    phone: {
      type: DataTypes.TEXT,
    },
    email: {
      type: DataTypes.TEXT,
    },
    profile_avatar: {
      type: DataTypes.TEXT,
    },
    Bio: {
      type: DataTypes.JSON,
    },
    registration: {
      type: DataTypes.DATE,
    },
    role_id: {
      type: DataTypes.UUID,
    },
  },
  {
    tableName: 'user',
    timestamps: false,
  },
);
const Role = sequelize.define(
  'Role',
  {
    role_id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    role_name: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    tableName: 'role',
    timestamps: false,
  },
);
const GoogleLogin = sequelize.define(
  'GoogleLogin',
  {
    google_login_id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.UUID,
    },
    token: {
      type: DataTypes.TEXT,
    },
    expiry: {
      type: DataTypes.DATE,
    },
  },
  {
    tableName: 'google_login',
    timestamps: false,
  },
);

const Notification = sequelize.define(
  'Notification',
  {
    notification_id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.UUID,
    },
    content: {
      type: DataTypes.TEXT,
    },
    created_at: {
      type: DataTypes.DATE,
    },
    status: {
      type: DataTypes.BOOLEAN,
    },
  },
  {
    tableName: 'notification',
    timestamps: false,
  },
);

const Friendship = sequelize.define(
  'Friendship',
  {
    friendship_id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    user_id_1: {
      type: DataTypes.UUID,
    },
    user_id_2: {
      type: DataTypes.UUID,
    },
    friendship_status_id: {
      type: DataTypes.UUID,
    },
    created_at: {
      type: DataTypes.DATE,
    },
  },
  {
    tableName: 'friend_ship',
    timestamps: false,
  },
);
const FriendshipStatus = sequelize.define(
  'FriendshipStatus',
  {
    friendship_status_id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    friendship_status: {
      type: DataTypes.TEXT,
    },
  },
  {
    tableName: 'friendship_status',
    timestamps: false,
  },
);
const Blog = sequelize.define(
  'Blog',
  {
    blog_id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.UUID,
    },
    content: {
      type: DataTypes.TEXT,
    },
    likes_count: {
      type: DataTypes.INTEGER,
    },
    comments_count: {
      type: DataTypes.INTEGER,
    },
    is_approve: {
      type: DataTypes.BOOLEAN,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
    },
    image:{
      type: DataTypes.TEXT,
    },
    title:{
      type: DataTypes.TEXT,
    }
  },
  {
    tableName: 'blog',
    timestamps: false,
  },
);
const Comment = sequelize.define(
  'Comment',
  {
    comment_id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    blog_id: {
      type: DataTypes.UUID,
    },
    user_id: {
      type: DataTypes.UUID,
    },
    content: {
      type: DataTypes.TEXT,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
    },
  },
  {
    tableName: 'comment',
    timestamps: false,
  },
);
const Message = sequelize.define(
  'Message',
  {
    message_id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    sender_id: {
      type: DataTypes.UUID,
    },
    receiver_id: {
      type: DataTypes.UUID,
    },
    content: {
      type: DataTypes.TEXT,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
    },
    is_read: {
      type: DataTypes.BOOLEAN,
    },
  },
  {
    tableName: 'message',
    timestamps: false,
  },
);
const Event = sequelize.define(
  'Event',
  {
    event_id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    organizer_id: {
      type: DataTypes.UUID,
    },
    title: {
      type: DataTypes.TEXT,
    },
    description: {
      type: DataTypes.TEXT,
    },
    time_of_event: {
      type: DataTypes.DATE,
    },
    location: {
      type: DataTypes.TEXT,
    },
    participants_count: {
      type: DataTypes.INTEGER,
    },
    is_approve: {
      type: DataTypes.BOOLEAN,
    },
    background_img: {
      type: DataTypes.TEXT,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
    },
  },
  {
    tableName: 'event',
    timestamps: false,
  },
);
const EventParticipation = sequelize.define(
  'EventParticipation',
  {
    participation_id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    event_id: {
      type: DataTypes.UUID,
    },
    user_id: {
      type: DataTypes.UUID,
    },
    eventParticipationStatusId: {
      type: DataTypes.UUID,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
    },
  },
  {
    tableName: 'event_participation',
    timestamps: false,
  },
);
const EventParticipationStatus = sequelize.define(
  'EventParticipationStatus',
  {
    event_participation_status_id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    event_participation_status: {
      type: DataTypes.TEXT,
    },
  },
  {
    tableName: 'event_participation_status',
    timestamps: false,
  },
);
const UserStatistics = sequelize.define(
  'UserStatistics',
  {
    statistics_id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.UUID,
    },
    login_count: {
      type: DataTypes.INTEGER,
    },
    blog_count: {
      type: DataTypes.INTEGER,
    },
    event_count: {
      type: DataTypes.INTEGER,
    },
    message_count: {
      type: DataTypes.INTEGER,
    },
    friend_count: {
      type: DataTypes.INTEGER,
    },
    created_at: {
      type: DataTypes.DATE,
    },
  },
  {
    tableName: 'user_statistics',
    timestamps: false,
  },
);
const BlogReport = sequelize.define(
  'BlogReport',
  {
    report_id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    reporter_id: {
      type: DataTypes.UUID,
    },
    blog_id: {
      type: DataTypes.UUID,
    },
    content: {
      type: DataTypes.TEXT,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
    },
    report_status_id: {
      type: DataTypes.UUID,
    },
  },
  {
    tableName: 'blog_report',
    timestamps: false,
  },
);
const EventReport = sequelize.define(
  'EventReport',
  {
    report_id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    reporter_id: {
      type: DataTypes.UUID,
    },
    event_id: {
      type: DataTypes.UUID,
    },
    content: {
      type: DataTypes.TEXT,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
    },
    report_status_id: {
      type: DataTypes.UUID,
    },
  },
  {
    tableName: 'event_report',
    timestamps: false,
  },
);
const ReportStatus = sequelize.define(
  'ReportStatus',
  {
    report_status_id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    report_status: {
      type: DataTypes.TEXT,
    },
  },
  {
    tableName: 'report_status',
    timestamps: false,
  },
);

const Interest = sequelize.define(
  'interest',
  {
    interest_id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    name: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
    },
  },
  {
    tableName: 'interest',
    timestamps: false,
  },
);

const UserInterest = sequelize.define(
  'user_interest',
  {
    user_interest_id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    interest_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: 'user_interest',
    timestamps: false,
  },
);

User.belongsTo(Role, { foreignKey: 'role_id', as: 'UserRole' });

EventReport.belongsTo(User, { foreignKey: 'reporter_id', as: 'reporter' });
EventReport.belongsTo(Event, { foreignKey: 'event_id', as: 'event' });
EventReport.belongsTo(ReportStatus, {
  foreignKey: 'report_status_id',
  as: 'reportStatus',
});

BlogReport.belongsTo(User, { foreignKey: 'reporter_id', as: 'reporter' });
BlogReport.belongsTo(Blog, { foreignKey: 'blog_id', as: 'blog' });
BlogReport.belongsTo(ReportStatus, {
  foreignKey: 'report_status_id',
  as: 'reportStatus',
});
User.belongsTo(Role, { foreignKey: 'role_id', as: 'role' });
UserStatistics.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

EventParticipation.belongsTo(Event, { foreignKey: 'event_id', as: 'event' });
EventParticipation.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
EventParticipation.belongsTo(EventParticipationStatus, {
  foreignKey: 'event_participation_status_id',
  as: 'eventParticipationStatus',
});

Event.belongsTo(User, { foreignKey: 'organizer_id', as: 'organizer' });
Event.hasMany(EventParticipation, {
  foreignKey: 'event_id',
  as: 'eventParticipations',
});

Notification.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

Message.belongsTo(User, { foreignKey: 'sender_id', as: 'sender' });
Message.belongsTo(User, { foreignKey: 'receiver_id', as: 'receiver' });

Comment.belongsTo(Blog, { foreignKey: 'blog_id', as: 'blog' });
Comment.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

Blog.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

Friendship.belongsTo(User, { foreignKey: 'user_id_1', as: 'user1' });
Friendship.belongsTo(User, { foreignKey: 'user_id_2', as: 'user2' });
Friendship.belongsTo(FriendshipStatus, {
  foreignKey: 'friendship_status_id',
  as: 'friendshipStatus',
});
GoogleLogin.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

export default sequelize;
export {
  sequelize as SequelizeInstance,
  User,
  Role,
  GoogleLogin,
  ReportStatus,
  EventReport,
  BlogReport,
  UserStatistics,
  EventParticipationStatus,
  EventParticipation,
  Event,
  Message,
  Comment,
  Blog,
  FriendshipStatus,
  Friendship,
  Notification,
  Interest,
  UserInterest
};
