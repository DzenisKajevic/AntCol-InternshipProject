import { createSlice } from '@reduxjs/toolkit'

export const searchResultsSlice = createSlice({
    name: 'searchResults',
    initialState: {
        songs: [],
    },
    reducers: {
        setSearchResults: (state, action) => {
            state.songs = action.payload;
        }
    },
})

// Action creators are generated for each case reducer function
export const { setSearchResults } = searchResultsSlice.actions

export default searchResultsSlice.reducer