AlertAlt("Getting up-to-date data...", (sustain = true));
let gotAllData = 0;
fetch(`/getInfo`)
  .then((res) => res.json())
  .then((data) => {
    gotAllData++;
    if (gotAllData == 2) {
      AlertAlt("Updated");
    }
    console.log(data);
    if (data.code == "#Error") {
      return AlertAlt(
        "Something went wrong. Please try again",
        (sustain = true)
      );
    }
    if (data.code == "#NoSuchID") {
      document.write(
        "Something is wrong with your account authentication. <a href='/login'>Click Here</a> to log in again"
      );
      return;
    }
    if (data.code == "#Success") {
      // document.querySelector('input[type=password]').value = data.password
      fillInData(data.doc);
    }
    let toStore = _remove(["__v", "password", "allTokens"], data.doc);
    toStore.googleUser = toStore.googleUser ? true : false;
    localStorage.eKOSORA_User = JSON.stringify(toStore);
  })
  .catch((err) => {
    AlertAlt("Something went wrong. Please try again");
  });

if (JSON.parse(localStorage.eKOSORA_User).profileLink) {
  document.querySelector(".ProfileImage img").src = JSON.parse(
    localStorage.eKOSORA_User
  ).profileLink;
}

const fillInData = (toUse) => {
  for (let input of document.querySelectorAll(".Field input")) {
    let value = toUse[input.parentElement.getAttribute("title")];

    if (typeof value == "object") {
      if (value.length == 0) {
        input.value = "unknown";
      } else {
        if (input.parentElement.getAttribute("title") == "class") {
          input.value = `Year ${
            toUse[input.parentElement.getAttribute("title")]["year"]
          } ${toUse[input.parentElement.getAttribute("title")]["class"]}`;
        } else if (
          input.parentElement.getAttribute("title") == "parentEmails"
        ) {
          console.log("Calling the fillInParents function");
          fillInParents(input, toUse["parentEmails"]);
        } else {
          input.value = value;
        }
        // console.log(input.parentElement.title)
      }
    } else if (
      input.parentElement.getAttribute("title") == "connectedToGoogle"
    ) {
      console.log("In the CONNECTED TO GOOOGLE ");
      if (toUse["googleUser"]) input.checked = true;
    } else {
      input.value = value ? value : "unknown";
    }
  }
};

function fillInParents(input, parentEmails) {
  for (let child of input.parentElement.children) {
    if (child.className == "parentEmail")
      input.parentElement.removeChild(child);
  }
  console.log(parentEmails);
  for (let parentEmail of parentEmails) {
    let div = document.createElement("div");
    div.className = "parentEmail";
    div.textContent = parentEmail;
    input.parentElement.insertBefore(div, input);
  }
  input.value = "";
  input.style.height = "0";
  input.style.padding = "0";
}

fillInData(JSON.parse(localStorage.eKOSORA_User));

const editBTN = document.querySelector("#EditBTN");
const viewHideBTN = document.querySelector("#ViewHidePassword");

viewHideBTN.onclick = (e) => {
  viewHideBTN.src = viewHideBTN.src.match("../img/visibility_off.svg")
    ? "../img/visibility.svg"
    : "../img/visibility_off.svg";
  viewHideBTN.previousElementSibling.type =
    viewHideBTN.previousElementSibling.type == "text" ? "password" : "text";
};

const clickedSaveEdit = (e) => {
  // console.log("Clicked Save Edit")
  let toSend = {};
  let readyToGo = true;
  for (let input of document.querySelectorAll(".Field input")) {
    if (
      input.value == "" &&
      input.parentElement.getAttribute("notneeded") != "true"
    ) {
      input.style.borderRadius = "3px";
      input.addEventListener(
        "focus",
        (e) => {
          e.target.style.outline = "none";
        },
        { once: true }
      );
      input.style.outline = "2px solid red";
      readyToGo = false;
    }
    if (input.parentElement.getAttribute("noteditable") == "true") continue;
    toSend[input.parentElement.getAttribute("title")] =
      input.value != "unknown" ? input.value : "";
  }
  if (!readyToGo) return;
  // return console.log(toSend)
  AlertAlt("Updating...");
  fetch(
    `/settings/updateSettings/${JSON.parse(localStorage.eKOSORA_User)._id}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(toSend),
    }
  )
    .then((res) => res.json())
    .then((data) => {
      if (data.code == "#Error") {
        console.log(data.message);

        return AlertAlt(
          "Something went wrong. Please try again...",
          (sustain = true)
        );
      }
      if (data.code == "#Success") {
        AlertAlt("User info updated successfully.");
        console.log(data);
        localStorage.eKOSORA_User = JSON.stringify(data.doc);
        setTimeout(() => {
          location.reload();
        }, 200);
      }
    })
    .catch((err) => {
      AlertAlt("Something went wrong. Please try again");
    });

  // fetch()
};

const clickedCancelBTN = (e) => {
  location.reload();
};

const clickedEdit = (e) => {
  console.log("Clicked the edit btn");
  let cancelBTN = document.createElement("button");
  cancelBTN.textContent = "CANCEL";
  cancelBTN.style.backgroundColor = "#ac3f3f";
  e.target.textContent = "SAVE";

  e.target.parentElement.insertBefore(cancelBTN, e.target);
  e.target.addEventListener("click", clickedSaveEdit);
  cancelBTN.addEventListener("click", clickedCancelBTN);
  // Array.from(document.querySelectorAll('input[readonly]')).map(x => x.readOnly = false)
  for (let input of document.querySelectorAll(".Settings input[readonly]")) {
    // console.log("Did this")
    if (input.parentElement.getAttribute("noteditable") == "true") continue;
    if (input.value == "unknown") input.value = "";
    input.readOnly = false;
    // input.style.border = "1px solid #b7b7b7"
    // input.style.backgroundColor = "#b7b7b7"
    input.classList.add("editableOption");
  }
};

editBTN.addEventListener("click", clickedEdit, { once: true });

document.querySelector(".ProfileImage").addEventListener("click", (e) => {
  let fileInput = document.createElement("input");
  fileInput.type = "file";
  fileInput.accept = ".png, .jpeg, .jpg, .gif, .ico";
  fileInput.onchange = async (e2) => {
    let reader = new FileReader();
    let failed = false;
    reader.onload = async function (event) {
      // if(event.total > 100000){
      //     console.log("Inside the load function")
      //     failed = true
      //     return alert("The file must be under 50Kb in size")
      // }
      let img = document.querySelector(".ProfileImage img");
      img.src = event.target.result;
      let data = new FormData();
      // data.append('fromReader', event.target.result)
      AlertAlt("Updating profile...", true);
      data.append("file", fileInput.files[0]);
      data.append("_id", JSON.parse(localStorage.eKOSORA_User)._id);
      // console.log(event.total)
      fetch("/settings/newProfile", {
        method: "POST",
        headers: {},
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          if (data.code == "#Success") {
            let userInfo = JSON.parse(localStorage.eKOSORA_User);
            userInfo.profileLink = data.url;
            localStorage.eKOSORA_User = JSON.stringify(userInfo);
            AlertAlt("Updated profile successfully");
          }
        })
        .catch((err) => {
          AlertAlt("Something went wrong. Please try again");
        });
    };
    let readFile = await reader.readAsDataURL(e2.target.files[0]);
    // if(failed) return
    // console.log("reached here")
    // return

    // console.log(e2.target.files[0])
  };

  fileInput.click();
});

const observer = new ResizeObserver((entries) => {
  let mainDIV = entries[0];
  if (mainDIV.contentRect.width < 690) {
    mainDIV.target.classList.add("smallSettings");
  } else {
    mainDIV.target.classList.remove("smallSettings");
  }
});

observer.observe(document.querySelector(".Settings"));

///! GET EXTRA SETTINGS
// AlertAlt("Loading...", true)
fetch("/settings/otherSettings")
  .then((res) => res.json())
  .then((data) => {
    gotAllData++;
    // console.log("I dont know too :",setting.value)

    console.log("What i need ", data);
    if (gotAllData == 2) {
      AlertAlt("Updated");
    }
    if (data.code == "#Error") {
      AlertAlt("Could not load other settings. Try refreshing the page!");
    }
    if (data.code == "#Success") {
    //   alert("GOT IT");
      console.log("Pretty codes : ",data.doc)
      if (data.doc.length == 0) return 
      for (let setting of data.doc) {
        console.log("THE VALUE :", setting.value.value["number"]);
        let div = document.createElement("div");
        let h1 = document.createElement("h1");

        h1.textContent = setting.key;
        h1.style.textTransform = "capitalize";

        div.className = "OtherSetting";

        div.appendChild(h1);
        div.title = setting._id;

        for (let valueKey of Object.keys(setting.value.value)) {
          let field = document.createElement("div");
          field.className = "Field";
          let h3 = document.createElement("h3");
          h3.textContent = valueKey + ":";
          h3.style.textTransform = "capitalize";
          let input = document.createElement("input");
        //   input.type = "date"
        //   input.value = setting.value.value[valueKey].type;
          input.className = "span";
          input.readOnly = true;
          console.log("The Type ", setting.value.value[valueKey].type)
          if (setting.value.value[valueKey].type == "Date") {
            input.type = "date";
            const dateValue = new Date(setting.value.value[valueKey].data);
            // console.log("The Of this Mf : ", typeof(datValue)),
            input.value = dateValue.toLocaleDateString();
          } else {
            // console.log("Them looks ",setting.value.value[valueKey])
            input.value = setting.value.value[valueKey].data;
          }
          field.title = valueKey;

          field.appendChild(h3);
          field.appendChild(input);
          div.appendChild(field);
        }

        //* THE EDIT BUTTON FOR EACH SETTING
        let settingEditBTN = document.createElement("div");
        settingEditBTN.innerHTML = `<img src="../img/edit.svg" alt="EDIT BUTTON">`;
        settingEditBTN.className = "settingEditBTN";

        settingEditBTN.addEventListener(
          "click",
          (e) => {
            for (let child of settingEditBTN.parentElement.children) {
              if (
                child.tagName == "DIV" &&
                Array.from(child.classList).includes("Field")
              ) {
                for (let subchild of child.children) {
                  if (subchild.tagName == "INPUT") {
                    subchild.readOnly = false;
                    subchild.classList.add("editableOption");
                  }
                }
              }
            }
            settingEditBTN.style.transform = "rotate(360deg)";
            setTimeout(() => {
              document.querySelector(".settingEditBTN img").src =
                "../img/save.svg";
            }, 250);
            settingEditBTN.onclick = (e) => {
              //To SAVE
              AlertAlt("Updating...", true);
              let toSend = {};
              for (let child of settingEditBTN.parentElement.children) {
                if (
                  child.tagName == "DIV" &&
                  Array.from(child.classList).includes("Field")
                ) {
                  for (let subchild of child.children) {
                    if (subchild.tagName == "INPUT") {
                      if (subchild.type == "date") {
                        toSend[child.title] = new Date(subchild.value);
                      } else if (subchild.type == "number") {
                        toSend[child.title] = Number(subchild.value);
                      } else {
                        toSend[child.title] = subchild.value;
                      }
                    }
                  }
                }
              }
              toSend._id = div.title;

              fetch("/settings/updateOtherSetting", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(toSend),
              })
                .then((res) => {
                  console.log(res);
                  return res.json();
                })
                .then((data) => {
                  console.log(data);
                  if (data.code != "#Success")
                    throw new Error(JSON.stringify(data.message));
                  AlertAlt("Updated");
                  location.reload();
                })
                .catch((err) => {
                  console.log(err);
                  AlertAlt("Something went wrong. Please try again");
                });
            };
          },
          { once: true }
        );

        div.appendChild(settingEditBTN);

        document.querySelector(".main").appendChild(div);
      
    }
    }
  })
  .catch((err) => {
    console.log(err);
    AlertAlt("Something went wrong. Please try again");
  });
