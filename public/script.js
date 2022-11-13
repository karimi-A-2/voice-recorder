console.log("Running...");
var data;
var chunks = [];
var audioBlob;
var mediaRecorder = null;
var recDate;
getData();

function getData() {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", '/data', true);
    xhr.onreadystatechange = () => {
        if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
            data = JSON.parse(xhr.response)
            updateTrackList();
            addListners();
        }
    }
    xhr.send();
}

function postData() {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", '/data', true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onreadystatechange = () => {
        if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
            console.log('data updated');
        }
    }
    xhr.send(JSON.stringify(data));
}

function addListners() {
    var uploadBtn = document.getElementById('upload-btn')
    uploadBtn.addEventListener('click', upload)

    // record-btn
    var recordBtn = document.getElementById('record-btn')
    recordBtn.addEventListener('click', startRecord)

    var saveAndStopBtn = document.getElementById('save-and-stop-btn')
    saveAndStopBtn.addEventListener('click', saveAndStop)

    var closeSaveRecordingButton = document.getElementById('close-modal-btn-2')
    closeSaveRecordingButton.addEventListener('click', closeSaveRecordingModal)

    // stop-rec btn
    var stopBtn = document.getElementById('stop-btn')
    stopBtn.addEventListener('click', stopRecord)

    // add-class-btn
    var addClassButton = document.getElementById('add-class-btn')
    addClassButton.addEventListener('click', addClass)

    var saveClassButton = document.getElementById('save-class-button')
    saveClassButton.addEventListener('click', saveClass)

    var closeModalButton = document.getElementById('close-modal-btn')
    closeModalButton.addEventListener('click', closeAddClassModal)

    var dismissClassButton = document.getElementById('dismiss-class-button')
    dismissClassButton.addEventListener('click', closeAddClassModal)

    // class-checkbox
    var checkList = document.querySelectorAll('.class-checkbox input')
    checkList[0].addEventListener('change', allChange)
    for (let i = 1; i < checkList.length; i++) {
        const element = checkList[i];
        element.addEventListener('change', updateTrackList)
    }

    // select
    var classSelects = document.querySelectorAll(".class-type-select select")
    classSelects.forEach(element => {
        element.addEventListener('change', changeClass)
    });
}

function upload(event) {
    alert('upload');
    console.log("upload");
}

function startRecord(event) {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        alert('Your browser does not support recording!');
        return;
    }
    // start recording
    navigator.mediaDevices.getUserMedia({
        audio: true,
    })
        .then((stream) => {
            mediaRecorder = new MediaRecorder(stream);
            mediaRecorder.start();
            mediaRecorder.ondataavailable = (e) => {
                chunks.push(e.data);
            };
            mediaRecorder.onstart = () => {
                let timer = 0;
                let timeDOM = document.getElementById('time');
                console.log(timeDOM);
                setInterval(() => {
                    timer++;
                    timeDOM.innerHTML = `${(0)}:${timer % 60}`
                }, 1000);

                document.getElementById("upload-record").style.display = 'none';  // block
                document.getElementById("time-stop").style.display = 'flex';  // none

                let stopRecCheckBox = document.getElementById('stop-rec-checkbox');
                if (stopRecCheckBox.checked) {
                    let stopRecSeconds = document.getElementById('stop-rec-seconds');
                    let timeout = parseInt(stopRecSeconds.value) * 1000;
                    console.log(timeout);
                    setTimeout(() => {
                        if (mediaRecorder.state == 'recording') {
                            mediaRecorder.stop();
                        }
                    }, timeout);
                }
            }
            mediaRecorder.onstop = () => {
                recDate = new Date();
                audioBlob = new Blob(chunks, { type: 'audio/mp3' });
                chunks = [];

                document.getElementById("upload-record").style.display = 'block';  // block
                document.getElementById("time-stop").style.display = 'none';  // none
                showsaveRecordingModal();
            };
        })
        .catch((err) => {
            console.error(`The following error occurred: ${err}`);
        });
}

function stopRecord(event) {
    mediaRecorder.stop();
}

function showsaveRecordingModal(event) {
    let saveRecordingModal = document.getElementById('save-recording-modal');
    saveRecordingModal.style.visibility = "visible";
    let selecContainer = saveRecordingModal.querySelector("select");
    selecContainer.innerHTML = ""
    data.classes.forEach(element => {
        let optionDOM = document.createElement('option');
        optionDOM.innerHTML = element;
        selecContainer.append(optionDOM);
    });
}

function closeSaveRecordingModal(event) {
    let saveRecordingModal = document.getElementById('save-recording-modal')
    saveRecordingModal.style.visibility = "hidden"
}

function addClass(event) {
    let addClassModal = document.getElementById('add-class-modal')
    addClassModal.style.visibility = "visible"
}

function closeAddClassModal(event) {
    let addClassModal = document.getElementById('add-class-modal')
    addClassModal.style.visibility = "hidden"
}

function saveAndStop(event) {
    const formData = new FormData();
    formData.append('audio', audioBlob, `${recDate.getTime()}.mp3`);
    fetch('/record', {
        method: 'POST',
        body: formData,
    })
        .then((response) => {
            return response.json();
        })
        .then(() => {
            console.log(`recording ${recDate.getTime()}.mp3 added`);
        })
        .catch((err) => {
            console.error(err);
            console.error('An error occurred, please try again later');
        });

    let id = recDate.getTime()
    let trackName = document.getElementById('recording-name').value
    let trackClass = document.getElementById('recording-class').value
    let trackTime = "00:10"
    let trackDate = `${recDate.getFullYear()}-${recDate.getMonth()}-${recDate.getDay()} ${recDate.getHours()}-${recDate.getMinutes()}-${recDate.getSeconds()}`

    let newTrack = {
        id: id,
        name: trackName,
        class: trackClass,
        time: trackTime,
        date: trackDate,
    };

    const xhr = new XMLHttpRequest();
    xhr.open("POST", '/tracks/new', true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onreadystatechange = () => {
        if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
            data.tracks.push(newTrack);
            updateTrackList();
            console.log(`add ${newTrack.name} to tracks`);
        }
    }
    xhr.send(JSON.stringify(newTrack));

    closeSaveRecordingModal();
}

function allChange(event) {
    let allChecked = event.target.checked;
    let classCheckbox = document.querySelector(".class-checkbox")
    for (let i = 1; i < classCheckbox.children.length; i++) {
        const element = classCheckbox.children[i];
        element.children[0].checked = allChecked
    }
    updateTrackList();
}

function updateTrackList() {
    let checkedClasses = [];
    let classCheckbox = document.querySelector(".class-checkbox")
    for (let i = 1; i < classCheckbox.children.length; i++) {
        const element = classCheckbox.children[i];
        if (element.children[0].checked == true) {
            checkedClasses.push(data.classes[i - 1]);
        }
    }

    let all = classCheckbox.children[0].children[0];
    if (checkedClasses.length == data.classes.length) {
        all.checked = true;
    } else {
        all.checked = false;
    }

    let container = document.querySelector('.tracks');
    container.innerHTML = "";
    data.tracks.forEach(track => {
        if (checkedClasses.includes(track.class) == false) {
            return;
        }
        let trackDOM = document.createElement('div');
        trackDOM.classList.add('track');

        let trackContent = `
        <div class="play">
            <span class="track-name">${track.name}</span>
            <i class="fa fa-play-circle"></i>
            <audio src="/${track.id}.mp3"></audio>
            <span class="time">${track.time}</span>
        </div>
        <div class="class-type-select">
            <select name="classes">
                
            </select>
        </div>
        <div class="date">
            <span>${track.date}</span>
        </div>
        <div class="more">
            <i class="fa fa-ellipsis-v" aria-hidden="true"></i>
        </div>
        `;
        trackDOM.innerHTML = trackContent;
        trackDOM.dataset.id = track.id;

        trackDOM.children[0].children[1].addEventListener('click', (event) => {
            let faDOM = event.target;
            let audio = event.target.nextElementSibling;
            audio.onplay = () => {
                faDOM.classList.replace('fa-play-circle', 'fa-pause-circle')
            }
            // audio.onended = () => {
            //     faDOM.classList.replace('fa-pause-circle', 'fa-play-circle');
            // }
            audio.onpause = () => {
                faDOM.classList.replace('fa-pause-circle', 'fa-play-circle');
            }
            if (audio.paused) {
                audio.play()
            } else {
                audio.pause()
            }
        })

        let selecContainer = trackDOM.querySelector("div.class-type-select select");
        selecContainer.addEventListener('change', changeClass);
        data.classes.forEach(element => {
            let optionDOM = document.createElement('option');
            optionDOM.innerHTML = element;
            if (element == track.class) {
                optionDOM.selected = 'selected';
            }
            selecContainer.append(optionDOM);
        });

        container.append(trackDOM);
    });
}

function saveClass(event) {
    let inputField = document.getElementById('class-name');
    var newClassName = inputField.value;
    inputField.value = "";

    const xhr = new XMLHttpRequest();
    xhr.open("POST", '/classes/new', true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onreadystatechange = () => {
        if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
            data.classes.push(newClassName)
            updateClassList()
            updateTrackList()
            console.log(`add ${newClassName} to classes`);
        }
    }
    xhr.send(JSON.stringify({
        value: newClassName
    }));

    closeAddClassModal();
}

function updateClassList() {
    let continer = document.getElementsByClassName('class-checkbox')[0];
    while (continer.childElementCount > 1) {
        continer.removeChild(continer.lastChild)
    }
    data.classes.forEach(element => {
        let label = document.createElement('label');
        label.classList.add('checkbox-container');

        let labelContent = `
                ${element}
                <input type="checkbox" checked="checked">
                <span class="checkmark"></span>
                `;
        label.innerHTML = labelContent;
        label.children[0].addEventListener('change', updateTrackList);
        continer.append(label);
    });
}

function changeClass(event) {
    let newClassName = event.target.value;
    let trackId = event.target.parentElement.parentElement.dataset.id;
    updateTrack(trackId, newClassName)
    function updateTrack(id, newClassName) {
        data.tracks.forEach(element => {
            if (element.id == id) {
                element.class = newClassName;
            }
        });
    }
    postData();
}
