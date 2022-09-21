// Web Audio API
/*let audio1 = new Audio('91476_Glorious_morning.mp3');
const audioContext = new AudioContext();
console.log(audioContext);

const button2 = document.getElementById('button2');
const button3 = document.getElementById('button3');
let audio1 = new Audio('91476_Glorious_morning.mp3');



audio1.addEventListener('playing', () => {
    console.log('Audio1 started playing');
});

audio1.addEventListener('ended', () => {
    console.log("Audio1 ended");
});

button2.addEventListener('click', () => {
    audio1.pause();
})

button3.addEventListener('click', playSound);

function playSound() {
    console.log("BLA");
    audioContext.resume().then(() => {
        console.log('Playback resumed successfully');
    });
    const oscillator = audioContext.createOscillator();
    oscillator.connect(audioContext.destination);
    oscillator.type = 'triangle';
    oscillator.start();
    setTimeout(function () {
        oscillator.stop();
    }, 500)
}; */
const button1 = document.getElementById('button1');

button1.addEventListener('click', () => {
    if (shouldPlay) {
        animate();
        console.log("pl");
        source.playbackRate.value = 1;
        shouldPlay = false;
    }
    else {
        cancelAnimationFrame(animationId);
        //animate();
        console.log("npl");
        source.playbackRate.value = 0;
        shouldPlay = true;
    }
});

const container = document.getElementById('container');
// canvas is a special html element that creates a field where we can draw animated interactive images with js
// canvas has 2D and webgl APIs, which are separate and work in different ways
const canvas = document.getElementById('canvas1'); //150x300 by default
/* canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
 */
canvas.width = 1080;
canvas.height = 720;

let file;
let animate;
let animationId;
let shouldPlay = true;

//context
const ctx = canvas.getContext('2d');
let audioSource;
let source;
let analyser;
let playedPreviously = false;
//let audio1 = document.getElementById('audio1');

let drawBarVisualiser = function (bufferLength, x, barWidth, barHeight, dataArray) {
    for (let i = 0; i < bufferLength; i++) {
        barHeight = dataArray[i];
        //ctx.fillStyle = 'white';
        //ctx.fillStyle = 'hsl(' + barHeight + ', 50%, 50%)';

        //const red = i * barHeight / 20;
        //const blue = barHeight / 2;
        //const green = i * barHeight * 4;
        //ctx.fillStyle = 'rgb(' + red + ',' + green + ',' + blue + ')';

        /*         ctx.fillStyle = 'hsl(' + barHeight / 2 + ', ' + barHeight / 2 + '%, ' + barHeight / 4 + '%)';
                ctx.fillRect(canvas.width / 2 + x, canvas.height - barHeight + barHeight * i / 10, barWidth / 2, 20); // barHeight for fullsized bars
                ctx.fillRect(canvas.width / 2 - x, canvas.height - barHeight + barHeight * i / 10, barWidth / 2, 20); // barHeight for fullsized bars */

        ctx.fillStyle = 'hsl(' + barHeight + ', ' + barHeight + '%, ' + barHeight / 4 + '%)';
        ctx.fillRect(canvas.width / 2 + x, canvas.height - barHeight, barWidth / 2, barHeight * i / 10); // barHeight for fullsized bars
        ctx.fillRect(canvas.width / 2 - x, canvas.height - barHeight, barWidth / 2, barHeight * i / 10);
        x += barWidth / 2;
    }
}

let drawCircleVisualiser = function (bufferLength, x, barWidth, barHeight, dataArray) {
    for (let i = 0; i < bufferLength; i++) {
        barHeight = dataArray[i];
        //console.log("Bar H: " + barHeight);
        ctx.save();
        // sets the center for rotations
        ctx.translate(canvas.width / 2, canvas.height / 2);
        // rotate only understands radians
        ctx.rotate(i + Math.PI * 2 / bufferLength);

        ctx.fillStyle = 'hsl(' + barHeight + ', ' + barHeight + '%, ' + barHeight / 4 + '%)';
        ctx.fillRect(0, 0, barWidth, barHeight);
        x += barWidth;
        // restores the canvas to the previous save
        ctx.restore();
    }
}

let drawWeirdVisualiser = function (bufferLength, x, barWidth, barHeight, dataArray) {
    for (let i = 0; i < bufferLength; i++) {
        barHeight = dataArray[i];
        ctx.save();
        // sets the center for rotations
        ctx.translate(canvas.width / 2, canvas.height / 2);
        // rotate only understands radians
        ctx.rotate(i * Math.PI * 2 / bufferLength * 3.14);

        ctx.fillStyle = 'hsl(' + barHeight + ', ' + barHeight + '%, ' + barHeight / 4 + '%)';
        ctx.fillRect(canvas.width / 64, canvas.height / 16, barWidth, barHeight); // barHeight for fullsized bars
        ctx.fillRect(canvas.width * 64, canvas.height * 16, barWidth, barHeight);
        x += barWidth / 2;
        // restores the canvas to the previous save
        ctx.restore();
    }
}







container.addEventListener('click', async function () {
    //console.log("animating");

    console.log("Pressed");
    if (playedPreviously) {
        //audio1.play();
    }

    else {
        playedPreviously = true;
        // fetch file from API
        let headers = {
            'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2MzExZTZjNjkyYTJkYjk2YTRiZmJiYjAiLCJ1c2VybmFtZSI6ImFkbWluIiwicm9sZSI6IkFkbWluIiwiaWF0IjoxNjYzNzQ1MjY1LCJleHAiOjE2NjM4MzE2NjV9.vkkI2sG2_VGiqrv1G4zD2s3lIafdC7eOYBEkJkBguNY',
            'Range': 'bytes=1000000-2215622'
        }
        let url = 'http://localhost:3001/api/v1/audioFiles/getFile/63299fff95f55c20e3e08ae0';
        let response = await axios({
            responseType: 'arraybuffer',
            method: 'get', //you can set what request you want to be
            url: url,
            data: {},
            headers: headers
        });
        file = response.data;
        console.log(file);
        //audio1.src = URL.createObjectURL((new Blob([file], { type: "audio/mp3" })));
        //console.log(audio1.src);
        //audio1.load();



        //audio1.src = '91476_Glorious_morning.mp3';
        const audioContext = new AudioContext();
        // creates a special analyzer node which is used to expose audio time and frequency data
        analyser = audioContext.createAnalyser();

        source = audioContext.createBufferSource();
        const audioBuffer = await audioContext.decodeAudioData(response.data);
        source.buffer = audioBuffer;
        source.connect(analyser);
        source.loop = true;
        // connect the source and analyser node

        source.connect(audioContext.destination);

        //audio1.controls = true;
        //document.body.appendChild(audio1);

        //source.connect(audioContext.destination);
        //console.log(audioContext);

        // creating an audio source from an html audio element, 
        // taking audio1 element and creating an audio node of it to serve as the source

        // setting audio1 variable as the source
        //audioSource = audioContext.createMediaElementSource(audio1);

        // connects to the default audio output device


        // special property that represents the number of audio samples we want in 
        // our analyser data file (default value is 2048, but it can be: 32, 64, 128, 256, etc.

        // if we use a higher number, we will get more bars drawn on the canvas
        analyser.fftSize = 1024;

        //console.log(source);
        console.log(analyser);
        // read-only property that contains a number of data values we 
        // will have in the analyser data file

        // this will draw a bar on the audio visualiser for each of these
        // and we get exactly fftSize/2 of them
        const bufferLength = analyser.frequencyBinCount;
        console.log("BUFFER LENGTH", bufferLength);

        // bufferLength converted into a special type of array that can contain only unassigned 8-bit ints
        const dataArray = new Uint8Array(bufferLength);

        // sets the width of a single bar in the analyser
        const barWidth = canvas.width / bufferLength;

        console.log("BAR WIDTH", barWidth);
        let barHeight;
        // used for drawing bars next to each other
        let x;

        animate = () => {
            //if (!shouldPlay) return;
            console.log("Animating");
            x = 0;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            // copies the current frequency data into dataArray
            // each item in the array now represents a decibel value for a specific frequency
            // its value can be 0-255 -> will determine the height
            //analyser.getByteFrequencyData(dataArray);
            analyser.getByteFrequencyData(dataArray);
            console.log("DATA ARRAY", dataArray);
            drawWeirdVisualiser(bufferLength, x, barWidth, barHeight, dataArray);
            animationId = requestAnimationFrame(animate);
        }

        source.start();
        // pause playback
        source.playbackRate.value = 0;
    }

});