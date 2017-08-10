const electron = require('electron')
const desktopCapturer = electron.desktopCapturer
const electronScreen = electron.screen
const shell = electron.shell

const fs = require('fs')
const os = require('os')
const path = require('path')

const screenshot = document.getElementById('screen-shot')
const screenshotMsg = document.getElementById('screenshot-path')

const ipc = require('electron').ipcRenderer;

screenshot.addEventListener('click', function (event) {
    screenshotMsg.textContent = '준비하시고~'
  let options = { 
      types: ['screen'],
      thumbnailSize:{
          width:1920,
          height:1080
      }
 }

desktopCapturer.getSources({types: ['window', 'screen']}, (error, sources) => {
  if (error) throw error
  for (let i = 0; i < sources.length; ++i) {
    if (sources[i].name === 'Screen 1') {
        let constraints = {
            audio:{
                mandatory: {                
                    chromeMediaSource:'screen',
                }
            },
            video:{
                mandatory: {                
                    chromeMediaSource:'desktop',
                    chromeMediaSourceId:sources[i].id,
                    minWidth:1280,
                    maxWidth:1920,
                    minHeight:720,
                    maxHeight:1080
                }
            }
        }
        navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
            screenshotMsg.textContent = "success!";
            console.log(stream.id);
            ipc.send('start_stream',stream.id);
            document.querySelector('video').src = URL.createObjectURL(stream);
        }).catch((err) => {
            console.log(err);
        })
    }
  }
})

function handleStream (stream) {
    console.log(stream);
    document.querySelector('video').src = URL.createObjectURL(stream)
}

function handleError (e) {
  console.log(e)
}