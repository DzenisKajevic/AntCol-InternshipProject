import { configureStore } from '@reduxjs/toolkit'
import songInfoReducer from './slices/audioVisualiser/songInfoSlice'
import seekSliderValueReducer from './slices/audioVisualiser/seekSliderValueSlice'
import volumeSliderValueReducer from './slices/audioVisualiser/volumeSliderValueSlice'
import seekBytesReducer from './slices/audioVisualiser/seekBytesSlice'
import visualiserHiddenReducer from './slices/audioVisualiser/visualiserHiddenSlice'
import searchResultsReducer from './slices/search/searchResultsSlice'

export default configureStore({
    reducer: {
        songInfo: songInfoReducer,
        seekSliderValue: seekSliderValueReducer,
        volumeSliderValue: volumeSliderValueReducer,
        seekBytes: seekBytesReducer,
        visualiserHidden: visualiserHiddenReducer,
        searchResults: searchResultsReducer,
    },
})