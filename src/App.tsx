import React from "react";
import logo from "./logo.svg";
import "./App.css";
import Video from "./components/Video";
import { VideoList, VideoTags } from "./components/Video/types";
import { isMobile, isTablet } from "react-device-detect";

const videos: VideoList[] = [
  {
    quality: "720p",
    type: "video/mp4",
    src: "https://s3.eu-central-1.amazonaws.com/pipe.public.content/short.mp4",
  },
];

const videos3: VideoList[] = [
  {
    quality: "720p",
    type: "video/mp4",
    src: "videos/720.mp4",
  },
  {
    quality: "360p",
    //type: "video/avi",
    src: "videos/360.mp4",
  },
  {
    quality: "640p",
    //type: "video/avi",
    src: "videos/640.mp4",
  },
  {
    quality: "1280p",
    //type: "video/avi",
    src: "videos/1280.mp4",
  },
];

const videos2: VideoList[] = [
  {
    quality: "720p",
    type: "video/webm",
    src: "http://edge-assets.wirewax.com/blog/vidData/example1080.webm",
  },
  {
    quality: "720p",
    type: "video/ogg",
    src: "http://techslides.com/demos/sample-videos/small.ogv",
  },
  {
    quality: "720p",
    type: "video/mp4",
    src: "http://techslides.com/demos/sample-videos/small.mp4",
  },
  {
    quality: "720p",
    type: "video/3gp",
    src: "http://techslides.com/demos/sample-videos/small.3gp",
  },
];

const tags: VideoTags[] = [
  {
    tag: "primera parte",
    time: {
      hours: "0",
      seconds: "00",
      minutes: "00",
    },
  },
  {
    tag: "segunda",
    time: {
      hours: "0",
      seconds: "12",
      minutes: "00",
    },
  },
  {
    tag: "tercera",
    time: {
      hours: "0",
      seconds: "22",
      minutes: "00",
    },
  },
];

function App() {
  return (
    <div className="App" style={{ width: isMobile ? "auto" : "800px" }}>
      <div>
        <Video
          videos={videos3}
          // poster="poster.jpg"
          //preload="metadata"
          preload="auto"
          autoPlay
          //playsInline
          muted
          loop
          rounded
          controls
          tags={tags}
          buttonsColor="red"
          volumeColor={{
            thumb: "yellow",
          }}
          progressColor={{
            thumb: "yellow",
            bar: "orange",
            buffered: "green",
            text: "purple",
          }}
          qualitySelectorColor={{
            background: "blue",
            textColor: { primary: "yellow", selected: "red" },
            borderColor: "yellow",
            hover: {
              background: "purple",
              color: "red",
            },
          }}
          time={{ color: "red" }}
        />
      </div>
    </div>
  );
}

export default App;
