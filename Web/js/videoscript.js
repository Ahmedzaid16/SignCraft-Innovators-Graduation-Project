
const video = document.getElementById('video');  
const recorded_v_elem = document.querySelector("#display_video")
const playRecordBtn = document.getElementById('playRecord')
playRecordBtn.disabled = true;  
const startRecordBtn = document.getElementById('startRecord');  
const stopRecordBtn = document.getElementById('stopRecord'); 
const translateBtn = document.getElementById('translate');
const divvideo = document.getElementById('divvideo'); 
translate.disabled = true;  
const port = 8000

stopRecordBtn.disabled = true; 
let stream = null
let mediaRecorder = null
let recordedblob = [];  
let record_bl = null
let arr = null


const get_start = async () => {
  startRecordBtn.disabled = true;  
  playRecordBtn.disabled = true;
  translateBtn.disabled = true

  
  try{
  stream= await navigator.mediaDevices.getUserMedia({video: true})  
  console.log("successful access")
    video.srcObject =stream
  }catch (error){  
    console.error('Error accessing camera:', error);  
  }

  recordedblob=[]

  videostram = video.srcObject.getTracks()
  const tracks =videostram[0];
  

  mediaRecorder = new MediaRecorder(video.srcObject);  
  mediaRecorder.ondataavailable = async e => {
    await console.log("data is available for the media recorder")
    await recordedblob.push(e.data)
  }  

  mediaRecorder.start();  
  
  setTimeout(() => {
     stopRecordBtn.disabled = false; 
  }, 2000);
  

}



const stoprec = async () => {
  
  startRecordBtn.disabled = false;  
  stopRecordBtn.disabled = true; 
  playRecordBtn.disabled = false;
  mediaRecorder.stop();  
  track = stream.getTracks();
  track[0].stop()
  console.log("successful stop")
}


const dis_play = async () => {

  startRecordBtn.disabled = false;  
  stopRecordBtn.disabled = true; 
  
    video.style.display = "none"
  recorded_v_elem.style.display = "block"

  const superbuffer = new Blob(recordedblob ,{'type':"video/mp4"})
  recorded_v_elem.pause()
  recorded_v_elem.src= window.URL.createObjectURL(superbuffer)
  recorded_v_elem.controls=true
  recorded_v_elem.load()

}



startRecordBtn.addEventListener('click', () => { 

video.style.display = "block"
recorded_v_elem.style.display = "none"

get_start()

}) 

stopRecordBtn.addEventListener('click', () => { 
  if(!stream)
  {
        console.log(`stream is empty`)}
  else{ 
    stoprec()}

}); 

playRecordBtn.addEventListener('click', () => { 
  dis_play()
  let rec = async ()=> await console.log(recordedblob)
  rec()
  record_bl =  new Blob(recordedblob ,{'type':"video.mp4"})
  translateBtn.disabled = false; 


})

translateBtn.addEventListener('click', async (e) => {
  e.preventDefault()

  startRecordBtn.disabled = true;
  stopRecordBtn.disabled = true;
  playRecordBtn.disabled = true;
  videoDataForm = new FormData()
  videoDataForm.append('video',record_bl)
  console.log(videoDataForm)


    axios.post(`/api/video/upload`,videoDataForm)
          .then((res) => {
            console.log (res.data)

          }).catch((err) => {
            console.log (err)

          });

         axios.get(`/api/video/gettranslate`)
          .then((res) => {
            console.log (res.data.translate)
            translation=res.data.translate
              label= document.createElement('div')
              label.setAttribute("id" ,"new") 
              label.innerHTML = `<div><label> the translation </label></div> <br> <div>
              <label  style ="resize:none; background-color:#fff; color :black;border-radius: 10px; padding:10px ;margin :20px 5px ">${translation}<label></div>
              `
              divvideo.appendChild(label)
          }).catch((err) => {
            console.log (err)

          });
  


    translateBtn.disabled = true
    startRecordBtn.disabled = false;

    startRecordBtn.addEventListener('click', () => { 
      label.remove()

      }) 


    })
