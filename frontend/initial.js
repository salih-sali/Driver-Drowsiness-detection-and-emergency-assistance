let avgEAR
function redirectToNav() {
    window.location.href = 'nav.html';
  }

  const phone= localStorage.getItem("phone");
Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
    faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
    faceapi.nets.faceRecognitionNet.loadFromUri('/models')
]).then(startVideo)


function startVideo() {
    navigator.getUserMedia(
        { video: {} },
        stream => video.srcObject = stream,
        err => console.error(err)
    )
}


function getEAR(eyeLandmarks) {

    const p1 = eyeLandmarks[0]; // left corner of the eye
    const p2 = eyeLandmarks[1]; // top left of the eye
    const p3 = eyeLandmarks[2]; // top right of the eye
    const p4 = eyeLandmarks[3]; // right corner of the eye
    const p5 = eyeLandmarks[4]; // bottom right of the eye
    const p6 = eyeLandmarks[5]; // bottom left of the eye

    const distance = (p1, p2) => {
        const dx = p2.x - p1.x;
        const dy = p2.y - p1.y;
        return Math.sqrt(dx * dx + dy * dy);
    }
    const ear = (distance(p2, p6) + distance(p3, p5)) / (2 * distance(p1, p4));
      return ear
}

async function showVideo() {
    cam.style.display = 'block';
    console.log("starting...");

    // Get the video element
    const videoEl = document.getElementById('video');

    // Wait for the video to finish loading
    await new Promise(resolve => {
        videoEl.addEventListener('loadedmetadata', resolve);
    });

   
    const canvas = faceapi.createCanvasFromMedia(videoEl);
    document.body.append(canvas);

    const displaySize = { width: video.width, height: video.height }
    faceapi.matchDimensions(canvas, displaySize)

    // Define face detection options
    const detectionOptions = new faceapi.TinyFaceDetectorOptions();

    let totalEAR = 0;
    let numFrames = 0;

    // Start monitoring the EAR
    const intervalId = setInterval(async () => {
        // Detect the face landmarks and compute the EAR
        const fullFaceLandmarks = await faceapi.detectSingleFace(videoEl, detectionOptions)
            .withFaceLandmarks();
        const resizedDetections = faceapi.resizeResults(fullFaceLandmarks, displaySize)
        canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)
        faceapi.draw.drawDetections(canvas, resizedDetections)
        faceapi.draw.drawFaceLandmarks(canvas, resizedDetections)
        if (fullFaceLandmarks) {
            const leftEyeLandmarks = fullFaceLandmarks.landmarks.getLeftEye();
            const rightEyeLandmarks = fullFaceLandmarks.landmarks.getRightEye();

            const leftEAR = getEAR(leftEyeLandmarks)
            const rightEAR = getEAR(rightEyeLandmarks)

            const ear = (leftEAR + rightEAR) / 2.0
            totalEAR += ear;
            numFrames++;
            console.log("ear ", ear, " totalEAR ", totalEAR, " numFrames ", numFrames)
            document.getElementById('ear').textContent = `Details :  current EAR: ${ear}   .   num of Frames : ${numFrames}`
        }
    }, 100); // Monitor the EAR every 100ms

    
    await new Promise(resolve => setTimeout(resolve, 7000));// Wait for 7 seconds

    // Stop monitoring the EAR
    clearInterval(intervalId);

    // Compute the average EAR
    avgEAR = totalEAR / numFrames;
    console.log("Average EAR: ", avgEAR.toFixed(5));

    // Store the EAR in localStorage
    localStorage.setItem('EAR', avgEAR.toFixed(5));
    // Remove the canvas element
    //document.body.removeChild(canvas);
    document.getElementById('earFinal').textContent = `EAR: ${avgEAR.toFixed(5)}`

    const apiUrl = 'http://localhost:3001/update-ear';
  const payload = {
    phone: phone,
    ear: avgEAR-.03
  };

  const requestOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  };

  fetch(apiUrl, requestOptions)
    .then(response => response.json())
    .then(data => {
      alert(data.message);
    })
    .catch(error => {
      alert('Error:', error);
    });


}
showVideo()