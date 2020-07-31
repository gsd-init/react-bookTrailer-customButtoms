import React, { useState, useRef } from "react";
import Container from "@material-ui/core/Container";
import ReactPlayer from "react-player";
import { makeStyles } from "@material-ui/core/styles";
import PlayerControls from "./PlayerControls";
import screenfull from 'screenfull';


const useStyles = makeStyles({
  playerWrapper: {
    width: "100%",
    position: "relative",
    backgroundColor: '#181C4C',
    
  },
  containerAll: {
    // paddingTop: '100px',   
    // padding: '0',
    //  margin: '0',
    display: 'flex',
    width: '100vw',
    height: '100vh',
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center'
  },
});

const format = (seconds) => {
  if(isNaN(seconds)) {
    return '00:00'
  }

  const date = new Date(seconds * 1000);
  const hh = date.getUTCHours();
  const mm = date.getUTCMinutes();
  const ss = date.getUTCSeconds().toString().padStart(2, '0')
  if(hh) {
    return `${hh}:${mm.toString().padStart(2,'0')}:${ss}`
  }

  return `${mm}:${ss}`;
};

let count = 0;

function BookTrailer() {
  const classes = useStyles();
  const [state, setState] = useState({
    playing: true,
    muted: false,
    volume: 0.5,
    played: 0,
    // seeking: false,
    seeking: false,
    height: "100px",
    width: "1000px"
  });
 
  const [timeDisplayFormat, setTimeDisplayFormat] = useState("normal"); 

  const { playing, muted, volume, played, seeking } = state;
  
  const playerRef = useRef(null);
  const playerContainerRef = useRef(null);

  const controlsRef = useRef(null);


  const handlePlayPause = () => {
    setState({ ...state, playing : !state.playing });
  };

  const handleMute = () => {
    setState({...state, muted : !state.muted})
  };

  const handleVolumeChange = (e, newValue) => {
    setState({
      ...state,
      volume: parseFloat(newValue / 100),
      muted: newValue === 0 ? true : false,    
    });
  }
  
  const handleVolumeSeekUp = (e, newValue) => {
    setState({
      ...state,
      volume:parseFloat(newValue / 100),
      muted: newValue === 0 ? true : false,    
    });
  }

  const toggleFullScreen = () => {
    screenfull.toggle(playerContainerRef.current); 
  };

  const handleProgress = (changeState) => {
    console.log(changeState);

    if(count>1) {
      controlsRef.current.style.visibility = "hidden";
      count = 0
    }

    if(controlsRef.current.style.visibility == "visible") {
      count+=1
    }

    if(!state.seeking) {
      setState({ ...state, ...changeState });
    };    
  };

  const handleSeekSlider = (e, newValue) => {
    setState({ ...state, played:parseFloat(newValue / 100) })
  };

  const handleSeekMouseDown = (e) => {
    setState({...state, seeking: true});
  };

  const handleSeekMouseUp = (e, newValue) => {
    setState({...state, seeking: false});
    playerRef.current.seekTo(newValue / 100);
  };

  const handleChangeDisplayFormat = () => {
    setTimeDisplayFormat(
       timeDisplayFormat === "normal" ? "remaining" : "normal");
  };

  const handleMouseMove = () => {
    controlsRef.current.style.visibility = "visible";
    count = 0
  };

  const currentTime = playerRef.current ? playerRef.current.getCurrentTime() :'00:00';
  const duration = playerRef.current ? playerRef.current.getDuration() :'00:00';

  const elapsedTime =
   timeDisplayFormat === "normal"
    ? format(currentTime)
    : `-${format(duration - currentTime)}`;


  const totalDuration = format(duration);

  return (
    <>    
      <Container maxWidth="xs" className={classes.containerAll}>
        <div
         ref={playerContainerRef}
         className={classes.playerWrapper}
         onMouseMove={handleMouseMove}
         >
          <ReactPlayer
            ref={playerRef}
            width="100%"
            height="100%"
            url="video/book-trailer.mp4"
            //url='https://www.youtube.com/watch?v=wWyQeP44s88'
            muted = {muted}
            playing = {playing}
            volume = {volume}
            onProgress = {handleProgress}
          />

          <PlayerControls
          ref={controlsRef}
          onPlayPause = {handlePlayPause}
          playing = {playing}
          muted = {muted}
          onMute={handleMute}
          onVolumeChange={handleVolumeChange}
          onVolumeSeekUp={handleVolumeSeekUp}
          volume={volume}
          onToggleFullScreen = {toggleFullScreen}
          played = {played}
          onSeekSlider = {handleSeekSlider}
          onSeekMouseDown = {handleSeekMouseDown}
          onSeekMouseUp = { handleSeekMouseUp}
          elapsedTime = {elapsedTime}
          totalDuration = {totalDuration}
          onChangeDisplayFormat = {handleChangeDisplayFormat}
          
          />
        </div>
      </Container>
    </>
  );
}

export default BookTrailer;