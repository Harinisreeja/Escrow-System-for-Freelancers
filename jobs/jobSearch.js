const categories = Array.from(jCategory)

const displayItems =(items) => {
    const rootElement = document.getElementById("root")
    rootElement.innerHTML = "";

    items.forEach((item) =>{
        const {index, image, title, rate, av}= item;
        const jList=document.createElement("div");
        jList.className="jList";
        jList.innerHTML= `
        <img class="fe-post img" src="${image}" alt="">
        <h3>${title}</h3>
        <p>${rate}</p>
        <span id="key">${av}</span>
        `;

        rootElement.appendChild(jList);
    })
};

displayItems(categories);