import axios from 'axios';
import { resolve } from '../resolver';

export async function addFileToFavourites(fileId) {
    return await resolve(
        axios({
            method: 'post',
            url: 'http://localhost:3001/api/v1/favouriteFiles/addFileToFavourites',
            data: { fileId },
            headers: { 'Authorization': 'Bearer ' + window.localStorage.token }
        }));
}

export async function getFavouriteFiles(options) {
    return await resolve(
        axios({
            method: 'get',
            url: 'http://localhost:3001/api/v1/favouriteFiles/getFavouriteFiles',
            params: options,
            headers: { 'Authorization': 'Bearer ' + window.localStorage.token }
        }));
}

export async function deleteFavouriteFile(fileId) {
    return await resolve(
        axios({
            method: 'delete',
            url: 'http://localhost:3001/api/v1/favouriteFiles/deleteFavouriteFile',
            data: { fileId },
            headers: { 'Authorization': 'Bearer ' + window.localStorage.token }
        }));
}


