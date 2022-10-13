import React, { useRef, useEffect, useCallback, useState } from 'react';
import './AudioVisualiser.css';
import axios from 'axios';
import { setSeekBytes } from '../../../../slices/audioVisualiser/seekBytesSlice';
import { setSeekSliderValue } from '../../../../slices/audioVisualiser/seekSliderValueSlice';
import { setRedirected, setVisualiserHidden } from '../../../../slices/audioVisualiser/visualiserHiddenSlice';
import { setIsPlaying } from '../../../../slices/audioVisualiser/songInfoSlice';
import { useSelector, useDispatch } from 'react-redux';
import SeekSlider from './Components/SeekSlider';
import VolumeSlider from './Components/VolumeSlider';
import { preparePlayNext, preparePlayPrevious } from '../../components/MainContent/MainContent';
import {
    faArrowLeft,
    faArrowRight,
    faPlay,
    faPause,
    faExpand,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { NavLink } from "react-router-dom"

let volumeNode;
let source = null;
let source2 = null;
let ctx = null;
let cleanup = null;
let playPause = null;

const AudioVisualiser = () => {

    let windowPopOld = document.location.pathname;
    let windowPopNew = '';
    // triggers playPause twice (once in the listener, once in useEffect) for playing the song "seamlessly"
    onpopstate = (event) => {
        windowPopNew = document.location.pathname;
        if (windowPopNew === windowPopOld) {
            return;
            //diferent path: not just the hash has changed

        }
        playPause();
        if (windowPopNew === '/main-page/music-player' || windowPopNew === '/main-page/music-player/')
            dispatch(setVisualiserHidden({ hidden: false, redirected: true }));
        else dispatch(setVisualiserHidden({ hidden: true, redirected: true }));
        windowPopOld = windowPopNew;
    };

    const dispatch = useDispatch();
    const isPlaying = useSelector((state) => state.songInfo.isPlaying);
    const volumeSliderValue = useSelector((state) => state.volumeSliderValue.value);
    const seekBytes = useSelector((state) => state.seekBytes.start);
    const songInfo = useSelector((state) => state.songInfo.song);
    const visualiserHidden = useSelector((state) => state.visualiserHidden);
    const searchResults = useSelector((state) => state.searchResults);

    useEffect(() => {
        if (visualiserHidden.redirected) {
            playPause();
            dispatch(setRedirected(false));
        }
        if (seekBytes === -1) { return; };
        if (seekBytes) { cleanup(); };

        if (songInfo !== null) {
            fileUrl.current = 'http://localhost:3001/api/v1/audioFiles/getFile/' + songInfo['_id'];
            if (!visualiserHidden.hidden) {
                ctx = canvasRef.current.getContext('2d');
            }
            shouldPlay.current = false;

            async function songPlayContinued() {

                canvasRef.width = 1080;
                canvasRef.height = 720;
                audioContext.current = new AudioContext();
                if (!seekBytes) {
                    headers.current['Range'] = `bytes=0-${Number(songInfo.chunkSize) - 1}`;
                }
                else {
                    // fetch full chunk
                    if (songInfo.length - seekBytes > songInfo.chunkSize) {
                        headers.current['Range'] = `bytes=${Number(seekBytes)}-${Number(seekBytes) + Number(songInfo.chunkSize)}`;
                    }
                    // else fetch the rest of the file
                    else if (songInfo.length - seekBytes <= 1) {
                        if (source) { source.killed = true; source.stop(); } // killed = terminated by seeking
                        if (source2) { source2.killed = true; source2.stop(); }
                        dispatch(setSeekBytes(null));
                        return;
                    }
                    else {
                        headers.current['Range'] = `bytes=${Number(seekBytes)}-`;
                    }
                }
                firstChunk.current = await apiCall();
                endByte.current = Number(firstChunk.current.headers['end-byte']);

                if (endByte.current + 1 < songInfo.length) {
                    // if a complete chunk is available, fetch it
                    if (songInfo.length - endByte.current > songInfo.chunkSize) {
                        headers.current['Range'] = `bytes=${Number(endByte.current - 1)}-${Number(endByte.current - 1) + Number(songInfo.chunkSize) + 1}`;
                    }
                    // else fetch the rest of the file
                    else {
                        headers.current['Range'] = `bytes=${Number(endByte.current - 1)}-`;
                    }
                    secondChunk.current = await apiCall();
                }

                analyser.current = audioContext.current.createAnalyser();

                source = audioContext.current.createBufferSource();
                audioBuffer.current = await audioContext.current.decodeAudioData(firstChunk.current.data);
                source.buffer = audioBuffer.current;

                if (secondChunk.current) {
                    firstChunk.current = secondChunk.current;
                    audioBuffer.current = await audioContext.current.decodeAudioData(firstChunk.current.data);
                }
                else {
                    audioBuffer.current = null;
                }
                secondChunk.current = null;

                source.connect(analyser.current);
                source.loop = false;

                source.addEventListener("ended", recursiveEventListener);

                volumeNode = audioContext.current.createGain();
                volumeNode.gain.setValueAtTime(volumeSliderValue / 100, 0);
                source.connect(volumeNode);

                volumeNode.connect(audioContext.current.destination);
                analyser.current.fftSize = 1024;
                const bufferLength = analyser.current.frequencyBinCount;
                const dataArray = new Uint8Array(bufferLength);
                const barWidth = canvasRef.width / bufferLength;

                let barHeight;
                let x;

                shouldPlay.current = false
                dataObj.current = {
                    x: barWidth / 2,
                    dataArray,
                    bufferLength,
                    barWidth,
                    barHeight
                };

                if (!visualiserHidden.hidden) {
                    animate();
                    animationId.current = null;
                }
                if (!seekBytes) dispatch(setSeekSliderValue(endByte.current - songInfo.chunkSize * 2));
                else dispatch(setSeekSliderValue(seekBytes));
                source.start();
            };
            songPlayContinued();
            dispatch(setSeekBytes(-1));
        }

    }, [songInfo, seekBytes, visualiserHidden]);

    const canvasRef = useRef(null);
    const size = { width: 1080, height: 720 };
    let endByte = useRef(null);
    let dataObj = useRef(null);
    let firstChunk = useRef(null);
    let secondChunk = useRef(null);
    let analyser = useRef(null);
    let shouldPlay = useRef(true);
    let animationId = useRef(null);
    let headers = useRef({});
    let fileUrl = useRef(null);

    let audioBuffer = useRef(null);
    let audioContext = useRef(null);

    cleanup = function () {

        if (source) { source.killed = true; source.stop(); }
        if (source2) { source2.killed = true; source2.stop(); }
        if (animationId.current) cancelAnimationFrame(animationId.current);
        endByte.current = null;
        dataObj.current = {};
        firstChunk.current = null;
        secondChunk.current = null;
        analyser.current = null;
        source = null;
        source2 = null;
        headers.current['Range'] = null;

        animationId.current = null;
        shouldPlay.current = false;
        audioBuffer.current = null;
        audioContext.current = null;
        if (!visualiserHidden.hidden) {
            ctx = canvasRef.current.getContext('2d');
            ctx.clearRect(0, 0, canvasRef.width, canvasRef.height);
        }
    };

    const animate = () => {
        /* dataObj.current.x = 0; */
        if (!visualiserHidden.hidden) {
            ctx = canvasRef.current.getContext('2d');
            ctx.clearRect(0, 0, canvasRef.width, canvasRef.height);
        }
        analyser.current.getByteFrequencyData(dataObj.current.dataArray);
        drawWeirdVisualiser(ctx, dataObj.current.bufferLength, dataObj.current.x,
            dataObj.current.barWidth, dataObj.current.barHeight, dataObj.current.dataArray);
        /* drawBarVisualiser(ctx, dataObj.current.bufferLength, dataObj.current.x,
           dataObj.current.barWidth, dataObj.current.barHeight, dataObj.current.dataArray); */
        /* drawCircleVisualiser(ctx, dataObj.current.bufferLength, dataObj.current.x,
            dataObj.current.barWidth, dataObj.current.barHeight, dataObj.current.dataArray); */

        animationId.current = requestAnimationFrame(animate);
    }

    playPause = function () {
        if (songInfo) {
            dispatch(setIsPlaying(!isPlaying));
            if (shouldPlay.current) {
                if (!visualiserHidden.hidden) {
                    animate();
                }
                source.playbackRate.value = 1;
                shouldPlay.current = false;
            }
            else {
                if (animationId.current) cancelAnimationFrame(animationId.current);
                //ctx.clearRect(0, 0, canvasRef.width, canvasRef.height);
                source.playbackRate.value = 0;
                shouldPlay.current = true;
            }
        }
    }

    let drawBarVisualiser = function (ctx, bufferLength, x, barWidth, barHeight, dataArray) {
        for (let i = 0; i < bufferLength; i++) {
            barHeight = dataArray[i];
            ctx.fillStyle = 'hsl(' + barHeight + ', ' + barHeight + '%, ' + barHeight / 4 + '%)';
            /* ctx.fillRect(canvasRef.width / 2 + x, canvasRef.height - barHeight, barWidth / 2, barHeight * i / 10); // barHeight for fullsized bars
            ctx.fillRect(canvasRef.width / 2 - x, canvasRef.height - barHeight, barWidth / 2, barHeight * i / 10);
 */
            ctx.fillRect(canvasRef.width / 2 + x, canvasRef.height - barHeight * 1.5, barWidth / 2, -(barHeight * i / 350)); // barHeight for fullsized bars
            ctx.fillRect(canvasRef.width / 2 - x, canvasRef.height - barHeight * 1.5, barWidth / 2, -(barHeight * i / 350));
            x += barWidth / 2;
        }
    }

    let drawCircleVisualiser = function (ctx, bufferLength, x, barWidth, barHeight, dataArray) {
        for (let i = 0; i < bufferLength; i++) {
            barHeight = dataArray[i];
            ctx.save();
            // sets the center for rotations
            ctx.translate(canvasRef.width / 2, canvasRef.height / 2);
            // rotate only understands radians
            ctx.rotate(i + Math.PI * 2 / bufferLength);

            ctx.fillStyle = 'hsl(' + barHeight + ', ' + barHeight + '%, ' + barHeight / 4 + '%)';
            ctx.fillRect(0, 0, barWidth, barHeight);
            /* x += barWidth; */
            // restores the canvasRef to the previous save
            ctx.restore();
        }
    }

    let drawWeirdVisualiser = function (ctx, bufferLength, x, barWidth, barHeight, dataArray) {
        for (let i = 0; i < bufferLength; i++) {
            barHeight = dataArray[i];
            ctx.save();
            ctx.translate(canvasRef.width / 2, canvasRef.height / 2);
            ctx.rotate(i * Math.PI * 2 / bufferLength * 3.14);

            ctx.fillStyle = 'hsl(' + barHeight + ', ' + barHeight + '%, ' + barHeight / 4 + '%)';
            ctx.fillRect(canvasRef.width / 64, canvasRef.height / 16, barWidth, barHeight);
            ctx.fillRect(canvasRef.width * 64, canvasRef.height * 16, barWidth, barHeight);
            /* x += barWidth / 2; */
            ctx.restore();
        }
    }

    const apiCall = async function () {
        const response = await axios({
            responseType: 'arraybuffer',
            method: 'get',
            url: fileUrl.current,
            data: {},
            headers: {
                'Authorization': 'Bearer ' + window.localStorage.token,
                'Range': headers.current['Range']
            }
        });
        endByte.current = Number(response.headers['end-byte']);
        return response;
    };

    const recursiveEventListener = async function () {
        if (this.killed) { return; }
        if (audioBuffer.current) {
            source2 = audioContext.current.createBufferSource();
            source2.buffer = audioBuffer.current;
            source2.connect(analyser.current);
            source2.connect(volumeNode);
            source2.playbackRate.value = 1;
            source2.addEventListener('ended', recursiveEventListener);
            source2.loop = false;

            try {
                source.stop();
            } catch (e) { }
            source = source2;

            // setSeekSliderValue -> used for "showing" current song progress, not used for requesting chunks, unlike setSeekBytes
            dispatch(setSeekSliderValue(endByte.current - songInfo.chunkSize));

            source.start();

            firstChunk.current = null;
            if (endByte.current + 1 < songInfo.length) {

                // if it's a complete chunk
                if (songInfo.length - endByte.current > Number(songInfo.chunkSize)) {
                    headers.current['Range'] = `bytes=${Number(endByte.current + 1)}-${Number(endByte.current) + Number(songInfo.chunkSize) + 1}`;
                }// else fetch the rest of the file
                else {
                    headers.current['Range'] = `bytes=${Number(endByte.current + 1)}-`
                };
                firstChunk.current = await apiCall();
                audioBuffer.current = await audioContext.current.decodeAudioData(firstChunk.current.data);
            }
            else {
                audioBuffer.current = null;
            }
        }
        else {
            source.stop();
            if (animationId.current)
                cancelAnimationFrame(animationId.current);
            cleanup();
            preparePlayNext();
        }

    };

    if (visualiserHidden.hidden)
        return (
            <section className="music-player" style={ { animationPlayState: isPlaying ? 'running' : 'paused' } }>
                {/* <div id="container"> */ }
                <div className='musicPlayer-button-container'>
                    <button className="forward-backward" onClick={ () => { preparePlayPrevious(); } }>
                        <FontAwesomeIcon icon={ faArrowLeft } />
                    </button>
                    <button className="play-pause" onClick={ () => { playPause() } }>
                        { isPlaying ? (
                            <FontAwesomeIcon icon={ faPause } />
                        ) : (
                            <FontAwesomeIcon icon={ faPlay } />
                        ) }
                    </button>
                    <button className="forward-backward" onClick={ () => { preparePlayNext(); } }>
                        <FontAwesomeIcon icon={ faArrowRight } />
                    </button>
                </div>
                {
                    songInfo ?
                        <div className='song-information'>
                            <p className='author-name'>{ songInfo.metadata.author }</p>
                            <p className='song-name'>{ songInfo.metadata.songName }</p>
                            <p className='played-from'>{ songInfo.playedFrom }</p>
                        </div>
                        :
                        <div className='song-information'>
                            <p className='not-playing-p'>Not playing</p>
                        </div>
                }

                <div className='slider-container'>

                    <SeekSlider />
                    <VolumeSlider />
                </div>
                <NavLink to="/main-page/music-player" className="expand-icon" onClick={ () => {
                    dispatch(setVisualiserHidden({ hidden: false, redirected: true })); if (isPlaying) {
                        setTimeout(() => {
                            playPause();
                        }, "300")
                    }
                } }>
                    <FontAwesomeIcon icon={ faExpand } />
                </NavLink>
            </section >
        );

    else
        return (
            <div>
                < canvas id="canvas1" { ...size } ref={ canvasRef } ></canvas >
                <section className="music-player" style={ { animationPlayState: isPlaying ? 'running' : 'paused' } }>
                    {/* <div id="container"> */ }
                    <div className='musicPlayer-button-container'>
                        <button className="forward-backward" onClick={ () => { preparePlayPrevious(); } }>
                            <FontAwesomeIcon icon={ faArrowLeft } />
                        </button>
                        <button className="play-pause" onClick={ () => { playPause() } }>
                            { isPlaying ? (
                                <FontAwesomeIcon icon={ faPause } />
                            ) : (
                                <FontAwesomeIcon icon={ faPlay } />
                            ) }
                        </button>
                        <button className="forward-backward" onClick={ () => { preparePlayNext(); } }>
                            <FontAwesomeIcon icon={ faArrowRight } />
                        </button>
                    </div>
                    {
                        songInfo ?
                            <div className='song-information'>
                                <p className='author-name'>{ songInfo.metadata.author }</p>
                                <p className='song-name'>{ songInfo.metadata.songName }</p>
                                <p className='played-from'>{ songInfo.playedFrom }</p>
                            </div>
                            :
                            <div className='song-information'>
                                <p className='not-playing-p'>Not playing</p>
                            </div>
                    }

                    <div className='slider-container'>

                        <SeekSlider />
                        <VolumeSlider />
                    </div>

                </section >
            </div >
        );
}

export { AudioVisualiser, volumeNode, source, source2, cleanup, playPause };

// useCallback