// I have no idea how the Borderlands inventory works
// so I'm not sure what these data structures should look like…

/** Any valid JSON value */
type JsonValue =
  | boolean
  | number
  | null
  | string
  | Array<JsonValue>
  | { [key: string]: JsonValue | undefined };

const itemType = [
  "weapons",
  "grenades",
  "shields",
  "mods",
  "misc",
] as const;

type ItemType = typeof itemType[number];

type Item = {
  type: ItemType;
  name: string;
};

// let sampleItem: Item = {type: "weapon", name: "gun",}

type VaultData = {
  name: string;
  equippedItems: Item[];
  inventory: Item[];
};

// let sampletVD: VaultData = {
//   name: amara,
//   equippedItems: [
//     { type: "weapon", name: "gun" },
//   ],
//   inventory: [
//     { type: "weapon", name: "gun" },
//   ],
// };

type State = {
  level: number;
  scenario: number;
  vaults: VaultData[];
};

// let sample: State = {
//   level: 0,
//   scenario: 0,
//   vaults: [{
//     name: "amara",
//     equippedItems: [{ type: "weapons", name: "gun" }],
//     inventory: [{ type: "weapons", name: "gun" }],
//   }],
// };

// let vaultState: State;

let vaultState: State = {
  level: 0,
  scenario: 0,
  vaults: [{
    name: "amara",
    equippedItems: [],
    inventory: [],
  }],
};

function assert(expr: unknown, msg?: string): asserts expr {
  if (!expr) throw new Error(msg);
}

function getElementByIdOrThrow<T extends HTMLElement>(
  selector: string,
  msg = `Element '${selector}' not found`,
): T {
  const element = document.getElementById(selector);
  if (!element) throw new Error(msg);
  return element as T;
}

function saveState(): void {
  localStorage.setItem("vaultState", JSON.stringify(vaultState));
}

function loadState(): State {
  return vaultState;
}

function saveItems(
  hunterIndex: number,
  inputElement: HTMLInputElement,
  typeElement: HTMLSelectElement,
): void {
  const type = typeElement.value;
  const name = inputElement.value;

  // (array.includes)(type)
  // (itemType.includes as (x: unknown) => x is ItemType)(type)

  // (itemType.includes as (x: unknown) => x is ItemType)(type)
  //                    ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

  // itemType.includes(type)

  // TS -> if ((itemType.includes as (x: unknown) => x is ItemType)(type))
  // JS -> if (itemType.includes(type))

  // const isItemType = (x: unknown): x is ItemType => itemType.includes(x as ItemType);
  // const isItemType = itemType.includes.bind(itemType) as (x: unknown) => x is ItemType;

  // if (isItemType(type)) {
  if ((itemType.includes as (x: unknown) => x is ItemType)(type)) {
    // if (name === )
    vaultState.vaults[hunterIndex].equippedItems.push({ type, name });
  } else {
    throw new Error(
      `Expect type 'ItemType'. '${type}' is not type 'ItemType'`,
    );
  }
}

function removeItemsFromStorage(hunterIndex: number, item: string): void {
}

//*=========================================== MAIN ===========================================*/

function main() {
  const valutBtns = [...document.querySelectorAll(".vault")];
  const hunterSelect = getElementByIdOrThrow<HTMLSelectElement>("char-select");
  const hunterSelectEl = getElementByIdOrThrow<HTMLSelectElement>(
    "char-select",
  );

  let hunterOptions = [...hunterSelectEl.options]
    .filter((option) => option.value !== "Select Vault Hunter")
    .map((option) => option.value);
  // .filter((value) => value !== undefined);

  // let hunterOptions = [
  //   // ...document.querySelectorAll<HTMLOptionElement>("option[value]"),
  //   // https://developer.mozilla.org/en-US/docs/Web/CSS/:scope
  //   ...hunterSelectEl.querySelectorAll<HTMLOptionElement>(":scope > option[value]"),
  // ].map((option) => option.value);

  // let hunterOptions = [...hunterSelectEl.options].filter((option) =>
  //   option.hasAttribute("value")
  // ).map((option) => option.value);

  console.log(hunterOptions);

  let selectedHunterIndex: number = 0;

  hunterSelect.addEventListener("change", () => {
    selectedHunterIndex = hunterSelect.selectedIndex - 1;
    console.log(selectedHunterIndex);
  });

  const equipItemInput = getElementByIdOrThrow<HTMLInputElement>(
    "equip-item-input",
  );
  const equipItemType = getElementByIdOrThrow<HTMLSelectElement>(
    "equip-item-type",
  );
  const equipItemBtn = getElementByIdOrThrow<HTMLButtonElement>("equip-item");
  const invAddBtn = getElementByIdOrThrow<HTMLButtonElement>("inv-add-item");

  const addInputToUL = (
    typeElm: HTMLSelectElement,
    inputElm: HTMLInputElement,
    btnElm: HTMLButtonElement,
  ): void => {
    let newLI = document.createElement("li");
    let removeBtn = document.createElement("button");
    removeBtn.className = "remove-btn";
    removeBtn.textContent = "remove";
    // console.log(type.value);
    let ul = (btnElm.id === "equip-item")
      ? getElementByIdOrThrow<HTMLUListElement>(`equip-${typeElm.value}-ul`)
      : getElementByIdOrThrow<HTMLUListElement>(`inv-${typeElm.value}-ul`);

    if (inputElm.value !== "") {
      newLI.textContent = inputElm.value;
      newLI.append(removeBtn);
      ul.append(newLI);
      console.log(newLI.value);

      saveItems(selectedHunterIndex, inputElm, typeElm);
    }

    inputElm.value = "";
    
    removeBtn.addEventListener("click", () => {
      newLI.remove();
      // let itemsToRemove = ul.querySelectorAll("li")
      // let index = vaultState.vaults[selectedHunterIndex].equippedItems.indexOf({
      //   type: newLI.value,
      //   name: itemsToRemove,
      // });
      // vaultState.vaults[selectedHunterIndex].equippedItems.splice(index, 1);
    });
  };

  equipItemBtn.addEventListener("click", () => {
    addInputToUL(equipItemType, equipItemInput, equipItemBtn);
    console.log("Equipped items array", vaultState.vaults[selectedHunterIndex].equippedItems);
    // let x = orderedList.getElementsByTagName("li");
    // console.log(x[0].textContent);
  });
  
  invAddBtn.addEventListener("click", () => {
    addInputToUL(equipItemType, equipItemInput, invAddBtn);
    
  });
}

main();
