export { PrivateRoute };

function PrivateRoute({ children }) {
    if (!window.localStorage.token || !window.localStorage.user) {
        // not logged in so redirect to login page with the return url
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.replace('/');
    }

    // authorized so return child components
    return children;
}