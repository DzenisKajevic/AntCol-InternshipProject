import axios from 'axios';
import { resolve } from '../resolver';

export async function getFile(input) {
    //input = {fileId: null, userId: null} -> fill in one of these 2 options, based on what info you have currently
    const fetchResult = await fetch(`http://localhost:3001/api/v1/profilePics/getFile?` + new URLSearchParams(input), {
        method: 'get',
        headers: {
            'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2MzExZTZjNjkyYTJkYjk2YTRiZmJiYjAiLCJ1c2VybmFtZSI6ImFkbWluIiwicm9sZSI6IkFkbWluIiwiaWF0IjoxNjY1MTMxMzIxfQ.IRUGg1yKHJRol5_Prmt71BJ6aOTi-m9aCFz2d8b5Fh4'
        }
    });
    return await fetchResult.blob()

    // axios doesn't work for this (blob issue)
}

// requires multipart form for testing
export async function uploadFile(profilePic) {
    return await resolve(
        axios({
            method: 'post',
            url: 'http://localhost:3001/api/v1/profilePics/uploadFile',
            data: { profilePic },
            headers: { 'Authorization': 'Bearer ' + window.localStorage.token }
        }));
}

export async function deleteFile(fileId) {
    return await resolve(
        axios({
            method: 'delete',
            url: 'http://localhost:3001/api/v1/profilePics/deleteFile',
            data: { fileId },
            headers: { 'Authorization': 'Bearer ' + window.localStorage.token }
        }));
}