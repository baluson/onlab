

function createstripselection() {
  let stripselector = "";
  let primarycategories = {};
  primarycategories["Settings"] = "1";
  for (blockid in libraryconfig["blocks"]) {
    primarycategories[libraryconfig["blocks"][blockid]["primarycategory"]] = "0";

  }
  for (primarycategory in primarycategories) {
    let stripselectoption = html["stripselect"];
    stripselectoption = stripselectoption.replaceAll("%TITLE%", primarycategory);
    stripselectoption = stripselectoption.replaceAll("%ACTION%", (primarycategories[primarycategory] == 1 ? "checked" : ""));
    stripselector += stripselectoption;
  }
  document.getElementById("stripselector").innerHTML = stripselector;
}


function stripchange() {
  let stripid = document.querySelector('input[name="stripselector"]:checked').value;
  if (stripid == "Settings") {
    document.getElementById("strip").innerHTML = settingstrip();
  } else {
    let stripcontent = "";
    let secondarycategories = {};
    for (blockid in libraryconfig["blocks"]) {
      if (libraryconfig["blocks"][blockid]["primarycategory"] == stripid) {
        secondarycategories[libraryconfig["blocks"][blockid]["secondarycategory"]] = 0;
      }
    }
    for (secondarycategory in secondarycategories) {
      let section = html["stripsection"];
      let sectioncontent = "";
      for (blockid in libraryconfig["blocks"]) {
        if (libraryconfig["blocks"][blockid]["primarycategory"] == stripid && libraryconfig["blocks"][blockid]["secondarycategory"] == secondarycategory) {
          let blokk = html["stripblokk"];
          blokk = blokk.replaceAll("%CONTENT%", icon[libraryconfig["blocks"][blockid]["name"]]);
          blokk = blokk.replaceAll("%TITLE%", libraryconfig["blocks"][blockid]["name"]);
          blokk = blokk.replaceAll("%ACTION%", ' draggable="true" ondragstart="dragstart(' + libraryconfig["blocks"][blockid]["classID"] + ')" ');
          sectioncontent += blokk;
        }
      }
      section = section.replaceAll("%TITLE%", secondarycategory);
      section = section.replaceAll("%CONTENT%", sectioncontent);
      stripcontent += section;
    }
    document.getElementById("strip").innerHTML = stripcontent;
  }
}

function settingstrip() {
  let toreturn = "";

  //software
  let section = html["stripsection"];
  let sectioncontent = "";

  section = html["stripsection"];
  sectioncontent = "";
  for (blokktitle in boardconfig["settings"]) {
    let blokk = html["stripblokk"];
    blokk = blokk.replaceAll("%CONTENT%", icon[blokktitle]);
    blokk = blokk.replaceAll("%TITLE%", blokktitle);
    blokk = blokk.replaceAll("%ACTION%", ' onclick="createsettingspopup(\'board\',\'' + blokktitle + '\')" ');
    sectioncontent += blokk;
  }
  section = section.replaceAll("%CONTENT%", sectioncontent);
  section = section.replaceAll("%TITLE%", "Board settings");
  toreturn += section;

  section = html["stripsection"];
  sectioncontent = "";
  for (blokktitle in libraryconfig["settings"]) {
    let blokk = html["stripblokk"];
    blokk = blokk.replaceAll("%CONTENT%", icon[blokktitle]);
    blokk = blokk.replaceAll("%TITLE%", blokktitle);
    blokk = blokk.replaceAll("%ACTION%", ' onclick="createsettingspopup(\'library\',\'' + blokktitle + '\')" ');
    sectioncontent += blokk;
  }
  section = section.replaceAll("%CONTENT%", sectioncontent);
  section = section.replaceAll("%TITLE%", "Software settings");
  toreturn += section;
  return toreturn;
}