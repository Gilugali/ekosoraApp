const buttons = document.querySelectorAll('a[class="QuickFeature"]');

buttons.forEach((button) => {
  button.addEventListener("click", (choice) => {
    let choiceBtn = choice.target;

    switch (choiceBtn.id) {
      case "subject":
        break;
      case "combination":
        alert(`you can add ${choiceBtn.id}`);
        break;
      case "level":
        alert(`you can add ${choiceBtn.id}`);
        break;
    }
  });
});

function addSubject(choiceTitle){
    const title = document.createElement('h3')
     title.textContent = `New ${choiceTitle}`
    const labelName = document.createElement('lablel')
    labelName.setAttribute('title', )
    const saveBtn = document.createElement('button')
    saveBtn.setAttribute('id','GetIn')
}