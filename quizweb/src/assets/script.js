const container = document.querySelector('.conatiner');
const registerbtn = document.querySelector('.register-btn');
const loginbtn =  document.querySelector('.login-btn');


registerbtn.addEventListener('click',()=>{
    container.classList.add('active');
})
loginbtn.addEventListener('click',()=>{
    container.classList.remove('active');
})