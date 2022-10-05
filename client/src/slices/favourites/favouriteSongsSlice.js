import { createSlice } from '@reduxjs/toolkit'

export const favouriteSongsSlice = createSlice({
    name: 'favouriteSongs',
    initialState: {
        songs: [],
        reloadFavourites: true,
    },
    reducers: {
        setFavouriteSongs: (state, action) => {
            state.songs = action.payload;
        },
        setReloadFavouriteSongs: (state, action) => {
            state.reloadFavourites = action.payload;
        },
    },
})

// Action creators are generated for each case reducer function
export const { setFavouriteSongs, setReloadFavouriteSongs } = favouriteSongsSlice.actions

export default favouriteSongsSlice.reducer