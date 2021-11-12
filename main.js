const video_players = [];

/**
 * This gets called when youtube is ready to make video players
 */
function onYouTubeIframeAPIReady() {
    document.querySelectorAll(".video .player").forEach(player => {
        video_players.push(new YT.Player(player, {
          height: '390',
          width: '640',
        videoId: player.getAttribute("data-video-id"),
          playerVars: {
            'playsinline': 1
          },
          events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
          }
        }));
    });
}

/**
 * Called when the video player is ready
 * 
 * You can start playback and such in this function safely
 * 
 * @param {Object} event - The event object that contains the video player
 */
function onPlayerReady(e) {
    console.log("Video player is ready");
    
    if (e.target.getIframe().getAttribute("data-autoplay") === "1") {
        e.target.mute();
        e.target.playVideo();   
    }
}

/**
 * Called whenever the player starts, pauses, ends, etc
 * 
 * This is fired whenever the player's state changes. Evaluate the player's state 
 * in this function and act accordingly
 * 
 * @param {Object} event - The event object that contains the video player
 */
function onPlayerStateChange(e) {
    console.log("Video player state has changed");
    // const container = document.querySelector(".container.image");
    const container = e.target.getIframe().closest(".container.image");
    const this_video_id = e.target.getVideoData().video_id;
    const all_other_videos = video_players.filter(video => video.getVideoData().video_id !== this_video_id);

    if (e.data === YT.PlayerState.PLAYING) {
        // add the .can_stick to .container.image
        if (container) {
            container.classList.add("can_stick");    
        }
        
        all_other_videos.forEach(video => video.pauseVideo());
    }

    if (e.data === YT.PlayerState.PAUSED) {
        // remove the .can_stick from .container.image
        if (container) {
            container.classList.remove("can_stick");
            container.classList.remove("sticky");    
        }
    } 
}

const watcher = new Watch(".container.image");

watcher.inView(function () {
    const container = document.querySelector(".container.image.can_stick")
    if (container) {
        container.classList.remove("sticky");
    }
    
}).outView(function () {
    const container = document.querySelector(".container.image.can_stick")
    if (container) {
        container.classList.add("sticky");
    }
});

const close_button = document.querySelector(".stick .fa-close");

close_button.addEventListener("click", function (e) {
    e.preventDefault();

    // get the sticky video's container
    const container = e.target.closest(".stick");

    // find the video player in the sticky div
    const video = container.querySelector("[data-video-id]");

    // get the video id from the video player
    const video_id = video.getAttribute("data-video-id");

    // get the video player from the video_players array
    const player = video_players.find(video => video.getVideoData().video_id === video_id);

    // unstick the sticky
    document.querySelector(".sticky").classList.remove("sticky");
    document.querySelector(".can_stick").classList.remove("can_stick");

    // pause the video
    player.pauseVideo();
    
});
