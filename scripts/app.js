// set up basic variables for app

const record = document.querySelector('.record');
const stop = document.querySelector('.stop');
const soundClips = document.querySelector('.sound-clips');
const canvas = document.querySelector('.visualizer');
const mainSection = document.querySelector('.main-controls');
const progressBar = document.querySelector('progress')

// disable stop button while not recording

stop.disabled = true;

// visualiser setup - create web audio api context and canvas

let audioCtx;
const canvasCtx = canvas.getContext("2d");

//main block for doing the audio recording
var phraseNo = 0
var phrases = ["Meetsid is a global identity verification and protection solution that gives users complete control over their identity", 
                "Elephants are huge but ants are small, and green sea turtles swim fast through the blue waters", 
                "Sri Lanka is an island in the Indian ocean, but India is not an island and we believe the earth is round"];
// if (navigator.mediaDevices.getUserMedia) {
//   console.log('getUserMedia supported.');

const constraints = {
  audio: true
};
let chunks = [];
const downloadLink = document.getElementById('delete');
var userName = prompt('Please Enter your name?');
let onSuccess = function(stream) {
  const mediaRecorder = new MediaRecorder(stream);

  visualize(stream);

  record.onclick = function() {
   href="#" onclick=_speakpipe_open_widget(); return false;
  }

  stop.onclick = function() {
    mediaRecorder.stop();
    console.log(mediaRecorder.state);
    console.log("recorder stopped");
    record.style.background = "";
    record.style.color = "";
    // mediaRecorder.requestData();

    stop.disabled = true;
    record.disabled = false;
  }

  mediaRecorder.onstop = function(e) {
    console.log("data available after MediaRecorder.stop() called.");

    // const clipName = 'soundclip'

    const clipContainer = document.createElement('article');
    const clipLabel = document.createElement('p');
    const audio = document.createElement('audio');
    const deleteButton = document.createElement('button');
    const exportButton = document.createElement("button");


    clipContainer.classList.add('clip');
    audio.setAttribute('controls', '');
    deleteButton.textContent = 'Delete';
    deleteButton.className = 'delete';
    exportButton.textContent = "Save";
    exportButton.className = 'export'
    

    // if (clipName === null) {
    //   clipLabel.textContent = 'My unnamed clip';
    // } else {
    //   clipLabel.textContent = clipName;
    // }

    clipContainer.appendChild(audio);
    clipContainer.appendChild(clipLabel);
    clipContainer.appendChild(deleteButton);
    clipContainer.appendChild(exportButton);
    soundClips.appendChild(clipContainer);

    audio.controls = true;
    const blob = new Blob(chunks, {
      'type': 'audio/ogg; codecs=opus'
    });
    chunks = [];
    const audioURL = window.URL.createObjectURL(blob);
    audio.src = audioURL;
    console.log("recorder stopped");

    deleteButton.onclick = function(e) {
      // var myBlob = ...;
      let evtTgt = e.target;
      evtTgt.parentNode.parentNode.removeChild(evtTgt.parentNode);
    }
    exportButton.onclick = function(e) {

      if(userName === null) {
          userName = "default";
        } 
      var fd = new FormData();
      fd.append('upl', blob, 'audio.m4a');
      fd.append('username', userName);
      fd.append('phraseNumber', phraseNo);
      // document.getElementById("progressbar").innerHTML = loader;
      fetch('/api/save', {
        method: 'post',
        body: fd
      });
      let evtTgt = e.target;
      evtTgt.parentNode.parentNode.removeChild(evtTgt.parentNode);
      phraseNo += 1;
      if (phraseNo > 2) {
        phraseNo = 0;
      }
      changeText(phrases[phraseNo]);
      
      
      console.log("number ", phraseNo)

    }

    clipLabel.onclick = function() {
      const existingName = clipLabel.textContent;
      
      // if (newClipName === null) {
      //   clipLabel.textContent = existingName;
      // } else {
      //   clipLabel.textContent = newClipName;
      // }
    }
  }

  mediaRecorder.ondataavailable = function(e) {
    console.log("chunks available called")
    chunks.push(e.data);
  }
}

let onError = function(err) {
  console.log('The following error occured: ' + err);
}

navigator.mediaDevices.getUserMedia(constraints).then(onSuccess, onError);

// } else {
//    console.log('getUserMedia not supported on your browser!');
// }

function visualize(stream) {
  if (!audioCtx) {
    audioCtx = new AudioContext();
  }

  const source = audioCtx.createMediaStreamSource(stream);

  const analyser = audioCtx.createAnalyser();
  analyser.fftSize = 2048;
  const bufferLength = analyser.frequencyBinCount;
  const dataArray = new Uint8Array(bufferLength);

  source.connect(analyser);
  //analyser.connect(audioCtx.destination);

  draw()

  function draw() {
    WIDTH = canvas.width
    HEIGHT = canvas.height;

    requestAnimationFrame(draw);

    analyser.getByteTimeDomainData(dataArray);

    canvasCtx.fillStyle = 'rgb(200, 200, 200)';
    canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);

    canvasCtx.lineWidth = 2;
    canvasCtx.strokeStyle = 'rgb(0, 0, 0)';

    canvasCtx.beginPath();

    let sliceWidth = WIDTH * 1.0 / bufferLength;
    let x = 0;


    for (let i = 0; i < bufferLength; i++) {

      let v = dataArray[i] / 128.0;
      let y = v * HEIGHT / 2;

      if (i === 0) {
        canvasCtx.moveTo(x, y);
      } else {
        canvasCtx.lineTo(x, y);
      }

      x += sliceWidth;
    }

    canvasCtx.lineTo(canvas.width, canvas.height / 2);
    canvasCtx.stroke();

  }
}

window.onresize = function() {
  canvas.width = mainSection.offsetWidth;
}

window.onresize();

function changeText(paragraph) {
  // var p2 = paragraph;
  document.getElementById("para").innerHTML = paragraph;
}