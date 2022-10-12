import { useEffect, useState } from "react";
import { useSelector, useDispatch } from 'react-redux'
import { setVolumeSliderValue } from '../../../../../slices/audioVisualiser/volumeSliderValueSlice'
import ReactSlider from "react-slider";
import { volumeNode } from "../AudioVisualiser";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faVolumeLow, faVolumeHigh } from "@fortawesome/free-solid-svg-icons";

const VolumeSlider = () => {
    const volumeSliderValue = useSelector((state) => state.volumeSliderValue.value);
    const dispatch = useDispatch();

    useEffect(() => {
        if (volumeNode) {
            volumeNode.gain.setValueAtTime(volumeSliderValue / 100, 0);
        }
    }, [volumeSliderValue])

    return (
        <>
            <div className="volume-icons-container">
                <span>
                    <FontAwesomeIcon icon={ faVolumeLow } className="volume-icons" />
                </span>
                <span>
                    <FontAwesomeIcon icon={ faVolumeHigh } className="volume-icons" />
                </span>
            </div>
            <ReactSlider
                id="volumeSlider"
                //className="volumeSlider"
                className="progress-bar"
                thumbClassName="customSlider-thumb"
                trackClassName="customSlider-track"
                min={ 0 }
                max={ 100 } z
                defaultValue={ 0 }
                value={ volumeSliderValue }
                onChange={ (value) => dispatch(setVolumeSliderValue(value))
                }
            />

        </>
    );
};

export default VolumeSlider;