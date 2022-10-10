import axios from 'axios';
import { resolve } from '../resolver';

export async function register(username, email, password) {
    return await resolve(
        axios({
            method: 'post',
            url: 'http://localhost:3001/api/v1/auth/register',
            data: { username, email, password },
        }));
}

export async function login(email, password) {
    return await resolve(
        axios({
            method: 'post',
            url: 'http://localhost:3001/api/v1/auth/login',
            data: { email, password },
        }));
}

export async function renameUser(newUsername) {
    return await resolve(
        axios({
            method: 'put',
            url: 'http://localhost:3001/api/v1/auth/renameUser',
            data: { newUsername },
        }));
}

export async function getNewUsersCount() {
    return await resolve(
        axios({
            method: 'get',
            url: 'http://localhost:3001/api/v1/auth/newUsersCount',
            data: {},
            headers: { 'Authorization': 'Bearer ' + window.localStorage.token }
        }));
}


