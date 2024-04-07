import * as reportDAL from '../DAL/reportDAL.js';
import { v4 as uuidv4 } from 'uuid';

export async function getAllReportStatus(page){
    return await reportDAL.getAllReportStatus(page);
}

export async function getAllBlogReport(page){
    return await reportDAL.getAllBlogReport(page);
}

export async function createBlogReport(dataObj){
    const report_id = uuidv4();
    return await reportDAL.createBlogReport(report_id, dataObj);
}

export async function deleteBlogReport(reportId) {
    return await reportDAL.deleteBlogReport(reportId);
}

export async function getAllEventReport(page){
    return await reportDAL.getAllEventReport(page);
}

export async function createEventReport(dataObj){
    const report_id = uuidv4();
    return await reportDAL.createEventReport(report_id, dataObj);
}

export async function deleteEventReport(reportId) {
    return await reportDAL.deleteEventReport(reportId);
}

export async function getAllUserReport(page){
    return await reportDAL.getAllUserReport(page);
}

export async function createUserReport(dataObj){
    const report_id = uuidv4();
    return await reportDAL.createUserReport(report_id, dataObj);
}

export async function deleteUserReport(reportId) {
    return await reportDAL.deleteUserReport(reportId);
}

export async function getAllReport(){
    return await reportDAL.getAllReport();
}