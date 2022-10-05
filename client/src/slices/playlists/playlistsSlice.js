import { createSlice, current } from '@reduxjs/toolkit'

export const playlistsSlice = createSlice({
    name: 'playlists',
    initialState: {
        playlists: [],
        reloadPlaylists: true,
    },
    reducers: {
        setPlaylists: (state, action) => {
            state.playlists = action.payload;
            /* action.payload.forEach(playlist => {
                if (!state.playlists.includes(playlist)) {
                    state.playlists.push(playlist);
                    //console.log(current(state)); //current() prints the value of the state, not "Proxy"
                }
            }) */
        },
        addPlaylistToArray: (state, action) => {
            state.playlists.push(action.payload);
        },
        setReloadPlaylists: (state, action) => {
            state.reloadPlaylists = action.payload;
            //console.log(current(state));
        },
    },
})

// Action creators are generated for each case reducer function
export const { setPlaylists, addPlaylistToArray, setReloadPlaylists } = playlistsSlice.actions

export default playlistsSlice.reducer