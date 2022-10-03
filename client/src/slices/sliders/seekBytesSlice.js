import { createSlice } from '@reduxjs/toolkit'

export const seekBytesSlice = createSlice({
    name: 'seekBytes',
    initialState: {
        start: null,
        //        chunkSize: 0
    },
    reducers: {
        setSeekBytes: (state, action) => {
            // Redux Toolkit allows us to write "mutating" logic in reducers. It
            // doesn't actually mutate the state because it uses the Immer library,
            // which detects changes to a "draft state" and produces a brand new
            // immutable state based off those changes
            state.start = action.payload;
        },
    },
})

/*
// QOL structure change for redux (Abd-Mel)

export const seekBytesSlice = createSlice({
    name: 'seekBytes',
    initialState: {
        start: null,
        //        chunkSize: 0
    },
    reducers: {
        setSeekBytes: (start) => ({
            type: nesto,
            payload: { start }
        }){
            // Redux Toolkit allows us to write "mutating" logic in reducers. It
            // doesn't actually mutate the state because it uses the Immer library,
            // which detects changes to a "draft state" and produces a brand new
            // immutable state based off those changes
            state.start = action.payload;

            console.log("Bytes.start", state.start);
            //state.chunkSize = action.payload.chunkSize
        },
    },
}) */


// Action creators are generated for each case reducer function
export const { setSeekBytes } = seekBytesSlice.actions

export default seekBytesSlice.reducer