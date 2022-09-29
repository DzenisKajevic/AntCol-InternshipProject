import { useSelector, useDispatch } from 'react-redux'
import { setSeekSliderValue } from '../../../../../slices/sliders/seekSliderValueSlice'
import ReactSlider from "react-slider";
import { setSeekBytes } from "../../../../../slices/sliders/seekBytesSlice";
const SeekSlider = () => {
    const seekSliderValue = useSelector((state) => state.seekSliderValue.value);
    const seekBytes = useSelector((state) => state.seekBytes.value);
    const songInfo = useSelector((state) => state.songInfo.value);
    const dispatch = useDispatch();


    return (
        <ReactSlider
            id="seekSlider"
            className="seekSlider"
            thumbClassName="customSlider-thumb"
            trackClassName="customSlider-track"
            min={0}
            max={songInfo !== null ? songInfo.length - 1 : 0}
            defaultValue={0}
            value={seekSliderValue}
            onAfterChange={(value) => {
                console.log(value);
                dispatch(setSeekBytes(value));
                if (songInfo) { console.log(songInfo); }
            }}
            onChange={(value) => {
                dispatch(setSeekSliderValue(value));
                //console.log(value);
            }
            }
        />
    );
};

export default SeekSlider