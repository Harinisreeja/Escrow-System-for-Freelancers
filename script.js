const sortBtns=document.querySelectorAll(".job-id > *");

sortBtns.forEach((btn)=>{
    btn.addEventListener("click",()=>{
        sortBtns.forEach((btn) => btn.classList.remove("active"));
        btn.classList.add("active");
    });
});
