let buttonCancel = document.getElementById("cancel");
buttonCancel.addEventListener("click", onCancel);
let buttonAdd = document.getElementById("add");
buttonAdd.addEventListener("click", onAdd);
let buttonEdit = document.getElementById("edit");
buttonEdit.addEventListener("click", onEdit);
let buttonMoveDown = document.getElementById("move-down");
buttonMoveDown.addEventListener("click", onMoveDown);
let buttonMoveUp = document.getElementById("move-up");
buttonMoveUp.addEventListener("click", onMoveUp);
let buttonDelete = document.getElementById("delete");
buttonDelete.addEventListener("click", onDeleteSupply);
let buttonRefresh = document.getElementById("refresh");
buttonRefresh.addEventListener("click", onRefresh);
let buttonSave = document.getElementById("save");
buttonSave.addEventListener("click", onSave);
let tableId = document.getElementById("table");
let bodyId = document.getElementById("tableBody");
const error = document.getElementById("displayMessage");
const errorModal = document.getElementById("displayModalMessage");
const column = document.getElementById("column");
const dialog = document.querySelector("dialog");
const closeButton = document.querySelector("dialog button");
let currentSelectedRow = null;
let currentSortColumn = null;
let supplies = [...chemical_supplies];
const upArrow = document.createElement("span");
upArrow.innerHTML = "⬆";
upArrow.id = "upArrow";
upArrow.class = "upArrow";
const downArrow = document.createElement("span");
downArrow.innerHTML = "⬇";
downArrow.id = "downArrow";
downArrow.class = "downArrow";

window.onerror = function (message, source, lineno, colno, error) {
  console.log(message);
  console.log(error);
};

function onLoad() {
  loadColumnHeadings();
  buttonsInitialState();
  loadSuppliesTable();
}

function loadColumnHeadings() {
  let thead = document.createElement("thead");
  suppliesCoulmnJson.map((column) => {
    let th = document.createElement("th");
    if (column.name === "id") {
      th.innerHTML = "✔";
    } else {
      const button = document.createElement("button");
      button.id = "columnSort";
      button.name = column.name;
      button.innerHTML = column.label;
      button.addEventListener("click", onSort.bind(null, column.name));
      th.appendChild(button);
      th.id = column.name;
    }
    thead.appendChild(th);
  });

  tableId.appendChild(thead);
}

function buttonsInitialState() {
  buttonDelete.disabled = true;
  buttonEdit.disabled = true;
  buttonSave.disabled = true;
  buttonMoveUp.disabled = true;
  buttonMoveDown.disabled = true;
  buttonRefresh.disabled = false;
  buttonAdd.style.display = "inline";
  buttonCancel.style.display = "none";
}

function loadSuppliesTable() {
  bodyId.innerHTML = "";

  supplies.map((supply) => {
    let tr = document.createElement("tr");
    for (let key in supply) {
      let td = document.createElement("td");
      if (key === "id") {
        let element = document.createElement("input");
        element.type = "checkbox";
        element.name = "checkbox";
        element.id = supply[key];
        element.addEventListener(
          "change",
          onCheckboxSelected.bind(this, supply[key])
        );
        td.appendChild(element);
        tr.appendChild(td);
        continue;
      }
      let text = document.createTextNode(supply[key]);
      td.appendChild(text);
      tr.appendChild(td);
    }

    bodyId.appendChild(tr);
  });
}

function onSort(columnName) {
  if (currentSelectedRow) {
    onCheckboxSelected(currentSelectedRow);
  }
  let isCurrentAndNextSortColumnSame = false;
  if (currentSortColumn === columnName) {
    isCurrentAndNextSortColumnSame = true;
  }
  const column = document.querySelector(`th[id=${columnName}]`);
  document.querySelectorAll("span[id='upArrow']").forEach((e) => e.remove());
  document.querySelectorAll("span[id='downArrow']").forEach((e) => e.remove());

  suppliesCoulmnJson.map((c) => {
    if (c.name === currentSortColumn && !isCurrentAndNextSortColumnSame) {
      c.order = null;
    }
  });

  suppliesCoulmnJson.map((c) => {
    if (c.name === columnName) {
      if (c.order === null || c.order === "desc") {
        c.order = "asc";
        column.append(downArrow);
      } else {
        c.order = "desc";
        column.append(upArrow);
      }

      currentSortColumn = columnName;
      sortColumn(c.name, c.order);
    }
  });
}

function sortColumn(columnName, dir) {
  supplies.sort(function (a, b) {
    var keyA =
      typeof a[columnName] === "string"
        ? a[columnName].toLowerCase()
        : a[columnName];
    keyB =
      typeof b[columnName] === "string"
        ? b[columnName].toLowerCase()
        : b[columnName];
    if (dir === "asc") {
      // Compare the 2 fields in asc order
      if (keyA < keyB) return -1;
      if (keyA > keyB) return 1;
      return 0;
    } else {
      // Compare the 2 fields in desc order
      if (keyA < keyB) return 1;
      if (keyA > keyB) return -1;
      return 0;
    }
  });

  loadSuppliesTable();
}

function onCheckboxSelected(id) {
  if (currentSelectedRow === id) {
    currentSelectedRow = null;
    buttonDelete.disabled = true;
    buttonEdit.disabled = true;
    buttonMoveUp.disabled = true;
    buttonMoveDown.disabled = true;
    return;
  }
  if (currentSelectedRow) {
    const elem = document.getElementById(currentSelectedRow);
    elem.click();
  }
  currentSelectedRow = id;

  buttonDelete.disabled = false;
  buttonEdit.disabled = false;
  moveButtonsEnable();
}

function onAdd() {
  if (currentSelectedRow) {
    onCheckboxSelected(currentSelectedRow);
  }
  let checkboxes = document.querySelectorAll("input[type='checkbox']");
  let sortButtons = document.querySelectorAll("button[id='columnSort']");
  buttonRefresh.disabled = true;
  buttonSave.disabled = false;
  buttonCancel.style.display = "inline";
  buttonAdd.style.display = "none";
  for (let i = 0; i < checkboxes.length; i++) {
    checkboxes[i].disabled = true;
  }
  for (let i = 0; i < sortButtons.length; i++) {
    sortButtons[i].disabled = true;
  }
  addNewSupply();
}

function addNewSupply() {
  error.innerHTML =
    "Fields -> Chemical name, Vendor, Density, Viscosity, Unit, Quantity are required";
  let tr = document.createElement("tr");
  tr.id = "newSupply";
  suppliesJson.map((supply) => {
    let td = document.createElement("td");
    supply.value = "";
    let element = generateField(supply);
    element && td.appendChild(element);
    tr.appendChild(td);
  });
  bodyId.prepend(tr);
}

function onCancel() {
  error.innerHTML = "";
  const elem = document.getElementById("newSupply");
  bodyId.removeChild(elem);
  let checkboxes = document.querySelectorAll("input[type='checkbox']");
  let sortButtons = document.querySelectorAll("button[id='columnSort']");
  for (let i = 0; i < checkboxes.length; i++) {
    checkboxes[i].disabled = false;
  }
  for (let i = 0; i < sortButtons.length; i++) {
    sortButtons[i].disabled = false;
  }
  buttonRefresh.disabled = false;
  buttonCancel.style.display = "none";
  buttonAdd.style.display = "inline";
}

function onSave(e, action = "add") {
  const saveObject = {};
  let validationError = false;
  suppliesJson.map((supply) => {
    if (
      supply.name !== "id" &&
      supply.name !== "packaging" &&
      supply.name !== "packSize" &&
      !supply.value
    ) {
      if (action === "add") {
        error.innerHTML = "Please fill in value for all required fields";
      } else {
        errorModal.innerHTML = "Please fill in value for all required fields";
      }
      validationError = true;
    } else {
      let value =
        supply.type === "number" && supply.name !== "packSize"
          ? Number(supply.value).toFixed(2)
          : supply.value === ""
          ? "N/A"
          : supply.value;
      saveObject[supply.name] = value;
    }
  });

  if (validationError) return;

  if (action === "add") {
    let max = Math.max(...supplies.map((s) => s.id));
    saveObject["id"] = max + 1;
    supplies = [saveObject, ...supplies];
    currentSortColumn &&
      suppliesCoulmnJson.map((c) =>
        c.name === currentSortColumn ? sortColumn(c.name, c.order) : null
      );
    error.innerHTML = "";

    let sortButtons = document.querySelectorAll("button[id='columnSort']");
    for (let i = 0; i < sortButtons.length; i++) {
      sortButtons[i].disabled = false;
    }
    buttonsInitialState();
  } else {
    supplies = supplies.map((supply) => {
      if (supply.id === currentSelectedRow) {
        saveObject["id"] = currentSelectedRow;
        supply = {
          ...saveObject,
        };
      }
      return supply;
    });
  }
  loadSuppliesTable();
}

function onMoveUp() {
  let rowIndex = getIndex();

  if (rowIndex !== null) {
    let elem = supplies.splice(rowIndex, 1);
    supplies.splice(rowIndex - 1, 0, elem[0]);
    currentSelectedRow = null;
    buttonsInitialState();
    loadSuppliesTable();
  }
}

function onMoveDown() {
  let rowIndex = getIndex();

  if (rowIndex !== null) {
    let elem = supplies.splice(rowIndex, 1);
    supplies.splice(rowIndex + 1, 0, elem[0]);
    currentSelectedRow = null;
    buttonsInitialState();
    loadSuppliesTable();
  }
}

function onDeleteSupply() {
  const confirmDelete = confirm(
    "Are you sure you want to delete the selected row?"
  );

  if (confirmDelete) {
    let rowIndex = getIndex();

    if (rowIndex !== null) {
      supplies.splice(rowIndex, 1);
      currentSelectedRow = null;
      buttonsInitialState();
      loadSuppliesTable();
    }
  }
}

function onEdit() {
  let editRow = supplies.find((supply) => supply.id === currentSelectedRow);
  errorModal.innerHTML =
    "Fields -> Chemical name, Vendor, Density, Viscosity, Unit, Quantity are required";
  let form = document.createElement("form");
  suppliesJson.map((supply) => {
    if (supply.name === "id") return;
    let div = document.createElement("div");
    let label = document.createElement("label");
    label.innerHTML = supply.label;
    div.appendChild(label);
    supply.value = editRow[supply.name];
    let element = generateField(supply);
    element && div.appendChild(element);
    form.appendChild(div);
  });
  const buttonDiv = document.createElement("div");
  buttonDiv.id = "buttonDiv";
  const buttonCancelEdit = document.createElement("button");
  buttonCancelEdit.id = "cancelEdit";
  buttonCancelEdit.innerHTML = "Cancel";
  buttonCancelEdit.addEventListener("click", closeDialog);
  const button = document.createElement("button");
  button.id = "editRow";
  button.innerHTML = "Edit";
  button.addEventListener("click", function () {
    onSave(null, "edit");
    onCheckboxSelected(currentSelectedRow);
    closeDialog();
  });
  dialog.appendChild(form);
  buttonDiv.appendChild(buttonCancelEdit);
  buttonDiv.appendChild(button);
  dialog.appendChild(buttonDiv);
  dialog.showModal();
}

// "Close" button closes the edit dialog
closeButton.addEventListener("click", closeDialog);

function closeDialog() {
  dialog.removeChild(document.getElementById("buttonDiv"));
  dialog.removeChild(document.querySelector("form"));
  dialog.close();
}

function onRefresh() {
  supplies = [...chemical_supplies];
  document.querySelectorAll("span[id='upArrow']").forEach((e) => e.remove());
  document.querySelectorAll("span[id='downArrow']").forEach((e) => e.remove());
  buttonsInitialState();
  loadSuppliesTable();
}

function getIndex() {
  let rowIndex = null;
  supplies.map((supply, index) =>
    supply.id === currentSelectedRow ? (rowIndex = index) : null
  );

  return rowIndex;
}

function moveButtonsEnable() {
  if (supplies.length === 1) return;
  let rowIndex = getIndex();

  if (rowIndex === 0) {
    buttonMoveUp.disabled = true;
    buttonMoveDown.disabled = false;
  } else if (rowIndex && rowIndex === supplies.length - 1) {
    buttonMoveUp.disabled = false;
    buttonMoveDown.disabled = true;
  } else {
    buttonMoveUp.disabled = false;
    buttonMoveDown.disabled = false;
  }
}
