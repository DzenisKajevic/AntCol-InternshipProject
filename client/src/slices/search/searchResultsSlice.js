import { createSlice, current } from '@reduxjs/toolkit'

export const searchResultsSlice = createSlice({
    name: 'searchResults',
    initialState: {
        songs: [],
        pageCount: null,
    },
    reducers: {
        setSearchResults: (state, action) => {
            state.songs = action.payload.searchResults;
            state.pageCount = Number(action.payload.pageCount);
        }
    },
})

// Action creators are generated for each case reducer function
export const { setSearchResults } = searchResultsSlice.actions

export default searchResultsSlice.reducer