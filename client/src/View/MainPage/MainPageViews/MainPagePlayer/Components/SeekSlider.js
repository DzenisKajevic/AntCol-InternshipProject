import { useSelector, useDispatch } from 'react-redux'
import { setSeekSliderValue } from '../../../../../slices/audioVisualiser/seekSliderValueSlice'
import ReactSlider from "react-slider";
import { setSeekBytes } from "../../../../../slices/audioVisualiser/seekBytesSlice";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBackward, faForward } from '@fortawesome/free-solid-svg-icons';

const SeekSlider = () =>
{
    const seekSliderValue = useSelector( ( state ) => state.seekSliderValue.value );
    const seekBytes = useSelector( ( state ) => state.seekBytes.value );
    const songInfo = useSelector( ( state ) => state.songInfo.song );
    const dispatch = useDispatch();

    return (
        <>
            <div className='seekSlider-icons-container'>
                <span>
                    <FontAwesomeIcon icon={ faBackward } className='seekSlider-icons' />
                </span>
                <span>
                    <FontAwesomeIcon icon={ faForward } className='seekSlider-icons' />
                </span>

            </div>
            <ReactSlider
                id="seekSlider"
                /* className="seekSlider" */
                className='progress-bar'
                thumbClassName="customSlider-thumb"
                trackClassName="customSlider-track"
                min={ 0 }
                max={ songInfo !== null ? songInfo.length - 1 : 0 }
                defaultValue={ 0 }
                value={ seekSliderValue }
                onAfterChange={ ( value ) =>
                {
                    dispatch( setSeekBytes( value ) );
                    if ( songInfo )
                    {
                    }
                } }
                onChange={ ( value ) =>
                {
                    dispatch( setSeekSliderValue( value ) );
                }
                }
            />
        </>
    );
};

export default SeekSlider