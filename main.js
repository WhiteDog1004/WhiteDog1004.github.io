const timer = document.querySelector(".time");

const API_KEY = "408f33f9ad2ec5808a84a95f928d30c4";
const weather = document.querySelector('.weatherInput');

const loginContainer = document.querySelector('.container');
const loginInput = document.querySelector('.loginInput input');
const loginBtn = document.querySelector('.loginInput button');
const loginName = document.querySelector('.loginSuccess h2');
const todoBox = document.querySelector('.todoBox');
let btnCheck = false;

// 랜덤 이미지
const backgrounds = document.querySelector('.backgrounds');
let ranNum = Math.floor(Math.random() * 3);
let img = document.createElement('img');
let imgSrc = document.createAttribute('src');
imgSrc.value = `./imgs/dog0${ranNum}.jpg`;
img.setAttributeNode(imgSrc);
backgrounds.appendChild(img);

// 타이머
let date = new Date();
let hours = date.getHours();
let minutes = date.getMinutes();
let seconds = date.getSeconds();
timer.innerHTML = `${hours > 12 ? "오후" : "오전"} ${hours > 12 ? hours - 12 : hours}시 ${minutes}분 ${seconds}초`;

let time = setInterval(() => {
    date = new Date();
    hours = date.getHours();
    minutes = date.getMinutes();
    seconds = date.getSeconds();
    timer.innerHTML = `${hours > 12 ? "오후" : "오전"} ${hours > 12 ? hours - 12 : hours}시 ${minutes}분 ${seconds}초`;
}, 1000);

// 날씨
const weatherText = document.querySelector('.weatherInput h1');
const weatherPlace = document.querySelector('.weatherInput h2');

function onGeoOk(position) {
    const lat = position.coords.latitude;
    const lng = position.coords.longitude;
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${API_KEY}`
    fetch(url).then(response => response.json()).then(data => {
        weatherText.innerHTML = data.weather[0].main;
        weatherPlace.innerHTML = data.name;
    });
}
function onGeoError() {
    alert('error');
}

navigator.geolocation.getCurrentPosition(onGeoOk, onGeoError);

// todo 리스트
const toDoForm = document.querySelector('#todoForm');
const toDoInput = toDoForm.querySelector('input');
const toDoList = document.querySelector('#todoList');

const TODOS_KEY = "todos"

let toDos = [];

function saveToDos() {
    localStorage.setItem(TODOS_KEY, JSON.stringify(toDos));
}

function deleteToDo(event) {
    const li = event.target.parentElement;
    li.remove();
    toDos = toDos.filter(toDo => toDo.id !== parseInt(li.id));
    saveToDos();
}

function paintToDo(newTodo) {
    const li = document.createElement('li');
    li.id = newTodo.id;
    const span = document.createElement('span');
    span.innerText = newTodo.text;
    const button = document.createElement('button');
    button.innerText = "X";
    button.addEventListener('click', deleteToDo);
    li.appendChild(span);
    li.appendChild(button);
    toDoList.appendChild(li);
}

function handleToDoSubmit(event) {
    event.preventDefault();
    const newTodo = toDoInput.value;
    toDoInput.value = "";
    const newTodoObj = {
        text: newTodo,
        id: Date.now(),
    }
    toDos.push(newTodoObj);
    paintToDo(newTodoObj);
    saveToDos();
}

toDoForm.addEventListener('submit', handleToDoSubmit);

const savedToDos = localStorage.getItem(TODOS_KEY);
if (savedToDos !== null) {
    const parsedToDos = JSON.parse(savedToDos);
    toDos = parsedToDos;
    parsedToDos.forEach(paintToDo);
}

// 로그인
loginBtn.addEventListener('click', loginClick);
loginInput.addEventListener('keypress', function (key) {
    if (key.key == 'Enter') {
        loginClick();
    }
});

function loginCheck() {
    const getName = localStorage.getItem('login');
    if (getName !== null) {
        loginInput.classList.add('on');
        loginBtn.classList.add('on');
        loginContainer.classList.add('on');
        weather.classList.add('on');
        toDoForm.classList.add('on');
        toDoList.classList.add('on');
        todoBox.classList.add('on');
    }
}
loginCheck();

function loginClick() {
    const loginText = loginInput.value;
    if (!btnCheck) {
        btnCheck = true;
        if (!loginInput.value) {
            loginName.innerHTML = `이름을 입력하세요`;
            return;
        }
        loginName.innerHTML = ``;
        localStorage.setItem('login', loginText);

        loginInput.classList.add('on');
        loginBtn.classList.add('on');
        setTimeout(() => {
            loginContainer.classList.add('on');
            weather.classList.add('on');
            toDoForm.classList.add('on');
            toDoList.classList.add('on');
            todoBox.classList.add('on');
        }, 2000);
        // loginName.innerHTML = `${getName}님 안녕하세요`;
    } else {
        btnCheck = false;
        loginInput.classList.remove('on');
        loginBtn.classList.remove('on');
        loginContainer.classList.remove('on');
        weather.classList.remove('on');
        toDoForm.classList.remove('on');
        toDoList.classList.remove('on');
        todoBox.classList.remove('on');
        localStorage.removeItem('login');
    }
}