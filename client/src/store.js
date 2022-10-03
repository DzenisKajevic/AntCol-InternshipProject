import { configureStore } from '@reduxjs/toolkit'
import songInfoReducer from './slices/sliders/songInfoSlice'
import seekSliderValueReducer from './slices/sliders/seekSliderValueSlice'
import volumeSliderValueReducer from './slices/sliders/volumeSliderValueSlice'
import seekBytesReducer from './slices/sliders/seekBytesSlice'
import visualiserHiddenReducer from './slices/sliders/visualiserHiddenSlice'

export default configureStore({
    reducer: {
        songInfo: songInfoReducer,
        seekSliderValue: seekSliderValueReducer,
        volumeSliderValue: volumeSliderValueReducer,
        seekBytes: seekBytesReducer,
        visualiserHidden: visualiserHiddenReducer,
    },
})