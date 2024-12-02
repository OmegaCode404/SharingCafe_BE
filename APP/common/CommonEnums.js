export const USER_ROLE = {
  ADMIN: 'ADMIN',
  USER: 'USER',
}
export const MATCH_STATUS = {
  MATCHED: 'Matched',
  PENDING: 'Pending',
  DECLINED: 'Declined',
  ACCEPTED: 'Accepted',
  DISLIKE: 'Dislike',
}
export const MATCH_TRANSLATE = [
  { label: 'Matched', value: 'đồng ý kết bạn' },
  { label: 'Pending', value: 'vừa gủi lời mời kết bạn' },
  { label: 'Declined', value: 'từ chối lời mời kết bạn' },
  { label: 'Accepted', value: 'chấp nhận lời mời' },
  { label: 'Dislike', value: 'không hứng thú' },
]
export const TYPE_IMAGE = {
  DELETE: 0,
  USER: 1,
  EVENT: 2,
  BLOG: 3,
  COMMENT: 4,
}

export const TYPE_DISCUSS = {
  EVENT: 1,
}

export const TYPE_COMMENT = {
  EVENT: 1,
  BLOG: 2,
  DISCUSS: 3,
}

export const TYPE_LIKE = {
  BLOG: 1,
  EVENT: 2,
  DISCUSS: 3,
}
