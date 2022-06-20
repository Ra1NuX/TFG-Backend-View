
const S = (val) => document.querySelectorAll(val);
const users = S('#users')[0];
const subjects = S('#subjects')[0];
const roomName = S('#room-name')[0];
const roomId = S('#divId')[0]
const newSubject = S('#newSubject')[0];
let stars = S('.star');
// Getting the id from the url .
const id = window.location.pathname.slice(3);

let room;

const getroom = async () => {
    const res = await fetch('/r/get-room', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-type': 'application/json'
        },
        body: JSON.stringify({
            id
        })
    })
    return await res.json();
}

window.onload = (async () => {
    await setRoomConfig()
    handlerTitle();
    handlerUsers();
    handlerSubjects();
    handlerStar();
})

const setRoomConfig = async (r) => {
    res = await getroom();
    room = JSON.parse(res);
}
const handlerTitle = () => {
    roomName.innerText = room.Name.toUpperCase()
    roomId.innerText = room.AccessKey
}

const deleteUser = async (id) => {
    await fetch('/r/unsubscribe', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-type': 'application/json'
        },
        body: JSON.stringify({
            userId: id, roomId: room._id
        })
    })
    
    await setRoomConfig();
}

const handlerUsers = () => {
    room.Users.forEach(user => {
        console.log(user)
        users.innerHTML += `
        <li class="block grid-cols-3 md:grid rounded shadow-md shadow-blue-light m-2 p-2">
            <div class="truncate">${user.Username.charAt(0).toUpperCase() + user.Username.slice(1)}</div>
            <div class="truncate"> ${user.Email}</div>
            <div class="truncate"> ${user.FirebaseRef}</div>
        </li>`
    });
}

const handlerSubjects = () => {
    subjects.innerHTML = ''
    room.Subjects.forEach(subject => {
        console.log(subject)
        subjects.innerHTML += `
        <li class="flex justify-evenly items-start border-b-2 border-gray-400">
            <div class="p-2 mr-auto w-full">
                <div class="font-bold">${subject.Code}</div>
            </div>
            <div class="p-2">${subject.Name.charAt(0).toUpperCase() + subject.Name.slice(1)}</div>
            <div class="p-2 "><button id="subject-${subject._id}">X</button></div>
        </li>`
        const button = S(`#subject-${subject._id}`)[0];
        button.addEventListener('click', () => deleteSubject(button.id.slice(8)))
    })

}
const deleteSubject = async (id) => {
    const res = await fetch('/r/delete-subject', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-type': 'application/json'
        },
        body: JSON.stringify({
            roomId: room._id,
            subjectId: id
        })
    })
    const response = await res.json();

    if (response.errors) { alert("Error"); return }

    await setRoomConfig();
    handlerSubjects();

}

const createSubject = async () => {

    const newName = S('#newSubjectName')[0];
    const newIdName = S('#newSubjectIdName')[0];
    const label = S('#spanId')[0]

    label.innerText = ""
    newIdName.style.borderColor = "";
    const newSubjects = { Code: newIdName.value, Name: newName.value }
    const res = await fetch('/r/add-subject', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-type': 'application/json'
        },
        body: JSON.stringify(
            {
                roomId: id,
                subject: newSubjects
            }
        )
    })
    const response = await res.json();
    if (response.errors) {
        newIdName.style.borderColor = "red";
        label.innerText = "(Id duplicated)"
        label.style.color = 'red'
    } else {
        newIdName.value = '';
        newName.value = '';
    }
    await setRoomConfig();
    handlerSubjects();
}

const changeVisibility = () => {
    const plus = S('#plus-icon')[0];
    const visible = S('#changeForm')[0];

    visible.classList.toggle('h-0');
    plus.classList.toggle('rotate-45');
}



const handlerStar = () => {
    stars = S('.star')
    stars.forEach(star => {
        star.addEventListener('mouseover', () => {
            star.classList.contains('bi-star-fill') ? star.classList.replace('bi-star-fill', 'bi-star') : star.classList.replace('bi-star', 'bi-star-fill')
        })
        star.addEventListener('mouseout', () => {
            star.classList.contains('bi-star-fill') ? star.classList.replace('bi-star-fill', 'bi-star') : star.classList.replace('bi-star', 'bi-star-fill')
        })
    })
} 
