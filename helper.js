const suppliesCoulmnJson = [
  { name: "id", type: null, value: "" },
  { name: "chemicalName", label: "Chemical Name", order: null },
  { name: "vendor", label: "Vendor", order: null },
  { name: "density", label: "Density", order: null },
  { name: "viscosity", label: "Viscosity", order: null },
  { name: "packaging", label: "Packaging", order: null },
  { name: "packSize", label: "Pack size", order: null },
  { name: "unit", label: "Unit", order: null },
  { name: "quantity", label: "Quantity", order: null },
];

const suppliesJson = [
  { name: "id", type: null, value: "" },
  {
    name: "chemicalName",
    label: "Chemical Name",
    type: "text",
    required: true,
    value: "",
  },
  { name: "vendor", label: "Vendor", type: "text", required: true, value: "" },
  {
    name: "density",
    label: "Density",
    type: "number",
    step: 0.01,
    min: 0,
    required: true,
    value: "",
  },
  {
    name: "viscosity",
    label: "Viscosity",
    type: "number",
    min: 0,
    step: 0.01,
    required: true,
    value: "",
  },
  {
    name: "packaging",
    label: "Packaging",
    type: "select",
    required: true,
    options: ["Bag", "Barrel", "N/A"],
    value: "",
  },
  {
    name: "packSize",
    label: "Pack size",
    type: "number",
    step: 0.01,
    min: 0,
    required: true,
    value: "",
  },
  {
    name: "unit",
    label: "Unit",
    type: "select",
    required: true,
    options: ["kg", "l", "t"],
    value: "",
  },
  {
    name: "quantity",
    label: "Quantity",
    type: "number",
    step: 0.01,
    min: 0,
    required: true,
    value: "",
  },
];

function generateField(supply) {
  let element = null;
  if (supply.type === null) {
    return null;
  }
  if (supply.type === "text" || supply.type === "number") {
    element = document.createElement("input");
    element.type = supply.type;
    if (supply.type === "number") {
      element.min = supply.min;
      element.step = supply.step;
    }
  }

  if (supply.type === "select") {
    element = document.createElement("select");
    supply.options.map((option) => {
      const optionElem = document.createElement("option");
      optionElem.value = option;
      optionElem.innerHTML = option;
      element.appendChild(optionElem);
    });
  }

  element.name = supply.name;
  element.id = supply.name;
  element.value = supply.value;
  element.addEventListener("change", (e) => {
    supply.value = e.target.value;
  });
  return element;
}
