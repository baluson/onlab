function dragstart(id) {
  draggedblockid = id;
}

function allowdrop(ev) {
  ev.preventDefault();
}

function dropblock(event) {
  event.preventDefault();
  uniqueid = data_createblock(draggedblockid);
  projectconfig["blocks"][uniqueid]["coordx"] = event.clientX - workspaceRect.left;
  projectconfig["blocks"][uniqueid]["coordy"] = event.clientY - workspaceRect.top;
  loadblock(uniqueid);
}

function loadblock(uniqueid) {
  projectconfig["blocks"][uniqueid]["classID"]

  let block = html["block"];
  block = block.replaceAll("%ACTION%", 'onmousedown="selectblock(event, this)" onmouseup="deselectblock()" oncontextmenu="blockcontextmenu(event,\'block_%ID%\')" ondblclick="createblockpopup(%ID%)" ');
  block = block.replaceAll("%TITLE%", projectconfig["blocks"][uniqueid]["name"]);
  block = block.replaceAll("%SVG%", icon[projectconfig["blocks"][uniqueid]["classID"]]);
  block = block.replaceAll("%ID%", uniqueid);
  block = htmltodom(block)[0];
  block.style.left = projectconfig["blocks"][uniqueid]["coordx"] + "px";
  block.style.top = projectconfig["blocks"][uniqueid]["coordy"] + "px";
  document.getElementById("workspace").appendChild(block);
}

function moveblock(event) {
  if (selectedblock && event.buttons === 1) {
    const blockRect = selectedblock["block"].getBoundingClientRect();
    let newBlockX = event.clientX - selectedblock["bx"] - workspaceRect.left;
    let newBlockY = event.clientY - selectedblock["by"] - workspaceRect.top;
    if (newBlockX < 0) {
      newBlockX = 0;
    }
    if (newBlockX + blockRect.width > workspaceRect.right - workspaceRect.left) {
      newBlockX = workspaceRect.right - blockRect.width - workspaceRect.left;
    }
    if (newBlockY < 0) {
      newBlockY = 0;
    }
    if (newBlockY + blockRect.height > workspaceRect.bottom - workspaceRect.top) {
      newBlockY = workspaceRect.bottom - blockRect.height - workspaceRect.top;
    }
    selectedblock["block"].style.left = newBlockX + "px";
    selectedblock["block"].style.top = newBlockY + "px";
    uniqueid = selectedblock["block"].id.split("_")[1];
    projectconfig["blocks"][uniqueid]["coordx"] = newBlockX;
    projectconfig["blocks"][uniqueid]["coordy"] = newBlockY;

    //arrows
    connectAllBlocks();
  }
}

function selectblock(event, block) {
  selectedblock = {};
  selectedblock["block"] = block;
  selectedblock["mx"] = event.clientX;
  selectedblock["my"] = event.clientY;
  const blockRect = selectedblock["block"].getBoundingClientRect();
  selectedblock["bx"] = event.clientX - blockRect.left;
  selectedblock["by"] = event.clientY - blockRect.top;
}

function deselectblock(event) {
  selectedblock = null;
}

function deleteblock(id) {
  document.getElementById(id).remove();
}

function blockcontextmenu(event, id) {
  let content = "";
  option = html["contextmenuoption"];
  option = option.replaceAll("%TITLE%", "Delete")
  option = option.replaceAll("%ACTION%", 'onclick="removecontextmenu(); deleteblock(\'' + id + '\');"')
  content += option;

  option = html["contextmenuoption"];
  option = option.replaceAll("%TITLE%", "Properties")
  option = option.replaceAll("%ACTION%", 'onclick="removecontextmenu(); createblockpopup(\'' + id.split('_')[1] + '\');"')
  content += option;

  addcontextmenu(event, content)
}

function addcontextmenu(event, content) {
  contextmenu.classList.remove("visible");
  contextmenu.style.left = `${event.clientX}px`;
  contextmenu.style.top = `${event.clientY}px`;
  contextmenu.innerHTML = content;
  contextmenu.classList.add("visible");
}

function removecontextmenu() {
  contextmenu.classList.remove("visible");
}

function connectAllBlocks() {
  let arrowElements = workspace.querySelectorAll('.arrow');
  arrowElements.forEach(element => element.remove());
  for (let blockid in projectconfig["blocks"]) {
    for (let inputid in projectconfig["blocks"][blockid]["inputs"]) {
      try {
        if (projectconfig["blocks"][blockid]["inputs"][inputid].split(":")[0] == "BLOCK") {
          connectBlocks("block_" + projectconfig["blocks"][blockid]["inputs"][inputid].split(":")[1].split(".")[0], "block_" + blockid);
        }
      } catch { }
      try {
        if (projectconfig["blocks"][blockid]["inputs"][inputid].split(":")[0] == "IO") {
          connectBlocks("ioblock_" + data_getIONameByPin(projectconfig["blocks"][blockid]["inputs"][inputid].split(":")[1].split(".")[0]), "block_" + blockid);
        }
      } catch { }
    }
  }
  for (let ioname in projectconfig["boardsettings"]["HWIO"]) {
    for (let inputid in projectconfig["boardsettings"]["HWIO"][ioname]["inputs"]) {
      try {
        if (projectconfig["boardsettings"]["HWIO"][ioname]["inputs"][inputid].split(":")[0] == "BLOCK") {
          connectBlocks("block_" + projectconfig["boardsettings"]["HWIO"][ioname]["inputs"][inputid].split(":")[1].split(".")[0], "ioblock_" + ioname);
        }
      } catch { };
    }
  }
}

function placeIOBlocks() {
  let arrowElements = workspace.querySelectorAll('.ioblock');
  arrowElements.forEach(element => element.remove());
  let left = 0;
  let right = 0;
  for (let pinname in projectconfig["boardsettings"]["HWIO"]) {
    if (projectconfig["boardsettings"]["HWIO"][pinname]["mode"] < 0) {
      continue;
    }
    let ioblock = html["ioblock"];
    let input = ["0", "1"].includes(projectconfig["boardsettings"]["HWIO"][pinname]["mode"]);
    ioblock = ioblock.replaceAll("%ACTION%", 'ondblclick="createIOblockpopup(\'%ID%\')" ');
    ioblock = ioblock.replaceAll("%TITLE%", pinname);
    ioblock = ioblock.replaceAll("%SVG%", icon[(input ? "input" : "output")]);
    ioblock = ioblock.replaceAll("%ID%", pinname);
    ioblock = htmltodom(ioblock)[0];
    ioblock.style.left = (input ? 10 : workspaceRect.width - 80) + "px";
    ioblock.style.top = (input ? left * 80 + 10 : right * 80 + 10) + "px";
    (input ? left++ : right++);
    workspace.appendChild(ioblock);
  }
}

function connectBlocks(block1Id, block2Id) {
  /*if (block2Id == block1Id) {
    return;
  }*/
  let block1 = document.getElementById(block1Id);
  let block2 = document.getElementById(block2Id);

  let arrow = html["arrow"];

  let x1 = block1.offsetLeft + block1.offsetWidth / 2;
  let y1 = block1.offsetTop + block1.offsetHeight / 2;
  let x2 = block2.offsetLeft + block2.offsetWidth / 2;
  let y2 = block2.offsetTop + block2.offsetHeight / 2;

  let angle = Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI;
  let length = Math.sqrt((y2 - y1) ** 2 + (x2 - x1) ** 2);
  arrow = arrow.replaceAll("%WIDTH%", length);
  arrow = arrow.replaceAll("%TOP%", y1 - 10);
  arrow = arrow.replaceAll("%LEFT%", x1);
  arrow = arrow.replaceAll("%ROTATE%", angle);

  let dx = block2.offsetWidth / 2;
  angle = Math.abs(angle);
  if (angle < 135 && angle > 45) {
    angle = angle - 90;
  } else if (angle > 135) {
    angle = 45 - (angle - 135);
  }
  let dy = dx * Math.tan((angle % 90) * Math.PI / 180);
  let dst = Math.sqrt(dx ** 2 + dy ** 2);

  arrow = arrow.replaceAll("%HEADRIGHT%", dst);
  workspace.insertBefore(htmltodom(arrow)[0], workspace.firstChild);
}