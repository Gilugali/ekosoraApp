const buttons = document.querySelectorAll('a[class="QuickFeature"]');
const TheForm = document.querySelector('.TheForm')
const form = document.querySelector('form')
const subjectForm = document.querySelector('#addSubject')
const combinationForm = document.querySelector('#addCombination')
const levelForm = document.querySelector('#addLevel')
const closeBtn = document.querySelectorAll('#close')
console.log(levelForm)
combinationForm.style.display = 'none'
levelForm.style.display = 'none'
subjectForm.style.display = 'none'
TheForm.style.display = 'none'
let currentOpenForm = null

buttons.forEach((button) => {
  button.addEventListener("click", (choice) => {
    let choiceBtn = choice.target;
    if(currentOpenForm){
      currentOpenForm.style.display = "none"
    }

    switch (choiceBtn.id) {
      case "subject":
       currentOpenForm = subjectForm
        break;
      case "combination":
          currentOpenForm = combinationForm
        break;
      case "level":
           currentOpenForm = levelForm
        break;
        default:
          console.log("Nothing to Show")
    }
    TheForm.style.display = 'block'
    currentOpenForm.style.display = 'block'
  });
   
});


closeBtn.forEach((close)=>{
  close.addEventListener('click', ()=>{
    currentOpenForm.style.display = 'none'
    TheForm.style.display = 'none'

  })
})