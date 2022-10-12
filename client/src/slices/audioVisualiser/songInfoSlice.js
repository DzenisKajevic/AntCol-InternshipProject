import { createSlice, current } from '@reduxjs/toolkit'

export const songInfoSlice = createSlice({
    name: 'songInfo',
    initialState: {
        song: null,
        reloadPlaylists: false,
        isPlaying: false,
    },
    reducers: {
        setSongInfo: (state, action) => {
            // Redux Toolkit allows us to write "mutating" logic in reducers. It
            // doesn't actually mutate the state because it uses the Immer library,
            // which detects changes to a "draft state" and produces a brand new
            // immutable state based off those changes
            state.song = action.payload;
            state.isPlaying = true;
        },
        setReloadPlaylists: (state, action) => {
            state.reloadPlaylists = action.payload;
        },
        setIsPlaying: (state, action) => {
            state.isPlaying = action.payload;
        }
    },
})

// Action creators are generated for each case reducer function
export const { setSongInfo, setReloadPlaylists, setIsPlaying } = songInfoSlice.actions

export default songInfoSlice.reducer

