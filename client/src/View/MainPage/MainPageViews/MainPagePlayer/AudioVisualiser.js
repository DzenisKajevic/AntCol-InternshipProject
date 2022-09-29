import React, { useRef, useEffect } from 'react';
import './AudioVisualiser.css';
import axios from 'axios';
import { setSongInfo } from '../../../../slices/sliders/songInfoSlice';
import { setSeekBytes } from '../../../../slices/sliders/seekBytesSlice';
import { setSeekSliderValue } from '../../../../slices/sliders/seekSliderValueSlice';
import { useSelector, useDispatch } from 'react-redux';


let volumeNode;
let source = null;
let source2 = null;

const AudioVisualiser = () => {

    const dispatch = useDispatch();
    const seekBytes = useSelector((state) => state.seekBytes.start);
    const songInfo = useSelector((state) => state.songInfo.value);

    useEffect(() => {
        console.log(seekBytes);
        if (seekBytes === -1) { return; };
        if (seekBytes) { cleanup(); };
        if (songInfo !== null) {
            console.log("USE EFF", "SEEK BYTES", seekBytes);
            shouldPlay.current = false;
            playedPreviously.current = true;
            console.log("SHOULD PLAY", shouldPlay.current);
            console.log(songInfo, '- Has changed')
            async function songPlayContinued() {
                headers.current['Authorization'] = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2MzExZTZjNjkyYTJkYjk2YTRiZmJiYjAiLCJ1c2VybmFtZSI6ImFkbWluIiwicm9sZSI6IkFkbWluIiwiaWF0IjoxNjY0MzYzNjcxLCJleHAiOjE2NjQ0NTAwNzF9.TqjjflokQcRHiJlZMVjZoTs8VTZ8mvkuUlT-pZwArec';


                audioContext = new AudioContext();
                //console.log("......", audioContext);
                console.log("Setting song info", audioContext);

                canvasRef.width = 1080;
                canvasRef.height = 720;
                if (!seekBytes) {
                    headers.current['Range'] = `bytes=0-${Number(songInfo.chunkSize) - 1}`;
                }
                else {

                    console.log(typeof (seekBytes), "...", songInfo.chunkSize);


                    if (songInfo.length - seekBytes > songInfo.chunkSize) {
                        console.log("Entered 2nd check");
                        headers.current['Range'] = `bytes=${Number(seekBytes)}-${Number(seekBytes) + Number(songInfo.chunkSize)}`;
                    }
                    // else fetch the rest of the file
                    else if (songInfo.length - seekBytes <= 1) {
                        playedPreviously.current = false;
                        if (source) { source.killed = true; source.stop(); }
                        if (source2) { source2.killed = true; source2.stop(); }
                        dispatch(setSeekBytes(null));
                        return;
                    }
                    else {
                        headers.current['Range'] = `bytes=${Number(seekBytes)}-`;
                        console.log("Entered 3rd check");
                    }
                }
                console.log("HEADERS", headers.current);
                firstChunk.current = await apiCall();

                console.log("HEADERS2", headers.current);
                endByte.current = Number(firstChunk.current.headers['end-byte']);
                console.log("endByte: ", typeof (endByte.current), endByte.current + 1, "fileSize:", typeof (Number(songInfo.length)), Number(songInfo.length));

                console.log("HEADERS", headers.current);
                if (endByte.current + 1 < songInfo.length) {
                    console.log("Entered 1st check");
                    // if it's a complete chunk
                    if (songInfo.length - endByte.current > songInfo.chunkSize) {
                        console.log("Entered 2nd check");
                        headers.current['Range'] = `bytes=${Number(endByte.current - 1)}-${Number(endByte.current - 1) + Number(songInfo.chunkSize) + 1}`;
                    }
                    // else fetch the rest of the file
                    else {
                        headers.current['Range'] = `bytes=${Number(endByte.current - 1)}-`;
                        console.log("Entered 3rd check");
                    }

                    console.log("HEADERS", headers.current);
                    secondChunk.current = await apiCall();
                }

                console.log("......", audioContext);
                analyser.current = audioContext.createAnalyser();
                console.log("ANALYSER", analyser.current);

                source = audioContext.createBufferSource();
                audioBuffer = await audioContext.decodeAudioData(firstChunk.current.data);
                console.log("AUDIO BUFFER", audioBuffer);
                source.buffer = audioBuffer;
                console.log("SECOND CHUNK", secondChunk.current);

                if (secondChunk.current) {
                    firstChunk.current = secondChunk.current;
                    audioBuffer = await audioContext.decodeAudioData(firstChunk.current.data);
                }
                else {
                    audioBuffer = null;
                }
                secondChunk.current = null;

                source.connect(analyser.current);
                source.loop = false;

                source.addEventListener("ended", recursiveEventListener);

                volumeNode = audioContext.createGain();
                source.connect(volumeNode);

                volumeNode.connect(audioContext.destination);
                analyser.current.fftSize = 1024;
                const bufferLength = analyser.current.frequencyBinCount;
                const dataArray = new Uint8Array(bufferLength);
                const barWidth = canvasRef.width / bufferLength;

                let barHeight;
                let x;

                shouldPlay.current = false
                dataObj.current = {
                    x,
                    dataArray,
                    bufferLength,
                    barWidth,
                    barHeight
                };

                animate();


                if (!seekBytes) dispatch(setSeekSliderValue(endByte.current - songInfo.chunkSize * 2));
                else dispatch(setSeekSliderValue(seekBytes));
                source.start();
                console.log(source);
            };
            songPlayContinued();
            dispatch(setSeekBytes(-1));
        }
    }, [songInfo, seekBytes]);

    const canvasRef = useRef(null);
    const size = { width: 1080, height: 720 };
    let endByte = useRef(null);
    let chunkSize = useRef(null);
    let dataObj = useRef(null);
    //let fileSize = useRef(null);
    let firstChunk = useRef(null);
    let secondChunk = useRef(null);
    let analyser = useRef(null);
    let shouldPlay = useRef(true);
    let animationId = useRef(null);
    let playedPreviously = useRef(false);
    let headers = useRef({});
    //let fileUrl = useRef('http://localhost:3001/api/v1/audioFiles/getFile/63299fff95f55c20e3e08ae0');
    let fileUrl = useRef('http://localhost:3001/api/v1/audioFiles/getFile/63299fff95f55c20e3e08ae0');
    //let fileInfoUrl = useRef('http://localhost:3001/api/v1/audioFiles/getFileInfo/63299fff95f55c20e3e08ae0');
    let fileInfoUrl = useRef('http://localhost:3001/api/v1/audioFiles/getFileInfo/63299fff95f55c20e3e08ae0');
    //let fileUrl = useRef('http://localhost:3001/api/v1/audioFiles/getFile/63316d27093f5f376189043d');
    //let fileInfoUrl = useRef('http://localhost:3001/api/v1/audioFiles/getFileInfo/63316d27093f5f376189043d');


    let audioBuffer;
    let audioContext;

    const cleanup = function () {
        console.log("Cleanup");

        if (source) { source.killed = true; source.stop(); }
        if (source2) { source2.killed = true; source2.stop(); }
        if (animationId.current) cancelAnimationFrame(animationId.current);
        endByte.current = null;
        dataObj.current = {};
        //fileSize.current = null;
        firstChunk.current = null;
        secondChunk.current = null;
        analyser.current = null;
        source = null;
        source2 = null;
        playedPreviously.current = null;
        headers.current = {};

        animationId.current = null;
        shouldPlay.current = false;
        audioBuffer = null;
        audioContext = null;
        const ctx = canvasRef.current.getContext('2d');
        ctx.clearRect(0, 0, canvasRef.width, canvasRef.height);

        //dispatch(setSeekBytes(-1));
    };

    const animate = () => {
        const ctx = canvasRef.current.getContext('2d');
        dataObj.current.x = 0;
        ctx.clearRect(0, 0, canvasRef.width, canvasRef.height);
        analyser.current.getByteFrequencyData(dataObj.current.dataArray);
        drawWeirdVisualiser(ctx, dataObj.current.bufferLength, dataObj.current.x,
            dataObj.current.barWidth, dataObj.current.barHeight, dataObj.current.dataArray);
        animationId.current = requestAnimationFrame(animate);
    }

    const playPause = function () {
        console.log("Sh", shouldPlay.current);
        if (shouldPlay.current) {
            animate();
            console.log(source);
            console.log(source2);
            source.playbackRate.value = 1;
            shouldPlay.current = false;
        }
        else {
            console.log(source, source2);
            cancelAnimationFrame(animationId.current);
            source.playbackRate.value = 0;
            shouldPlay.current = true;
        }
    }

    let drawBarVisualiser = function (ctx, bufferLength, x, barWidth, barHeight, dataArray) {
        for (let i = 0; i < bufferLength; i++) {
            barHeight = dataArray[i];
            ctx.fillStyle = 'hsl(' + barHeight + ', ' + barHeight + '%, ' + barHeight / 4 + '%)';
            ctx.fillRect(canvasRef.width / 2 + x, canvasRef.height - barHeight, barWidth / 2, barHeight * i / 10); // barHeight for fullsized bars
            ctx.fillRect(canvasRef.width / 2 - x, canvasRef.height - barHeight, barWidth / 2, barHeight * i / 10);
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
            x += barWidth;
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
            x += barWidth / 2;
            ctx.restore();
        }
    }

    const getFile = async function () {
        let initHeaders = {
            'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2MzExZTZjNjkyYTJkYjk2YTRiZmJiYjAiLCJ1c2VybmFtZSI6ImFkbWluIiwicm9sZSI6IkFkbWluIiwiaWF0IjoxNjY0MzYzNjcxLCJleHAiOjE2NjQ0NTAwNzF9.TqjjflokQcRHiJlZMVjZoTs8VTZ8mvkuUlT-pZwArec',
        }
        headers.current = initHeaders;
        let response = await axios({
            method: 'get',
            url: fileInfoUrl.current,
            data: {},
            headers: headers.current
        });
        console.log(response);
        return response.data;
    }

    const apiCall = async function () {
        console.log("API call headers", headers.current);
        const response = await axios({
            responseType: 'arraybuffer',
            method: 'get',
            url: fileUrl.current,
            data: {},
            headers: headers.current
        });
        endByte.current = Number(response.headers['end-byte']);
        return response;
    };

    const recursiveEventListener = async function () {
        console.log("KILLED", this.killed);
        if (this.killed) { return; }
        console.log(audioBuffer);
        if (audioBuffer) {
            source2 = audioContext.createBufferSource();
            source2.buffer = audioBuffer;
            source2.connect(analyser.current);
            source2.connect(volumeNode);
            source2.playbackRate.value = 1;
            source2.addEventListener('ended', recursiveEventListener);
            source2.loop = false;



            try {
                source.stop();
            } catch (e) { }
            source = source2;

            //if (!seekBytes) dispatch(setSeekSliderValue(endByte.current - songInfo.chunkSize * 2));
            console.log("SetSeek");
            dispatch(setSeekSliderValue(endByte.current - songInfo.chunkSize));

            source.start();


            firstChunk.current = null;
            console.log("API CALL");
            console.log("SONG INFO", songInfo);
            console.log("endByte ", endByte.current, "fileSize", songInfo.length);
            if (endByte.current + 1 < songInfo.length) {

                // if it's a complete chunk
                if (songInfo.length - endByte.current > Number(songInfo.chunkSize)) {
                    console.log("FIRST IF");
                    headers.current['Range'] = `bytes=${Number(endByte.current + 1)}-${Number(endByte.current) + Number(songInfo.chunkSize) + 1}`;
                }// else fetch the rest of the file
                else {
                    console.log("SECOND IF");
                    headers.current['Range'] = `bytes=${Number(endByte.current + 1)}-`
                };
                firstChunk.current = await apiCall();
                audioBuffer = await audioContext.decodeAudioData(firstChunk.current.data);
            }
            else {
                audioBuffer = null;
            }
        }
        else {
            source.stop();
            console.log("Stopping animation");

            cancelAnimationFrame(animationId.current);
            cleanup();
        }

    };
    const fetchAndPlay = async function () {
        if (playedPreviously.current) {
            console.log("Pause/play");
            console.log(source, source2);
            //console.log(songInfo);
            playPause();
        }

        else {
            cleanup();
            dispatch(setSeekSliderValue(0));
            playedPreviously.current = true;
            dispatch(setSeekBytes(null));
            dispatch(setSongInfo(await getFile()));
        }

    };




    return (
        <div id="container" >
            <button id="button1" onClick={fetchAndPlay}>Play/Pause</button>
            <canvas id="canvas1" {...size} ref={canvasRef}></canvas>
        </div>
    );
}

export { AudioVisualiser, volumeNode, source, source2 };