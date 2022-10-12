import { createSlice, current } from '@reduxjs/toolkit'

export const favouriteSongsSlice = createSlice({
    name: 'favouriteSongs',
    initialState: {
        songs: [],
        reloadFavourites: true,
        pageCount: null,
    },
    reducers: {
        setFavouriteSongs: (state, action) => {
            state.songs = action.payload.favourites;
            state.pageCount = Number(action.payload.pageCount);
        },
        setReloadFavouriteSongs: (state, action) => {
            state.reloadFavourites = action.payload;
        },
    },
})

// Action creators are generated for each case reducer function
export const { setFavouriteSongs, setReloadFavouriteSongs } = favouriteSongsSlice.actions

export default favouriteSongsSlice.reducer