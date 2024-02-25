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
    googleLoginId: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
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
    notificationId: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
    },
    content: {
      type: DataTypes.TEXT,
    },
    createdAt: {
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
    friendshipId: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId1: {
      type: DataTypes.UUID,
    },
    userId2: {
      type: DataTypes.UUID,
    },
    friendshipStatusId: {
      type: DataTypes.UUID,
    },
    createdAt: {
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
    friendshipStatusId: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    friendshipStatus: {
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
    blogId: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
    },
    content: {
      type: DataTypes.TEXT,
    },
    likesCount: {
      type: DataTypes.INTEGER,
    },
    commentsCount: {
      type: DataTypes.INTEGER,
    },
    isApprove: {
      type: DataTypes.BOOLEAN,
    },
    createdAt: {
      type: DataTypes.DATE,
    },
  },
  {
    tableName: 'blog',
    timestamps: false,
  },
);
const Comment = sequelize.define(
  'Comment',
  {
    commentId: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    blogId: {
      type: DataTypes.UUID,
    },
    userId: {
      type: DataTypes.UUID,
    },
    content: {
      type: DataTypes.TEXT,
    },
    createdAt: {
      type: DataTypes.DATE,
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
    messageId: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    senderId: {
      type: DataTypes.UUID,
    },
    receiverId: {
      type: DataTypes.UUID,
    },
    content: {
      type: DataTypes.TEXT,
    },
    createdAt: {
      type: DataTypes.DATE,
    },
    isRead: {
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
    eventId: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    organizerId: {
      type: DataTypes.UUID,
    },
    title: {
      type: DataTypes.TEXT,
    },
    description: {
      type: DataTypes.TEXT,
    },
    timeOfEvent: {
      type: DataTypes.DATE,
    },
    location: {
      type: DataTypes.TEXT,
    },
    participantsCount: {
      type: DataTypes.INTEGER,
    },
    isApprove: {
      type: DataTypes.BOOLEAN,
    },
    createdAt: {
      type: DataTypes.DATE,
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
    participationId: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    eventId: {
      type: DataTypes.UUID,
    },
    userId: {
      type: DataTypes.UUID,
    },
    eventParticipationStatusId: {
      type: DataTypes.UUID,
    },
    createdAt: {
      type: DataTypes.DATE,
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
    eventParticipationStatusId: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    eventParticipationStatus: {
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
    statisticsId: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
    },
    loginCount: {
      type: DataTypes.INTEGER,
    },
    blogCount: {
      type: DataTypes.INTEGER,
    },
    eventCount: {
      type: DataTypes.INTEGER,
    },
    messageCount: {
      type: DataTypes.INTEGER,
    },
    friendCount: {
      type: DataTypes.INTEGER,
    },
    createdAt: {
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
    reportId: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    reporterId: {
      type: DataTypes.UUID,
    },
    blogId: {
      type: DataTypes.UUID,
    },
    content: {
      type: DataTypes.TEXT,
    },
    createdAt: {
      type: DataTypes.DATE,
    },
    reportStatusId: {
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
    reportId: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    reporterId: {
      type: DataTypes.UUID,
    },
    eventId: {
      type: DataTypes.UUID,
    },
    content: {
      type: DataTypes.TEXT,
    },
    createdAt: {
      type: DataTypes.DATE,
    },
    reportStatusId: {
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
    reportStatusId: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    reportStatus: {
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
      defaultValue: DataTypes.NOW,
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

EventReport.belongsTo(User, { foreignKey: 'reporterId', as: 'reporter' });
EventReport.belongsTo(Event, { foreignKey: 'eventId', as: 'event' });
EventReport.belongsTo(ReportStatus, {
  foreignKey: 'reportStatusId',
  as: 'reportStatus',
});

BlogReport.belongsTo(User, { foreignKey: 'reporterId', as: 'reporter' });
BlogReport.belongsTo(Blog, { foreignKey: 'blogId', as: 'blog' });
BlogReport.belongsTo(ReportStatus, {
  foreignKey: 'reportStatusId',
  as: 'reportStatus',
});
User.belongsTo(Role, { foreignKey: 'roleId', as: 'role' });
UserStatistics.belongsTo(User, { foreignKey: 'userId', as: 'user' });

EventParticipation.belongsTo(Event, { foreignKey: 'eventId', as: 'event' });
EventParticipation.belongsTo(User, { foreignKey: 'userId', as: 'user' });
EventParticipation.belongsTo(EventParticipationStatus, {
  foreignKey: 'eventParticipationStatusId',
  as: 'eventParticipationStatus',
});

Event.belongsTo(User, { foreignKey: 'organizerId', as: 'organizer' });
Event.hasMany(EventParticipation, {
  foreignKey: 'eventId',
  as: 'eventParticipations',
});

Notification.belongsTo(User, { foreignKey: 'userId', as: 'user' });

Message.belongsTo(User, { foreignKey: 'senderId', as: 'sender' });
Message.belongsTo(User, { foreignKey: 'receiverId', as: 'receiver' });

Comment.belongsTo(Blog, { foreignKey: 'blogId', as: 'blog' });
Comment.belongsTo(User, { foreignKey: 'userId', as: 'user' });

Blog.belongsTo(User, { foreignKey: 'userId', as: 'user' });

Friendship.belongsTo(User, { foreignKey: 'userId1', as: 'user1' });
Friendship.belongsTo(User, { foreignKey: 'userId2', as: 'user2' });
Friendship.belongsTo(FriendshipStatus, {
  foreignKey: 'friendshipStatusId',
  as: 'friendshipStatus',
});
GoogleLogin.belongsTo(User, { foreignKey: 'userId', as: 'user' });

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
};
