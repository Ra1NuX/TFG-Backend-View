async function signOut() {
    try {
        await fetch('/signout');
        location.reload();
    } catch (error) {
        console.log(error)
    }
    

}