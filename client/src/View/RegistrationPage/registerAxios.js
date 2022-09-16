import * as userAuth from "../../api/auth/userAuth"

// admins can't be registered through forms. They can only be added manually through the DB
// onClick={() => register("tempUser", "email@gmail.com", "pass123")}
export async function register(username, email, pass) {
    const response = await userAuth.register(username, email, pass);
    if (response.error) {
        console.log(response.error); // response.error.response.data -> error message
    }
    else {
        console.log(response.data);
    }
}