
document.querySelector('form').addEventListener('submit', (e)=>{
    e.preventDefault()
    let toSend = {meantFor: []}
    // let checkedBoxes = []
    for(let input of document.querySelectorAll('input, select, textarea')){
        let toUse = null
        if(input.value == ''){
            //To check whether the unFilled field is among the required ones
            if(["names", "email", "tel"].includes(input.getAttribute('name'))) {
                input.parentElement.classList.add('unFilledField')
                input.addEventListener('focus', (e)=>{
                    input.parentElement.classList.remove('unFilledField')
                }, {once: true})
                return
            }
            
        }else if(input.type == 'checkbox'){
            // console.log(input)
            if(input.checked) toSend.meantFor.push(input.value)
            continue
        }
        toUse = input.value
        
        toSend[input.getAttribute('name')] = toUse
    }
    toSend.composer = JSON.parse(localStorage.eKOSORA_User)._id
    AlertAlt("Posting announcement.....")
    fetch('/announcement/add', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(toSend)
    })
    .then(res => res.json())
    .then(data => {
        console.log(data)
        if(data.code == "#Error"){
            AlertAlt("Something went wrong. Please try again later.", sustain=true, isError=true)
        }else{
            document.querySelector('form').reset()
            AlertAlt("Posted!")
            location.pathname = "/announcement"
        }

    })
    .catch(err => {
        AlertAlt("Something went wrong. Please try again", isError=true, sustain=true)
    })
})