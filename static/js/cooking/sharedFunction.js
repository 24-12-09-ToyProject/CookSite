export function renderCards(filteredCards) {
    const container = document.getElementById("card-container");
    const template = document.getElementById("card-template");

    container.innerHTML = "";

    filteredCards.forEach((data) => {
        const card = template.content.cloneNode(true);
        card.querySelector(".class-img").src = data.CLASS_THUMBNAIL_IMG;
        card.querySelector(".class-Tag").textContent = data.CLASS_CATEGORY;
        card.querySelector(".class-Name").textContent = data.CLASS_TITLE;

        const cardLink = card.querySelector("a");
        cardLink.href = `/class/${data.classNo}`;

        container.appendChild(card);
    });
}