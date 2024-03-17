import * as modDAL from '../DAL/modDAL.js';

export async function getModDetails(email, password) {
    return await modDAL.getModDetails(email, password);
}
