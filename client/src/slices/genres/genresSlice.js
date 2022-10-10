import { createSlice } from '@reduxjs/toolkit'

export const genresSlice = createSlice({
    name: 'genres',
    initialState: {
        genres: [],
        songs: [],
        currentGenre: null,
        genresPageCount: null,
        songsPageCount: null,
        reloadGenres: true,
        genresHidden: false,
        songsHidden: true
    },
    reducers: {
        setGenres: (state, action) => {
            console.log(action.payload);
            state.genres = action.payload.genres;
            state.genresPageCount = Number(action.payload.pageCount);

        },
        setGenreSongs: (state, action) => {
            state.songs = action.payload.searchResults;
            state.songsPageCount = action.payload.pageCount;
            state.currentGenre = action.payload.currentGenre;
            state.genresHidden = true;
            state.songsHidden = false;
        },
        unhideGenres: (state, action) => {

            console.log(action.payload);
            state.genresHidden = false;
            state.songsHidden = true;
        },
        setReloadGenres: (state, action) => {
            console.log(action.payload);
            state.reloadGenres = action.payload;
        }
    },
})

// Action creators are generated for each case reducer function
export const { setGenres, setReloadGenres, setGenreSongs, unhideGenres } = genresSlice.actions

export default genresSlice.reducer