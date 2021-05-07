const dogBarDiv = document.querySelector('#dog-bar')
const dogDetailDiv = document.querySelector('div#dog-info')
const goodDogFilterButton = document.querySelector('#good-dog-filter')
goodDogFilterButton.addEventListener('click', (event) => getFilteredDogs(event))
let filter = false
getAllDogs ()

function getAllDogs () {
    fetch('http://localhost:3000/pups')
    .then(res => res.json())
    .then((pupArray) => {
        pupArray.forEach(dogObj => appendPuppy(dogObj))
    })
}

function appendPuppy (dogObj) {
    const pupNameSpan = document.createElement('span')
    pupNameSpan.textContent = dogObj.name
    dogBarDiv.append(pupNameSpan)
    pupNameSpan.addEventListener('click', (event) => viewPuppyDetail(dogObj))
}

function viewPuppyDetail(dogObj) {
    dogDetailDiv.innerHTML = ''
    const puppyImg = document.createElement('img')
    const puppyNameH2 = document.createElement('h2')
    puppyImg.src = dogObj.image
    puppyNameH2.textContent = dogObj.name
    dogDetailDiv.append(puppyImg, puppyNameH2)
    displayGoodness(dogObj)
}

function displayGoodness(onePuppyObj) {
    const goodButton = document.createElement('button')
    fetch(`http://localhost:3000/pups/${onePuppyObj.id}`)
    .then(res => res.json())
    .then(onePuppyObj => {
        goodButton.textContent = (onePuppyObj.isGoodDog ? "Good Dog!":"Bad Dog!")
        dogDetailDiv.append(goodButton)
        goodButton.addEventListener('click', (event) => UpdateGoodness(event, onePuppyObj))
    })
}

function UpdateGoodness(event, onePuppyObj) {
    console.log(event.target.textContent)
    const newPuppyGoodness = (event.target.textContent === "Good Dog!"? false : true)
    console.log(newPuppyGoodness)
    fetch(`http://localhost:3000/pups/${onePuppyObj.id}`,
    {
        method: "PATCH",
        headers: {
            "Content-Type" : "application/json"
        },
        body: JSON.stringify({isGoodDog : newPuppyGoodness})
    })
    .then(res => res.json())
    .then((onePuppyObj) => {
        event.target.textContent = (onePuppyObj.isGoodDog ? "Good Dog!":"Bad Dog!")
        
    })
}

function getFilteredDogs (event) {
    dogBarDiv.innerHTML = ''
    //dogDetailDiv.innerHTML = ''  
    filter = !filter
    if (filter) {
        event.target.textContent = 'Filter good dogs: ON'
        fetch('http://localhost:3000/pups')
        .then(res => res.json())
        .then((pupArray) => {
            const filteredArray = pupArray.filter(pupObj => pupObj.isGoodDog === true)
            filteredArray.forEach((pupObj) => appendPuppy(pupObj))
        })   
    } else {
        event.target.textContent = 'Filter good dogs: OFF'
        getAllDogs ()
    }
    
}

