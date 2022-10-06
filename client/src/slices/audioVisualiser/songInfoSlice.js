import { createSlice, current } from '@reduxjs/toolkit'

export const songInfoSlice = createSlice({
    name: 'songInfo',
    initialState: {
        song: null,
        reloadPlaylists: false
    },
    reducers: {
        setSongInfo: (state, action) => {
            // Redux Toolkit allows us to write "mutating" logic in reducers. It
            // doesn't actually mutate the state because it uses the Immer library,
            // which detects changes to a "draft state" and produces a brand new
            // immutable state based off those changes
            state.song = action.payload;
            console.log(current(state));
        },
        setReloadPlaylists: (state, action) => {
            state.reloadPlaylists = action.payload;
        }
    },
})

// Action creators are generated for each case reducer function
export const { setSongInfo, setReloadPlaylists } = songInfoSlice.actions

export default songInfoSlice.reducer

