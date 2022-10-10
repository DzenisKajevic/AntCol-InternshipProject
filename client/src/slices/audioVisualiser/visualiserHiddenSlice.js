import { createSlice } from '@reduxjs/toolkit'

export const visualiserHiddenSlice = createSlice( {
    name: 'visualiserHidden',
    initialState: {
        hidden: true,
    },
    reducers: {
        setVisualiserHidden: ( state, action ) =>
        {
            // Redux Toolkit allows us to write "mutating" logic in reducers. It
            // doesn't actually mutate the state because it uses the Immer library,
            // which detects changes to a "draft state" and produces a brand new
            // immutable state based off those changes
            state.hidden = action.payload;
        },
    },
} )

// Action creators are generated for each case reducer function
export const { setVisualiserHidden } = visualiserHiddenSlice.actions

export default visualiserHiddenSlice.reducer