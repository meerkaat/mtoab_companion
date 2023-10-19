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
  let typeParent = typeElement.parentElement;

  // (array.includes)(type)
  // (itemType.includes as (x: unknown) => x is ItemType)(type)

  // (itemType.includes as (x: unknown) => x is ItemType)(type)
  //                    ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

  // itemType.includes(type)

  // TS -> if ((itemType.includes as (x: unknown) => x is ItemType)(type))
  // JS -> if (itemType.includes(type))

  const isItemType = (x: unknown): x is ItemType =>
    itemType.includes(x as ItemType);
  // const isItemType = itemType.includes.bind(itemType) as (x: unknown) => x is ItemType;

  // if (isItemType(type)) {
  if ((itemType.includes as (x: unknown) => x is ItemType)(type)) {
    // if (type === )
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

  // console.log(hunterOptions);

  let selectedHunterIndex: number = 0;
  let vaultStateEquip = vaultState.vaults[selectedHunterIndex].equippedItems;
  let vaultStateInv = vaultState.vaults[selectedHunterIndex].inventory;

  console.log(
    "initial state",
    "\n",
    "equip",
    vaultStateEquip,
    "inv",
    vaultStateInv,
  );

  hunterSelect.addEventListener("change", () => {
    selectedHunterIndex = hunterSelect.selectedIndex - 1;
    // console.log(selectedHunterIndex);
  });

  const equipItemInput = getElementByIdOrThrow<HTMLInputElement>(
    "equip-item-input",
  );
  const equipItemType = getElementByIdOrThrow<HTMLSelectElement>(
    "equip-item-type",
  );
  const equipItemBtn = getElementByIdOrThrow<HTMLButtonElement>("equip-item");
  const invAddBtn = getElementByIdOrThrow<HTMLButtonElement>("inv-add-item");

  const isItemType = (x: unknown): x is ItemType =>
    itemType.includes(x as ItemType);

  const addInputToUL = (
    typeElm: HTMLSelectElement,
    inputElm: HTMLInputElement,
    btnElm: HTMLButtonElement,
  ): void => {
    console.log(
      "after adding",
      "\n",
      "equip",
      vaultStateEquip,
      "inv",
      vaultStateInv,
    );
    // console.log(typeElm.parentElement);

    let newLI = document.createElement("li");
    let removeBtn = document.createElement("button");
    removeBtn.className = "remove-btn";
    removeBtn.textContent = "remove";
    // console.log(type.value);
    let ul;
    let saveToEquipOrInv;

    if (btnElm.id === "equip-item") {
      ul = getElementByIdOrThrow<HTMLUListElement>(`equip-${typeElm.value}-ul`);
      ul.dataset.type = `${typeElm.value}`;
      saveToEquipOrInv = vaultStateEquip;
    } else {
      ul = getElementByIdOrThrow<HTMLUListElement>(`inv-${typeElm.value}-ul`);
      ul.dataset.type = `${typeElm.value}`;
      saveToEquipOrInv = vaultStateInv;
    }

    if (isItemType(typeElm.value)) {
      if (inputElm.value !== "") {
        newLI.textContent = inputElm.value;
        newLI.append(removeBtn);
        ul.append(newLI);
        saveToEquipOrInv.push({
          type: typeElm.value,
          name: inputElm.value,
        });
        // saveItems(selectedHunterIndex, inputElm, typeElm);
      }
    }

    inputElm.value = "";

    // this removes the wrong items if items not removed from last added to first added.
    removeBtn.addEventListener("click", (e) => {
      if (e.target instanceof HTMLButtonElement) {
        const equipContainer = getElementByIdOrThrow<HTMLDivElement>(
          "equip-con",
        );
        const ivnContainer = getElementByIdOrThrow<HTMLDivElement>(
          "inventory-con",
        );
        // let itemToDelete = removeBtn.parentElement?.firstChild?.textContent;
        // let containingDiv = removeBtn.parentElement?.parentElement
        //   ?.parentElement;
        // let type = removeBtn.parentcd Element?.parentElement?.dataset.type;
        let itemToDelete = e.target.parentElement?.firstChild?.textContent;
        let containingDiv = e.target.parentElement?.parentElement
          ?.parentElement;
        let type = e.target.parentElement?.parentElement?.dataset.type;
        let location;
        console.log("item to remove", itemToDelete, "parent", containingDiv);

        if (containingDiv?.id === equipContainer.id) location = vaultStateEquip;
        if (containingDiv?.id === ivnContainer.id) location = vaultStateInv;

        if (location === undefined) throw new Error("'location' is undefined");
        if (type === undefined) throw new Error("'data-type' does not exist");
        if ((itemToDelete === undefined) || (itemToDelete === null)) {
          throw new Error("'itemToDelete' is undefined");
        }

        if (isItemType(type)) {
          // let index = location.indexOf();
          let index = location.findIndex((i) => i.name === itemToDelete);
          if (index !== -1) location.splice(index, 1);
          // console.log(test);

          newLI.remove();

          console.log(
            "after removing",
            "\n",
            "equip",
            vaultStateEquip,
            "inv",
            vaultStateInv,
          );
        } else throw new Error("taget doesn't exist");
      }
    });
  };

  equipItemBtn.addEventListener("click", () => {
    addInputToUL(equipItemType, equipItemInput, equipItemBtn);

    // console.log(
    //   "Equipped items array",
    //   vaultState.vaults[selectedHunterIndex].equippedItems,
    // );
    // let x = orderedList.getElementsByTagName("li");
    // console.log(x[0].textContent);
  });

  invAddBtn.addEventListener("click", () => {
    addInputToUL(equipItemType, equipItemInput, invAddBtn);
  });
}
main();
