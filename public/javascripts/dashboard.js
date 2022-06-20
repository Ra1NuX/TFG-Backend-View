async function signOut() {
    try {
        await fetch('/signout');
        location.reload();
    } catch (error) {
        console.log(error)
    }
}

function hideModal(id) {
    document.getElementById(id).style.display = 'none';
}

function showModal(id) {
    document.getElementById(id).style.display = 'block';
}

async function deleteRoom(id) {
    try {
        await fetch('/r/remove', { method: "POST", body: JSON.stringify({ roomId: id }), headers: { 'Content-Type': 'application/json' } });
    } catch (error) {
        console.log(error)
    }
    // location.reload();
}

function selectAll() {
    var checkboxes = document.querySelectorAll('[type="checkbox"]');
    for (var i = 0; i < checkboxes.length; i++) {
        checkboxes[i].checked = !checkboxes[i].checked;
    }
    checkboxes[0].checked = !checkboxes[0].checked;

}

function openConfig() {
    if (document.getElementById("configRooms").style.display == "block") { 
        document.getElementById("configRooms").style.display = "none" 
    } else {
        document.getElementById("configRooms").style.display = "block";
    }
}

function deleteAll() {
    var checkboxes = document.querySelectorAll('input[type="checkbox"].room');
    for (var i = 0; i < checkboxes.length; i++) {
        if (checkboxes[i].checked) {
            deleteRoom(checkboxes[i].id);
        }
    }   
}

const rooms = getData();