import { createSlice } from '@reduxjs/toolkit'

export const songInfoSlice = createSlice({
    name: 'songInfo',
    initialState: {
        value: null,
    },
    reducers: {
        setSongInfo: (state, action) => {
            // Redux Toolkit allows us to write "mutating" logic in reducers. It
            // doesn't actually mutate the state because it uses the Immer library,
            // which detects changes to a "draft state" and produces a brand new
            // immutable state based off those changes
            console.log(action.payload, state.value);
            state.value = action.payload;
            console.log("SongInfo.value", state.value);
        },
    },
})

// Action creators are generated for each case reducer function
export const { setSongInfo } = songInfoSlice.actions

export default songInfoSlice.reducer

