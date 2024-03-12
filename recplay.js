let PortAudio=require('./build/Release/PA.node');
if(process.platform=='darwin') {
} else if(process.platform=='win32') {
} else {
  console.log("TODO: not implemented yet");
  process.exit(1);
}
    

const freq=48000;
PortAudio.initSampleBuffers(freq,freq);

PortAudio.listDevices();
PortAudio.startMic();
PortAudio.startSpeaker();

// "******      " のような文字列を返す
function getVolumeBar(l16sample) {
  const vol=Math.abs(l16sample);
  const bar = vol / 1024;
  const space = 32-bar;
  return "*".repeat(bar)+" ".repeat(space); 
}

let g_maxSample=0;
setInterval(()=>{
  const samples=PortAudio.getRecordedSamples();
  // 最大音量を記録
  g_maxSample=0;
  for(let i=0;i<samples.length;i++) {
    const sample=samples[i];    
    if(sample>g_maxSample) g_maxSample=sample; 
  }
  console.log("volume:",getVolumeBar(g_maxSample));
  PortAudio.pushSamplesForPlay(samples);
  PortAudio.discardRecordedSamples(samples.length);  
},25);

