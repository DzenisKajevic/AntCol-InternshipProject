import axios from 'axios';
import { resolve } from '../resolver';

export async function deleteFile(fileId) {
    return await resolve(
        axios({
            method: 'delete',
            url: 'http://localhost:3001/api/v1/audioFiles/deleteFile',
            data: { fileId },
            headers: { 'Authorization': 'Bearer ' + window.localStorage.token }
        }));
}

// requires multipart form for testing
export async function uploadFile(audioFile, author, genre, songName, album) {
    return await resolve(
        axios({
            method: 'post',
            url: 'http://localhost:3001/api/v1/audioFiles/uploadFile',
            data: { author, genre, songName, album, audioFile },
            headers: { 'Authorization': 'Bearer ' + window.localStorage.token }
        }));
}

export async function getFile(fileId, headers) {
    headers['Authorization'] = 'Bearer ' + window.localStorage.token;
    return await resolve(
        axios({
            method: 'get',
            url: `http://localhost:3001/api/v1/audioFiles/getFile/${fileId}`,
            data: {},
            headers: headers
        }));
}

export async function getFileInfo(fileId) {
    return await resolve(
        axios({
            method: 'get',
            url: `http://localhost:3001/api/v1/audioFiles/getFileInfo/${fileId}`,
            data: {},
            headers: { 'Authorization': 'Bearer ' + window.localStorage.token }
        }));
}

export async function getAllFiles(options = null) {
    return await resolve(
        axios({
            method: 'get',
            url: `http://localhost:3001/api/v1/audioFiles/getAllFiles`,
            data: {}, // data = body parameters
            // params = query parameters
            params: options,
            headers: { 'Authorization': 'Bearer ' + window.localStorage.token }
        }));
}

export async function getAllGenres(options = null) {
    return await resolve(
        axios({
            method: 'get',
            url: `http://localhost:3001/api/v1/audioFiles/getAllGenres`,
            data: {}, // data = body parameters
            // params = query parameters
            params: options,
            headers: { 'Authorization': 'Bearer ' + window.localStorage.token }
        }));
}

export async function getNewFilesCount() {
    return await resolve(
        axios({
            method: 'get',
            url: 'http://localhost:3001/api/v1/audioFiles/newFilesCount',
            data: {},
            headers: { 'Authorization': 'Bearer ' + window.localStorage.token }
        }));
}

export async function getFileReviews(options = null) {
    return await resolve(
        axios({
            method: 'get',
            url: `http://localhost:3001/api/v1/audioFiles/getFileReviews`,
            data: {},
            params: options,
            headers: { 'Authorization': 'Bearer ' + window.localStorage.token }
        }));
}

export async function handleFileReview(fileId, status, description) {
    return await resolve(
        axios({
            method: 'post',
            url: `http://localhost:3001/api/v1/audioFiles/handleFileReview`,
            data: { fileId, status, description },
            headers: { 'Authorization': 'Bearer ' + window.localStorage.token }
        }));
}