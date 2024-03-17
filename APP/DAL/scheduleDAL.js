import { Schedule, SequelizeInstance } from '../utility/DbHelper.js';

export async function createSchedule(schedule_id, dataObj){
    return await Schedule.create({
        schedule_id: schedule_id,
        content: dataObj.content,
        location: dataObj.location,
        date: dataObj.date,
        sender_id: dataObj.sender_id,
        receiver_id: dataObj.receiver_id
    });
}