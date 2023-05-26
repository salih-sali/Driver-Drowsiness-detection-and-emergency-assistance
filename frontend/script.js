const video = document.getElementById('video')
const EAR_THRESHOLD =0.27 //.30 //0.27; //ear 
const MAR_THRESHOLD = 0.6;  

let earFrameCount = 0;
const ALARM_SOUND = new Audio('/music.wav');
const YAWN_SOUND =new Audio('/yawn.wav') 
let marFrameCount=0

console.log("js strted")
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

function euclideanDistance(p1, p2) {
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  return Math.sqrt(dx * dx + dy * dy);
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
      return Math.sqrt(dx*dx + dy*dy);
    }
    
    const ear = (distance(p2, p6) + distance(p3, p5)) / (2 * distance(p1, p4));
    //console.log(ear);
    
  
  return ear
}

video.addEventListener('play', () => {
 
  const canvas = faceapi.createCanvasFromMedia(video)
  document.body.append(canvas)
  const displaySize = { width: video.width, height: video.height }
  faceapi.matchDimensions(canvas, displaySize)
  setInterval(async () => {
    const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks()
    const resizedDetections = faceapi.resizeResults(detections, displaySize)
    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)
    faceapi.draw.drawDetections(canvas, resizedDetections)
    faceapi.draw.drawFaceLandmarks(canvas, resizedDetections)

    resizedDetections.forEach((detection) => {
      //console.log(detections)
      const leftEyeLandmarks = detection.landmarks.getLeftEye()
      const rightEyeLandmarks = detection.landmarks.getRightEye()

      const mouthLandmarks = detections[0].landmarks.getMouth();
      const mouthWidth = euclideanDistance(mouthLandmarks[0], mouthLandmarks[6]);
      const upperLipHeight = euclideanDistance(mouthLandmarks[2], mouthLandmarks[10]);
      const lowerLipHeight = euclideanDistance(mouthLandmarks[4], mouthLandmarks[8]);
      const mar = (upperLipHeight + lowerLipHeight) / (2 * mouthWidth);

      const leftEAR = getEAR(leftEyeLandmarks)
      const rightEAR = getEAR(rightEyeLandmarks)

      const ear = (leftEAR + rightEAR) / 2.0

     //console.log("ear : ",ear+"   mar :",mar)
      // Perform further actions based on the ear value   mar > MAR_THRESHOLD       ear < EAR_THRESHOLD

        if (ear < EAR_THRESHOLD) {
          earFrameCount++;
        }
         else {
          earFrameCount = 0;
        }
      
        if (earFrameCount >= 5) { //EAR_FRAME_THRESHOLD
          ALARM_SOUND.play();
         
            const ctx = canvas.getContext('2d');
            ctx.font = '30px Arial';
            ctx.fillStyle = 'red';
            ctx.fillText('Drowsiness Detected, take a break', 10, 50);

          earFrameCount = 0;
        }


        if (mar > MAR_THRESHOLD) {
          marFrameCount++;
        } else {
          marFrameCount = 0;
        }
        
        if (marFrameCount>=6) { //MAR_FRAME_THRESHOLD
          //ALARM_SOUND.play();
          const ctx = canvas.getContext('2d');
          ctx.font = '30px Arial';
          ctx.fillStyle = 'blue';
          ctx.fillText('Yawning Detected', 150, 50);
          YAWN_SOUND.play();
        }
      

    })
  }, 100)
 
  // setTimeout(() => canvas.remove(), 10000);
})

