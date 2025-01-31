function changeImage(element) {
    const mainImage = document.getElementById("main-image");
    mainImage.src = element.src;
}

function increaseCount() {
    const participants = document.getElementById("participants");
    let count = parseInt(participants.value, 10);
    participants.value = count + 1;
}

function decreaseCount() {
    const participants = document.getElementById("participants");
    let count = parseInt(participants.value, 10);
    if (count > 1) {
        participants.value = count - 1;
    }
}