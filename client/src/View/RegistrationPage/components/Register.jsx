import React from "react";
import "./register.css";
import "../../../variables.css";
import * as userAuth from "../../../api/auth/userAuth"
import * as audioFiles from "../../../api/audioFiles/audioFiles"
import * as favouriteFiles from "../../../api/favouriteFiles/favouriteFiles"
import * as playlists from "../../../api/playlists/playlists"

const Register = () => {
  return (
    <section className="registrationpage-container">
      <div className="register-bg-color-wrapper">
        <form action="post" className="register-form">
          <h1 className="register-title">Sign up for a new account</h1>

          <label className="register-label">Username:</label>
          <input
            type="text"
            className="register-input"
            placeholder="Choose a username"
            required
          />

          <label className="register-label">Email:</label>
          <input
            type="email"
            className="register-input"
            placeholder="Type in your e-mail address"
            required
          />

          <label className="register-label">Password:</label>
          <input
            type="password"
            className="register-input"
            placeholder="Choose a password"
            required
          />
          {/* change the onClick on the line below to test axios calls */}
          <button className="registrationpage-button shine" onClick={() => logout()}>Sign up</button>
          <img
            className="registerpage-icon"
            src="./assets/app-images/music-app-logo.png"
            alt="music app logo"
          />
          <p className="register-link-paragraph">
            Already have an account? <a href="">Log in</a>
          </p>
        </form>
      </div>
    </section >
  );
};

// admins can't be registered through forms. They can only be added manually through the DB
// onClick={() => register("tempUser", "email@gmail.com", "pass123")}
async function register(username, email, pass) {
  const response = await userAuth.register(username, email, pass);
  if (response.error) {
    console.log(response.error); // response.error.response.data -> error message
  }
  else {
    console.log(response.data);
  }
}

// onClick={() => login("email@gmail.com", "pass123")}
async function login(email, pass) {
  const response = await userAuth.login(email, pass);
  if (response.error) {
    console.log(response.error); // response.error.response.data -> error message
  }
  else {
    // saves the token into the localStorage. 
    window.localStorage.token = response.data.data.token;
    // .data is needed twice because of initial data / error separation
    console.log(response);
  }
}

function logout() {
  window.localStorage.clear();
  window.location.reload();
}

// onClick={() => getNewUsersCount()}
async function getNewUsersCount() {
  const response = await userAuth.getNewUsersCount();
  if (response.error) {
    console.log(response.error);
  }
  else {
    console.log(response.data);
  }
}

//onClick={() => deleteFile("631aed4060c43bb3bf484804")}
async function deleteFile(fileId) {
  const response = await audioFiles.deleteFile(fileId);
  if (response.error) {
    console.log(response.error);
  }
  else {
    console.log(response.data);
  }
}

// can't test yet, requires a multipart form for file uploads
async function uploadFile(audioFile, author, genre, songName, album) {
  const response = await audioFiles.uploadFile(audioFile, author, genre, songName, album);
  if (response.error) {
    console.log(response.error);
  }
  else {
    console.log(response.data);
  }
}

//onClick={() => getFile("631aed4060c43bb3bf484804")}
async function getFile(fileId) {
  const response = await audioFiles.getFile(fileId);
  if (response.error) {
    console.log(response.error);
  }
  else {
    console.log(response.data);
  }
}

//onClick={() => getFileInfo("631aed4060c43bb3bf484804")}
async function getFileInfo(fileId) {
  const response = await audioFiles.getFileInfo(fileId);
  if (response.error) {
    console.log(response.error);
  }
  else {
    console.log(response.data);
  }
}

// onClick={() => getAllFiles({ 'genre': "Something", 'author': "Someone", 'page': 1, 'pageSize': 1 })}
// genre and author are optional (search / filter), pass null instead if not present
// possible parameters: 
// genre, author, page, pageSize
async function getAllFiles(options) {
  const response = await audioFiles.getAllFiles(options);
  if (response.error) {
    console.log(response.error);
  }
  else {
    console.log(response.data);
  }
}

// onClick={() => getNewFilesCount()}
async function getNewFilesCount() {
  const response = await audioFiles.getNewFilesCount();
  if (response.error) {
    console.log(response.error);
  }
  else {
    console.log(response.data);
  }
}

// onClick={() => getFileReviews({ 'description': 'The file doesn\'t meet the requirements', 'genre': 'Something' })}
// possible parameters:
// genre, author, fileId, fileName, songName, uploadedBy,
// reviewStatus, adminId, adminName, description, page, pageSize
async function getFileReviews(options = null) {
  const response = await audioFiles.getFileReviews(options);
  if (response.error) {
    console.log(response.error);
  }
  else {
    console.log(response.data);
  }
}

// onClick={() => handleFileReview("6322fab48ab321a55be1d784", "Accepted", "The file meets the requirements")}
async function handleFileReview(fileId, status, description) {
  const response = await audioFiles.handleFileReview(fileId, status, description);
  if (response.error) {
    console.log(response.error);
  }
  else {
    console.log(response.data);
  }
}

//onClick = {() => addFileToFavourites("6322fab48ab321a55be1d784")}
async function addFileToFavourites(fileId) {
  const response = await favouriteFiles.addFileToFavourites(fileId);
  if (response.error) {
    console.log(response.error);
  }
  else {
    console.log(response.data);
  }
}

// onClick={() => getFavouriteFiles({ 'page': 1, 'pageSize': 4})}
async function getFavouriteFiles(options = null) {
  const response = await favouriteFiles.getFavouriteFiles(options);
  if (response.error) {
    console.log(response.error);
  }
  else {
    console.log(response.data);
  }
}

//onClick = {() => deleteFavouriteFile("6322fab48ab321a55be1d784")}
async function deleteFavouriteFile(fileId) {
  const response = await favouriteFiles.deleteFavouriteFile(fileId);
  if (response.error) {
    console.log(response.error);
  }
  else {
    console.log(response.data);
  }
}

//onClick = {() => createEmptyPlaylist("playlist1", 'public')}
async function createEmptyPlaylist(playlistName, visibility = 'private') {
  const response = await playlists.createEmptyPlaylist(playlistName, visibility);
  if (response.error) {
    console.log(response.error);
  }
  else {
    console.log(response.data);
  }
}

/* onClick = {() => addFilesToPlaylist({
    "fileIDs": [
      "6322fab48ab321a55be1d784"
      ],
  "playlistId": "6323044493813cd714991cd5"
})} */
async function addFilesToPlaylist(input) {
  const response = await playlists.addFilesToPlaylist(input);
  if (response.error) {
    console.log(response.error);
  }
  else {
    console.log(response.data);
  }
}

/* onClick = {() => removeFilesFromPlaylist({
    "fileIDs": [
      "6322fab48ab321a55be1d784"
      ],
  "playlistId": "6323044493813cd714991cd5"
})} */
async function removeFilesFromPlaylist(input) {
  const response = await playlists.removeFilesFromPlaylist(input);
  if (response.error) {
    console.log(response.error);
  }
  else {
    console.log(response.data);
  }
}

//onClick = {() => createEmptyPlaylist("6323044493813cd714991cd5", 'private')}
async function updatePlaylistVisibility(playlistId, visibility) {
  const response = await playlists.updatePlaylistVisibility(playlistId, visibility);
  if (response.error) {
    console.log(response.error);
  }
  else {
    console.log(response.data);
  }
}

//onClick = {() => getPlaylistById("6323044493813cd714991cd5")}
async function getPlaylistById(playlistId) {
  const response = await playlists.getPlaylistById(playlistId);
  if (response.error) {
    console.log(response.error);
  }
  else {
    console.log(response.data);
  }
}

//onClick = {() => getPlaylists({"userId: "6311e6c692a2db96a4bfbbb0", page": 1, "pageSize": 10})}
async function getPlaylists(options) {
  const response = await playlists.getPlaylists(options);
  if (response.error) {
    console.log(response.error);
  }
  else {
    console.log(response.data);
  }
}

//onClick = {() => deletePlaylist("6323044493813cd714991cd5")}
async function deletePlaylist(playlistId) {
  const response = await playlists.deletePlaylist(playlistId);
  if (response.error) {
    console.log(response.error);
  }
  else {
    console.log(response.data);
  }
}

/* onClick={() => sharePlaylist({
  "playlistId": "63230c58571d3ebf0f6610b3",
  "usersToShareWith": [
    "6319d0f6e31017e8b08c1d86"]
})} */
async function sharePlaylist(input) {
  const response = await playlists.sharePlaylist(input);
  if (response.error) {
    console.log(response.error);
  }
  else {
    console.log(response.data);
  }
}

/* onClick={() => revokePlaylistShare({
  "playlistId": "63230c58571d3ebf0f6610b3",
  "usersToShareWith": [
    "6319d0f6e31017e8b08c1d86"]
})} */
async function revokePlaylistShare(input) {
  const response = await playlists.revokePlaylistShare(input);
  if (response.error) {
    console.log(response.error);
  }
  else {
    console.log(response.data);
  }
}

export default Register;
