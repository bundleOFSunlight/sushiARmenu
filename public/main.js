import { createChromaMaterial } from '/chroma-video.js';


const THREE = window.MINDAR.IMAGE.THREE;
//const baseUrl = process.env.baseURL || "http://localhost:3000"

window.addEventListener('load', async () => {
    //function to fetch videos and create a div of the video elements 
    const mind_file = await cloudinaryfetch();
    // pre-load videos by getting the DOM elements
    const loadedVideos = document.querySelectorAll(".chroma-vid");
    for (const vid of loadedVideos) {
        await vid.load();
    }
    //start button to overcome IOS browser
    await onInit(loadedVideos, mind_file);
    //button will appear upon load 
    const startButton = document.getElementById('startbutton');
    startButton.style.visibility = "visible";
    startButton.addEventListener('click', async () => {
        hideDiv();
        startButton.style.display = "none"; //button will disappear upon click
    })
});

//helper functions

async function cloudinaryfetch() {
    const key = `007d1d8e-425f-474d-a8a0-7235cad917c6`
    const baseUrl = "http://mind-ar-cms-dev.ap-southeast-1.elasticbeanstalk.com"
    const result = await axios.get(`${baseUrl}/file_management/public/file_obj/${key}`);
    const myObject = result.data.data.data;
    await createVideoDivision(myObject);
    return result.data.data.mind_file
}

//helper function which creates one division consisting of multiple video elements
//using the URLs fetched from API
async function createVideoDivision(reviewObject) {
    const currentDiv = document.getElementById("my-ar-container");
    const newDiv = document.createElement("div");
    newDiv.setAttribute("id", "newdiv");
    for (const value of reviewObject) {
        const video = await createVideoElement(value);
        newDiv.appendChild(video);
    }
    document.body.insertBefore(newDiv, currentDiv);
}

///helper function which returns a video Element 
async function createVideoElement(videoUrl) {
    const video = document.createElement("video");
    if (video.canPlayType("video/mp4")) {
        video.setAttribute('src', videoUrl);
        video.setAttribute('preload', 'auto');
        video.setAttribute('crossorigin', 'anonymous');
        video.setAttribute('webkit-playsinline', 'webkit-playsinline');
        //video.setAttribute('playsinline', 'playsinline');
        video.setAttribute('loop', 'true');
        video.setAttribute('style', 'display: none; ');
        video.setAttribute('class', 'chroma-vid');
        video.setAttribute('type', 'video/mp4');
        video.muted = true;
        video.playsInline = true;
    }
    return video;
}

async function onInit(loadedChromaVids, mind_file) {
    //should listen for clicks only after first page
    async function eventHandler(e) {
        await start_ar(loadedChromaVids, mind_file);
        // remove this handler
        document.body.removeEventListener('click', eventHandler, false);
    }
    document.body.addEventListener("click", eventHandler);
}

async function start_ar(loadedChromaVids, mind_file) {
    const mindarThree = new window.MINDAR.IMAGE.MindARThree({
        container: document.querySelector("#my-ar-container"),
        imageTargetSrc: mind_file,

    });
    const { renderer, scene, camera } = mindarThree;

    const anchors = new Array();
    for (let i = 0; i < loadedChromaVids.length; i++) {

        const GSvideo = loadedChromaVids[i];
        const GSplane = createGSplane(GSvideo, 1, 3 / 4);

        anchors.push(mindarThree.addAnchor(i));
        if (i < anchors.length) {
            const anchor = anchors[i];

            anchor.group.add(GSplane);

            anchor.onTargetFound = () => {
                // video.muted = false;
                GSvideo.play();
            }
            anchor.onTargetLost = () => {
                GSvideo.pause();
            }
        }
    }
    await mindarThree.start();
    await renderer.setAnimationLoop(async () => {
        await renderer.render(scene, camera);
    });
}


function createGSplane(GSvideo) {
    const GStexture = new THREE.VideoTexture(GSvideo);
    const GSgeometry = new THREE.PlaneGeometry(1, 1080 / 1920);
    const GSmaterial = createChromaMaterial(GStexture, 0x00ff38);
    const GSplane = new THREE.Mesh(GSgeometry, GSmaterial);
    GSplane.scale.multiplyScalar(2);
    //GSplane.position.z = 0.05;
    GSplane.rotation.z = Math.PI / 2;
    //GSplane.position.x = -0.2;

    return GSplane
}

function hideDiv() {
    const div = document.getElementById("welcome");
    div.classList.toggle('hidden');
}