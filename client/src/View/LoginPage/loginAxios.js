import * as userAuth from "../../api/auth/userAuth"
// import * as audioFiles from "../../../api/audioFiles/audioFiles"
// import * as favouriteFiles from "../../../api/favouriteFiles/favouriteFiles"
// import * as playlists from "../../../api/playlists/playlists"

// onClick={() => login("email@gmail.com", "pass123")}
export async function login(user) {
    const response = await userAuth.login(user.email, user.password);
    if (response.error) {
        console.log(response.error); // response.error.response.data -> error message
    }
    else {
        // saves the token into the localStorage. 
        window.localStorage.token = response.data.data.token;
        window.localStorage.user = JSON.stringify(response.data.data.loginUser);
        // .data is needed twice because of initial data / error separation
        console.log(response);
    }
    return response;
}
