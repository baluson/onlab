function data_createblock(classID) {
  let blockclass = data_getblockclass(classID);
  let uniqueid = data_getnewuniqueid();
  projectconfig["blocks"][uniqueid] = {};
  projectconfig["blocks"][uniqueid]["name"] = blockclass["name"] + uniqueid;
  projectconfig["blocks"][uniqueid]["classID"] = classID;
  projectconfig["blocks"][uniqueid]["uniqueID"] = uniqueid;
  projectconfig["blocks"][uniqueid]["inputs"] = {};
  for (let input in blockclass["inputs"]) {
    projectconfig["blocks"][uniqueid]["inputs"][input];
  }
  return uniqueid;
}

function data_settingsaver(popupdata, settingtype) {
  if (popupdata.hasOwnProperty("pinout")) {
    for (pinname in popupdata["pinout"]) {
      projectconfig["boardsettings"]["HWIO"][pinname]["mode"] = popupdata["pinout"][pinname];
    }
    placeIOBlocks()
  } else {
    projectconfig["blocks"][settingtype] += popupdata;
  }
}

function data_blocksaver(popupdata) {
  let uniqueid = popupdata["uniqueid"];
  delete popupdata["uniqueid"];
  projectconfig["blocks"][uniqueid]["inputs"] = popupdata;
}
function data_iosaver(popupdata) {
  let ioid = popupdata["ioid"];
  delete popupdata["ioid"];
  projectconfig["boardsettings"]["HWIO"][ioid]["inputs"] = popupdata;
}

function data_getblockclass(classID) {
  for (blockid in libraryconfig["blocks"]) {
    if (libraryconfig["blocks"][blockid]["classID"] == classID) {
      return libraryconfig["blocks"][blockid]
    }
  }
}

function data_getIONameByPin(pin) {
  return boardconfig["settings"]["HWIO"][pin]["name"];
}

function data_getnewuniqueid() {
  let maxid = 0;
  try {
    for (blockid in projectconfig["blocks"]) {
      if (projectconfig["blocks"][blockid]["uniqueID"] > maxid) {
        maxid = projectconfig["blocks"][blockid]["uniqueID"];
      }
    }
  } catch { }
  return maxid + 1;
}

function data_createproject(name) {
  workspace.innerHTML = "";
  projectconfig = {};
  projectconfig["boardID"] = boardconfig["boardID"];
  projectconfig["libraryVer"] = libraryconfig["libraryversion"];
  projectconfig["name"] = name;
  projectconfig["blocks"] = {};
  projectconfig["boardsettings"] = {};
  for (settinggroup in boardconfig["settings"]) {
    projectconfig["boardsettings"][settinggroup] = {}
    for (settingid in boardconfig["settings"][settinggroup]) {
      if (settinggroup == "HWIO") {
        projectconfig["boardsettings"][settinggroup][boardconfig["settings"][settinggroup][settingid]["name"]] = {};
        if (boardconfig["settings"][settinggroup][settingid]["type"] != 0) {
          projectconfig["boardsettings"][settinggroup][boardconfig["settings"][settinggroup][settingid]["name"]]["pin"] = settingid;
          projectconfig["boardsettings"][settinggroup][boardconfig["settings"][settinggroup][settingid]["name"]]["mode"] = boardconfig["settings"][settinggroup][settingid]["value"];
          projectconfig["boardsettings"][settinggroup][boardconfig["settings"][settinggroup][settingid]["name"]]["inputs"] = {};
        }
      } else {
        projectconfig["boardsettings"][settinggroup][boardconfig["settings"][settinggroup][settingid]["name"]] = boardconfig["settings"][settinggroup][settingid]["value"]
      }
    }
  }
  projectconfig["librarysettings"] = {};
  for (settinggroup in libraryconfig["settings"]) {
    projectconfig["librarysettings"][settinggroup] = {}
    for (settingid in libraryconfig["settings"][settinggroup]) {
      if (libraryconfig["settings"][settinggroup][settingid]["type"] != 0) {
        projectconfig["librarysettings"][settinggroup][libraryconfig["settings"][settinggroup][settingid]["name"]] = libraryconfig["settings"][settinggroup][settingid]["value"];
      }
    }
  }
  console.log(projectconfig);
}

function data_getproject() {
  xhr = new XMLHttpRequest();
  xhr.open('GET', 'project.php', true);
  xhr.timeout = 5000;
  xhr.onreadystatechange = callbackGetProject;
  xhr.send();
}

function callbackGetProject() {
  if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
    projectconfig = JSON.parse(xhr.responseText);
    for (let blockid in projectconfig["blocks"]) {
      loadblock(blockid);
    }
    connectAllBlocks();
  }
}

function data_saveproject() {
  let data = new FormData();
  data.append('data', JSON.stringify(projectconfig));
  xhr = new XMLHttpRequest();
  xhr.open('POST', 'project.php', true);
  xhr.timeout = 5000;
  xhr.onreadystatechange = callbackSaveProject;
  xhr.send(data);
}

function callbackSaveProject() {
  if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
  }
}


