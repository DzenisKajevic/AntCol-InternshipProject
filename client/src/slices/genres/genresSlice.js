import { createSlice } from '@reduxjs/toolkit'

export const genresSlice = createSlice({
    name: 'genres',
    initialState: {
        genres: [],
        pageCount: null,
        reloadGenres: true,
    },
    reducers: {
        setGenres: (state, action) => {
            state.genres = action.payload.genres;
            state.pageCount = Number(action.payload.pageCount);
        },
        setReloadGenres: (state, action) => {
            state.reloadGenres = action.payload;
        }
    },
})

// Action creators are generated for each case reducer function
export const { setGenres, setReloadGenres } = genresSlice.actions

export default genresSlice.reducer