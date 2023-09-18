let playPauseId = document.querySelector("#playPause");
let innerCircleImg = document.querySelector("#innerCircleImg");
let soundId = document.querySelector("#sound");
innerCircleImg.style.animationPlayState = "paused";
let playNextId = document.querySelector("#playNext");
let replayId = document.querySelector("#replay");
let playPrevId = document.querySelector("#playPrev");
let progressId = document.querySelector("#progress");
let progressDivId = document.querySelector("#progressDiv");

let playNext = function () {
  if (j >= i) {
    j = 0;
  }
  loadSong(fileList[j]);
  j++;
}

let songPlay = function () {
  flag = 1;
  innerCircleImg.style.animationPlayState = "running";
  playPauseId.innerHTML = '<button><i class="fa fa-pause"></i></button>'
  soundId.pause();
  soundId.play();
}
let flag = 0;

// var arraySong = ["songs\song1.mp3","songs\song2.mp3","songs\song3.mp3"]
let jsmediatags = window.jsmediatags;//dont know use of it,i think object of jsmedia tag

let fileList = [];
let i = 0;
let j = 0;
xId = document.querySelector("#x");
xId.addEventListener("change", (event) => {
  if (xId.files.length > 0) {
    fileList = [];
    i = 0;
    j = 0;
    for (; i < xId.files.length; i++)
      fileList.push(xId.files[i])
    // console.log(i);

    loadSong(fileList[j]);
    // songPlay();
    j++;
  }
  else {
    alert("NO file Selected. Continuing with previous Data.")
  }

})

let loadSong = function (file) {
  jsmediatags.read(file, {
    onSuccess: function (tag) {
      console.log(tag.tags);
      let format, data;
      if (tag.tags.picture != undefined) {
        if(tag.tags.picture.data != undefined&&tag.tags.picture.format!=undefined){
          data = tag.tags.picture.data;
          format = tag.tags.picture.format;
          let base64String = "";
          for (let i = 0; i < data.length; i++) {
            base64String += String.fromCharCode(data[i]);
          }
          let myUrl = "data:" + tag.tags.picture.format + ";base64," + window.btoa(base64String);
          document.getElementById('innerCircleImg').setAttribute('src', myUrl);
          document.querySelector("#mainbox").style.backgroundImage = `url(data:${format};base64,${window.btoa(base64String)})`;
          document.querySelector("#singer").textContent = tag.tags.artist;
          document.querySelector("#musicName").textContent = tag.tags.title;
        }
        else{
          document.querySelector("#musicName").textContent = "failed to read music title";
          document.querySelector("#singer").textContent = "failed to read music title";
        }
      }
      else {
        document.querySelector("#musicName").textContent = "failed to read music title";
        document.querySelector("#singer").textContent = "failed to read music title";
      }
      let userUrl = URL.createObjectURL(file);
      document.querySelector("#sound").setAttribute('src', userUrl);
      let mysound = new Audio(userUrl);                                                           //
      let time;                                                                                   //
      mysound.addEventListener("canplaythrough", () => {                                          //
        URL.revokeObjectURL(userUrl);                                                             //   DONE ALL THESE WITH t.ontimeupdate
        time = mysound.duration;                                                                  //
        let str = timeToString(time);                                                             //       
        document.getElementById("duration").innerText = str;                                      //
      })
      songPlay();
    },
    onError: function (error) {
      console.log(error);
    }
  });
}

let timeToString = function (time) {
  let minute = Math.floor(time / 60);
  let second = time % 60;
  minute = minute < 10 ? "0" + minute : minute;
  second = Math.floor(second);
  second = second < 10 ? "0" + second : second;
  return "" + minute + ":" + second;
}
soundId.ontimeupdate = function () {
  let strin = timeToString(soundId.currentTime);
  document.querySelector("#currentTime").innerHTML = strin;
  let currProgress = (soundId.currentTime / soundId.duration) * 100;
  progressId.style.width = `${currProgress}%`;
}
playPrevId.addEventListener("click", function () {
  if (j == 1) {
    j = i + 1;
  }
  j -= 2;
  loadSong(fileList[j]);
  j++;
})
progressDivId.addEventListener("click", (event) => {
  let xyx = (event.offsetX / event.target.clientWidth) * (soundId.duration);
  soundId.currentTime = xyx;
})
replayId.addEventListener("click", function () {
  loadSong(fileList[j - 1]);
})
playNextId.addEventListener("click", function () {
  playNext();
})
soundId.addEventListener("ended", function () {
  playNext();
})
playPauseId.addEventListener("click", function () {
  if (flag == 0 && fileList[j]!=null) {
    flag = 1;
    innerCircleImg.style.animationPlayState = "running";
    playPauseId.innerHTML = '<button><i class="fa fa-pause"></i></button>'
    soundId.play();
  }
  else {
    flag = 0;
    innerCircleImg.style.animationPlayState = "paused";
    playPauseId.innerHTML = '<button><i class="fa fa-play"></i></button>'
    soundId.pause();
  }
})

// Disable right-click
document.addEventListener('contextmenu', (e) => e.preventDefault());

function ctrlShiftKey(e, keyCode) {
  return e.ctrlKey && e.shiftKey && e.keyCode === keyCode.charCodeAt(0);
}

document.onkeydown = (e) => {
  // Disable F12, Ctrl + Shift + I, Ctrl + Shift + J, Ctrl + U
  if (
    e.number === 123 ||
    ctrlShiftKey(e, 'I') ||
    ctrlShiftKey(e, 'J') ||
    ctrlShiftKey(e, 'C') ||
    (e.ctrlKey && e.number === 'U'.charCodeAt(0))
  )
    return false;
  console.log(e);
};

/* css part */
