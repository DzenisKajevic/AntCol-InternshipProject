import axios from 'axios';
import { resolve } from '../resolver';

export async function createEmptyPlaylist(playlistName, visibility = 'private') {
    return await resolve(
        axios({
            method: 'post',
            url: 'http://localhost:3001/api/v1/playlists/createEmptyPlaylist',
            data: { playlistName, visibility },
            headers: { 'Authorization': 'Bearer ' + window.localStorage.token }
        }));
}

export async function addFilesToPlaylist(input) {
    return await resolve(
        axios({
            method: 'post',
            url: 'http://localhost:3001/api/v1/playlists/addFilesToPlaylist',
            data: JSON.stringify(input),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + window.localStorage.token
            }
        }));
}

export async function removeFilesFromPlaylist(input) {
    return await resolve(
        axios({
            method: 'delete',
            url: 'http://localhost:3001/api/v1/playlists/removeFilesFromPlaylist',
            data: JSON.stringify(input),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + window.localStorage.token
            }
        }));
}

export async function updatePlaylistVisibility(playlistId, visibility) {
    return await resolve(
        axios({
            method: 'put',
            url: 'http://localhost:3001/api/v1/playlists/updatePlaylistVisibility',
            data: {
                playlistId,
                visibility
            },
            headers: {
                'Authorization': 'Bearer ' + window.localStorage.token
            }
        }));
}

export async function updatePlaylistName(playlistId, playlistName) {
    return await resolve(
        axios({
            method: 'put',
            url: 'http://localhost:3001/api/v1/playlists/updatePlaylistName',
            data: {
                playlistId,
                playlistName
            },
            headers: {
                'Authorization': 'Bearer ' + window.localStorage.token
            }
        }));
}

export async function getPlaylistById(playlistId) {
    return await resolve(
        axios({
            method: 'get',
            url: `http://localhost:3001/api/v1/playlists/getPlaylistById/${playlistId}`,
            headers: {
                'Authorization': 'Bearer ' + window.localStorage.token
            }
        }));
}

export async function getPlaylists(options) {
    return await resolve(
        axios({
            method: 'get', // post request due to userId being passed
            url: `http://localhost:3001/api/v1/playlists/getPlaylists`,
            params: options,
            headers: {
                'Authorization': 'Bearer ' + window.localStorage.token
            }
        }));
}

export async function deletePlaylist(playlistId) {
    return await resolve(
        axios({
            method: 'delete',
            url: `http://localhost:3001/api/v1/playlists/deletePlaylist`,
            data: { playlistId },
            headers: {
                'Authorization': 'Bearer ' + window.localStorage.token
            }
        }));
}

export async function sharePlaylist(input) {
    return await resolve(
        axios({
            method: 'put',
            url: `http://localhost:3001/api/v1/playlists/sharePlaylist`,
            data: JSON.stringify(input),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + window.localStorage.token
            }
        }));
}

export async function revokePlaylistShare(input) {
    return await resolve(
        axios({
            method: 'put',
            url: `http://localhost:3001/api/v1/playlists/revokePlaylistShare`,
            data: JSON.stringify(input),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + window.localStorage.token
            }
        }));
}
