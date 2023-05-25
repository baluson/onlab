
function getinputfield(inputobject, noid, value) {
  let toreturn = "";
  switch (inputobject["type"]) {
    case "0": {
      toreturn = '<label class="prevent-select">' + inputobject["name"] + '</label><input ' + (noid ? '' : 'id="' + inputobject["name"] + '"') + ' type="text" value="' + (value ? value : inputobject["value"]) + '" disabled></input>';
      break;
    }
    case "1": {
      toreturn = '<label class="prevent-select">' + inputobject["name"] + '</label><input ' + (noid ? '' : 'id="' + inputobject["name"] + '"') + ' type="text" value="' + (value ? value : inputobject["value"]) + '" ></input>';
      break;
    }
    case "2": {
      toreturn = '<label class="prevent-select">' + inputobject["name"] + '</label><input ' + (noid ? '' : 'id="' + inputobject["name"] + '"') + ' type="password" value="' + (value ? value : inputobject["value"]) + '" ></input>';
      break;
    }
    case "3": {
      toreturn = '<label class="prevent-select">' + inputobject["name"] + '</label><input ' + (noid ? '' : 'id="' + inputobject["name"] + '"') + ' type="password" value="' + (value ? value : inputobject["value"]) + '" ></input>';
      break;
    }
    case "5": {
      toreturn = '<label class="prevent-select" >' + inputobject["name"] + '</label><select ' + (noid ? '' : 'id="' + inputobject["name"] + '"') + ' >';
      for (let optionname in inputobject["values"]) {
        toreturn += '<option value="' + inputobject["values"][optionname] + '" ' + (value ? (inputobject["values"][optionname] == value ? "selected" : "") : (inputobject["values"][optionname] == inputobject["value"] ? 'selected' : '')) + ' >' + optionname + '</option>';
      }
      toreturn += '</select>';
      break;
    }
    case "10": {
      toreturn = '<span class="inputchanger hand prevent-select" data=\'' + JSON.stringify(inputobject) + '\' value="%VALUE%" %ACTION%>%TITLE%</span><span>%INPUTS%</span>';
      let func = 'onclick="inputchanger(this)"';
      let inputfield = "";
      inputfield += getinputfield(inputobject["options"][(value ? value.split(":")[0] : inputobject["value"])], true, (value ? value.split(":")[1] : undefined));
      toreturn = toreturn.replaceAll("%INPUTS%", inputfield);
      toreturn = toreturn.replaceAll("%ACTION%", func);
      toreturn = toreturn.replaceAll("%TITLE%", (value != undefined ? inputobject["values"][value.split(":")[0]] : inputobject["values"][inputobject["value"]]));
      toreturn = toreturn.replaceAll("%VALUE%", (value != undefined ? value.split(":")[0] : inputobject["value"]));

      break;
    }
    case "11": {
      toreturn = '<label class="prevent-select" for="' + inputobject["name"] + 'b">Block</label><select ' + (noid ? '' : 'id="' + inputobject["name"] + 'b"') + ' onchange="blockinput(this);">';
      let selected = "";
      for (let blockid in projectconfig["blocks"]) {
        if (selected == "" || (value ? (value.split(".")[0] == blockid ? true : false) : false)) {
          selected = projectconfig["blocks"][blockid]["uniqueID"];
        }
        toreturn += '<option value="' + projectconfig["blocks"][blockid]["uniqueID"] + '" ' + (value ? (value.split(".")[0] == blockid ? "selected" : "") : "") + '>' + projectconfig["blocks"][blockid]["name"] + '</option>';
      }
      toreturn += '</select>';
      toreturn += '<label class="prevent-select" for="' + inputobject["name"] + 'o">Output</label><select ' + (noid ? '' : 'id="' + inputobject["name"] + 'o"') + ' >';
      toreturn += blockinputcontent(selected, (value ? value.split(".")[1] : undefined));
      toreturn += '</select>';
      break;
    }
    case "12": {
      toreturn = '<label class="prevent-select" for="' + inputobject["name"] + 'b">IO</label><select ' + (noid ? '' : 'id="' + inputobject["name"] + 'b"') + ' onchange="ioblockinput(this);">';
      let selected = "";
      for (let ioname in projectconfig["boardsettings"]["HWIO"]) {
        if (projectconfig["boardsettings"]["HWIO"][ioname]["mode"] >= 0) {
          if (selected == "" || (value ? (value.split(".")[0] == projectconfig["boardsettings"]["HWIO"][ioname]["pin"] ? true : false) : false)) {
            selected = projectconfig["boardsettings"]["HWIO"][ioname]["pin"];
          }
          toreturn += '<option value="' + projectconfig["boardsettings"]["HWIO"][ioname]["pin"] + '" ' + (value ? (value.split(".")[0] == projectconfig["boardsettings"]["HWIO"][ioname]["pin"] ? "selected" : "") : "") + '>' + ioname + '</option>';
        }
      }
      toreturn += '</select>';
      toreturn += '<label class="prevent-select" for="' + inputobject["name"] + 'o">Output</label><select ' + (noid ? '' : 'id="' + inputobject["name"] + 'o"') + ' >';

      toreturn += ioblockinputcontent(selected, (value ? value.split(".")[1] : undefined));

      toreturn += '</select>';
      break;
    }
  }
  return toreturn;
}

function ioblockinput(ioblockselector) {
  let ioblockid = getFormElementValue(ioblockselector);
  ioblockselector.nextSibling.nextSibling.innerHTML = blockinputcontent(ioblockid);
}

function ioblockinputcontent(ioid, value) {
  ioname = data_getIONameByPin(ioid)
  toreturn = '';
  for (let output in libraryconfig["ioblocks"][projectconfig["boardsettings"]["HWIO"][ioname]["mode"]]["outputs"]) {
    toreturn += '<option value="' + output + '" ' + (value ? (value == output ? "selected" : "") : "") + '>' + libraryconfig["ioblocks"][projectconfig["boardsettings"]["HWIO"][ioname]["mode"]]["outputs"][output]["name"] + '</option>';
  }
  return toreturn;
}

//for setting when user clicks
function blockinput(blockselector) {
  let blockid = getFormElementValue(blockselector);
  blockselector.nextSibling.nextSibling.innerHTML = blockinputcontent(blockid);
}

//setting on creation
function blockinputcontent(blockid, value) {
  blockclass = data_getblockclass(projectconfig["blocks"][blockid]["classID"]);
  toreturn = '';
  for (let output in blockclass["outputs"]) {
    toreturn += '<option value="' + output + '" ' + (value ? (value == output ? "selected" : "") : "") + '>' + blockclass["outputs"][output]["name"] + '</option>';
  }
  return toreturn;
}

function inputchanger(changebutton) {
  let inputobject = JSON.parse(changebutton.getAttribute('data'));
  let value = changebutton.getAttribute('value');

  let values = Object.keys(inputobject['values']);
  let nextid = values.indexOf(value) + 1;
  let nextvalue = nextid >= values.length ? values[0] : values[nextid];

  changebutton.innerHTML = inputobject["values"][nextvalue];
  changebutton.setAttribute('value', nextvalue);
  let content = "";
  /*for (let input in inputobject["options"][changebutton.getAttribute('value')]) {
    content += getinputfield(inputobject["options"][changebutton.getAttribute('value')][input], true);
  }*/
  content += getinputfield(inputobject["options"][changebutton.getAttribute('value')], true);
  changebutton.nextSibling.innerHTML = content;
}

function createsettingspopup(type, group) {
  let popupcontent = "";
  let selectedconfig;
  switch (type) {
    case "library":
      selectedconfig = libraryconfig;
      break;
    case "board":
      selectedconfig = boardconfig;
      break;
  }
  //creating groups for displaying inputfields
  let groups = {};
  for (let settingid in selectedconfig["settings"][group]) {
    if (!groups[selectedconfig["settings"][group][settingid]["group"]]) {
      groups[selectedconfig["settings"][group][settingid]["group"]] = {};
    }
    groups[selectedconfig["settings"][group][settingid]["group"]][selectedconfig["settings"][group][settingid]["name"]] = getinputfield(selectedconfig["settings"][group][settingid], false, (group == "HWIO" ? projectconfig[type + "settings"][group][data_getIONameByPin(settingid)]["mode"] : projectconfig[type + "settings"][group][selectedconfig["settings"][group][settingid]["group"]][selectedconfig["settings"][group][settingid]["name"]]));
  }
  //looping trough the groups and creating inputfields
  for (let groupname in groups) {
    let group = html["group"];
    let groupcontent = "";
    for (let settingname in groups[groupname]) {
      groupcontent += groups[groupname][settingname];
    }
    group = group.replaceAll("%TITLE%", groupname);
    group = group.replaceAll("%ID%", groupname);
    group = group.replaceAll("%CONTENT%", groupcontent);
    popupcontent += group;
  }
  createpopup(group, popupcontent, type);
}

function createblockpopup(uniqueid) {
  let classid = projectconfig["blocks"][uniqueid]["classID"];
  let popupcontent = '<input type="hidden" id="uniqueid" value="' + uniqueid + '">';
  let groups = {};
  for (let inputid in libraryconfig["blocks"][classid]["inputs"]) {
    if (!groups[libraryconfig["blocks"][classid]["inputs"][inputid]["group"]]) {
      groups[libraryconfig["blocks"][classid]["inputs"][inputid]["group"]] = {};
    }
    groups[libraryconfig["blocks"][classid]["inputs"][inputid]["group"]][libraryconfig["blocks"][classid]["inputs"][inputid]["name"]] = getinputfield(libraryconfig["blocks"][classid]["inputs"][inputid], false, projectconfig["blocks"][uniqueid]["inputs"][inputid]);
  }
  for (let groupname in groups) {
    let group = html["group"];
    let groupcontent = "";
    for (let settingname in groups[groupname]) {
      groupcontent += groups[groupname][settingname];
    }
    group = group.replaceAll("%TITLE%", groupname);
    group = group.replaceAll("%ID%", groupname);
    group = group.replaceAll("%CONTENT%", groupcontent);
    popupcontent += group;
  }

  createpopup("BLOKK", popupcontent, "block");
}

function createIOblockpopup(ioID) {
  let mode = projectconfig["boardsettings"]["HWIO"][ioID]["mode"];
  let popupcontent = '<input type="hidden" id="ioid" value="' + ioID + '">';
  let groups = {};
  for (let inputid in libraryconfig["ioblocks"][mode]["inputs"]) {
    if (!groups[libraryconfig["ioblocks"][mode]["inputs"][inputid]["group"]]) {
      groups[libraryconfig["ioblocks"][mode]["inputs"][inputid]["group"]] = {};
    }
    groups[libraryconfig["ioblocks"][mode]["inputs"][inputid]["group"]][libraryconfig["ioblocks"][mode]["inputs"][inputid]["name"]] = getinputfield(libraryconfig["ioblocks"][mode]["inputs"][inputid], false, projectconfig["boardsettings"]["HWIO"][ioID]["inputs"][inputid]);
  }
  for (let groupname in groups) {
    let group = html["group"];
    let groupcontent = "";
    for (let settingname in groups[groupname]) {
      groupcontent += groups[groupname][settingname];
    }
    group = group.replaceAll("%TITLE%", groupname);
    group = group.replaceAll("%ID%", groupname);
    group = group.replaceAll("%CONTENT%", groupcontent);
    popupcontent += group;
  }

  createpopup("IO", popupcontent, "io");
}


function createpopup(title, content, popuptype) {
  let popup = html["popup"];
  popup = popup.replaceAll("%TITLE%", title);
  popup = popup.replaceAll("%CONTENT%", content);
  popup = popup.replaceAll("%CLOSESVG%", icon["close"]);
  popup = popup.replaceAll("%POPUPTYPE%", "'" + popuptype + "'");
  if (!document.getElementById("popup")) {
    document.querySelector("body").prepend(htmltodom(popup)[0]);
  }
  //no scroll when popup is shown
  document.body.style.position = 'fixed';
  document.body.style.top = `-${window.scrollY}px`;

}

function closepopup() {
  document.getElementById("popup").remove();

  //allow scrolll when popup is closed
  const scrollY = document.body.style.top;
  document.body.style.position = '';
  document.body.style.top = '';
  window.scrollTo(0, parseInt(scrollY || '0') * -1);
}


function okpopup(type) {
  let popupcontent = document.getElementById("popupcontent");
  let popupvalues = getAllValues(popupcontent);
  console.log(JSON.stringify(popupvalues));
  switch (type) {
    case "library":
      data_settingsaver(popupvalues, "librarysettings");
      break;
    case "board":
      data_settingsaver(popupvalues, "boardsettings");
      break;
    case "block":
      data_blocksaver(popupvalues);
      connectAllBlocks();
      break;
    case "io":
      data_iosaver(popupvalues);
      connectAllBlocks();
      break;
  }
  console.log(JSON.stringify(projectconfig));
  closepopup();
}



function getFormElementValue(element) {
  let tagName = element.tagName.toLowerCase();


  if (tagName === "input" && !element.disabled) {
    let type = element.type.toLowerCase();
    if (type === "text" || type === "hidden" || type === "password" || type === "number" || type === "email") {
      return element.value ? element.value : "";
    } else if (tagName === "input" && type === "checkbox") {
      return element.checked ? element.value : "";
    }
  } else if (tagName === "textarea") {
    return element.value;
  } else if (tagName === "select") {
    let selectedOption = element.options[element.selectedIndex];
    return selectedOption.value;
  } else if (element.classList.contains("inputchanger")) {
    let toreturn = element.getAttribute('value');
    for (let i = 0; i < element.nextSibling.children.length; i++) {
      let value = getFormElementValue(element.nextSibling.children[i]);
      if (value) {
        toreturn += "." + value;
      }
    }
    return toreturn.replace(".", ":");
  } else {
    return null;
  }
}

function getAllValues(element) {

  let ids = {};

  if (element.children) {
    for (let i = 0; i < element.children.length; i++) {
      let child = element.children[i];
      if (child.classList.contains("inputchanger")) {
        return getFormElementValue(child);
      }
      if (child.id) {
        ids[child.id] = getAllValues(child);

        if (Object.keys(ids[child.id]).length == 0) {
          let value = getFormElementValue(child);
          if (value != null) {
            ids[child.id] = value;
          } else {
            delete ids[child.id];
          }
        }
      } else {
        //merging two objects
        ids = $.extend(ids, getAllValues(child));
      }
    }
  } else {

  }
  return ids;
}
function getAllChildValues(element) {
  let toreturn = "";
  for (let i = 0; i < element.children.length; i++) {
    let child = element.children[i];
    if (child.id) {
      let value = getFormElementValue(child);
      if (value != null) {
        toreturn += "." + value;
      }
    }
  }
  toreturn = toreturn.replace(".", ":");
  return toreturn;
}