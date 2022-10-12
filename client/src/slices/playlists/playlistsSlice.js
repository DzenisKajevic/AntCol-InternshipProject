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
        },
        addPlaylistToArray: (state, action) => {
            state.playlists.push(action.payload);
        },
        setReloadPlaylists: (state, action) => {
            state.reloadPlaylists = action.payload;
        },
        deletePlaylist: (state, action) => {
            if (action.payload > -1) { // only splice array when item is found
                state.playlists.splice(action.payload, 1); // 2nd parameter means remove one item only
            }
        }
    },
})

// Action creators are generated for each case reducer function
export const { setPlaylists, addPlaylistToArray, setReloadPlaylists, deletePlaylist } = playlistsSlice.actions

export default playlistsSlice.reducer