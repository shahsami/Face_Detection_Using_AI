//creating video elements
const video = document.getElementById('video')

//calling out all the models asyncronously 
Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
    faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
    faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
    faceapi.nets.faceExpressionNet.loadFromUri('/models') // for detectin the expression
]).then(startVideo)


//hooking up the webcame to video element
function startVideo() {
    navigator.getUserMedia(
        { video: {} },
        stream => video.srcObject = stream,
        err => console.error(err)  
    )
}

video.addEventListener('play', () => {
    //adding the canvas on face
    const canvas = faceapi.createCanvasFromMedia(video)
    document.body.append(canvas)
    const displaySize = { width: video.width, height: video.height }
    faceapi.matchDimensions(canvas, displaySize)
    // setting up the face detection
    setInterval(async () => {
        const detections = await faceapi.detectAllFaces(video,
            new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions()
            const resizedDetections = faceapi.resizeResults(detections, displaySize)
            canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)
            faceapi.draw.drawDetections(canvas, resizedDetections)  // detecting the detectons
            faceapi.draw.drawFaceLandmarks(canvas, resizedDetections) //detecting the landmarks
            faceapi.draw.drawFaceExpressions(canvas, resizedDetections) // detection the expression     
    }, 100)
})
