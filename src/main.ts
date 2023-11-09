// I have no idea how the Borderlands inventory works
// so I'm not sure what these data structures should look like…
// 🔥🔥🔥🔥🔥🔥🚿🚒 *Me dealing with the heat*

import { renderEquipAndInv } from "./template.js";
import { assert, getElementByIdTyped } from "./utilities.js";

/** Any valid JSON value */
type JsonValue =
  | boolean
  | number
  | null
  | string
  | Array<JsonValue>
  | { [key: string]: JsonValue | undefined };

const itemType = [
  "weapon",
  "grenade",
  "shield",
  "misc",
] as const;

type ItemType = typeof itemType[number];

type Item = {
  type: ItemType;
  name: string;
};

type VaultData = {
  name?: string;
  equippedItems: Item[];
  inventory: Item[];
};

type State = {
  level: number;
  scenario: number;
  vaults: VaultData[];
};

const defaultState: State = {
  level: 0,
  scenario: 0,
  vaults: [
    {
      name: "shaun",
      equippedItems: [{ type: "grenade", name: "boom" }],
      inventory: [{ type: "grenade", name: "boom" }],
    },
  ],
};

function addItemsToUL(data: State, index: number): void {
  const vault = data.vaults[index];

  if (vault !== undefined) {
    for (const item of vault.equippedItems) {
      const ul = getElementByIdTyped<HTMLUListElement>(`equip-${item.type}-ul`);
      ul.dataset.type = item.type;
      let newLI = document.createElement("li");
      newLI.textContent = item.name;
      addRemoveBtn(newLI, data);
      ul.append(newLI);
    }

    for (const item of vault.inventory) {
      const ul = getElementByIdTyped<HTMLUListElement>(`inv-${item.type}-ul`);
      ul.dataset.type = item.type;
      let newLI = document.createElement("li");
      newLI.textContent = item.name;
      addRemoveBtn(newLI, data);
      ul.append(newLI);
    }
  }
}

function addRemoveBtn(element: HTMLLIElement, data: State): void {
  const removeBtn = document.createElement("button");
  removeBtn.textContent = "remove";
  removeBtn.id = "remove-btn";
  element.append(removeBtn);

  removeBtn.addEventListener("click", () => {
    deleteItemFromStateAndDOM(removeBtn, element, data);
  });
}

function deleteItemFromStateAndDOM(
  btnElm: HTMLButtonElement,
  elmToRemove: HTMLLIElement,
  data: State,
): void {
  const equipCon = getElementByIdTyped<HTMLDivElement>("equip-con");

  const containingDiv = btnElm.parentElement?.parentElement?.parentElement;
  const itemType = btnElm.parentElement?.parentElement?.dataset.type;
  const itemName = btnElm.parentElement?.firstChild?.textContent;

  let location = data.vaults[hunterIndex]?.[
    (equipCon.id === containingDiv?.id) ? "equippedItems" : "inventory"
  ];

  if (location === undefined) throw new Error("'location' is undefined");

  let index = location.findIndex((i) =>
    i.type === itemType && i.name === itemName
  );

  if (index !== -1) location?.splice(index, 1);

  elmToRemove.remove();
}

function updateUI(data: State, index: number): void {
  // selectVaultHunter();
  renderEquipAndInv();
  addItemsToUL(data, index);
}

let hunterIndex: number = 0;

//*================================ MAIN ================================*/

function main() {
  // const vaultState: State = JSON.parse(localStorage.getItem("vaultState")!) ||
  //   defaultState;
  const vaultState: State = defaultState;

  function saveState(): void {
    localStorage.setItem("vaultState", JSON.stringify(vaultState));
  }

  const consoleBtn = getElementByIdTyped<HTMLButtonElement>("console");
  const consoleBtn2 = getElementByIdTyped<HTMLButtonElement>("console2");
  const clearStore = getElementByIdTyped<HTMLButtonElement>("clear-storage");

  clearStore.addEventListener("click", () => localStorage.clear());

  /*================== Hunter/Valut Selection =================*/
  const hunterSelect = getElementByIdTyped<HTMLSelectElement>("char-select");
  const vaultBtns = [...document.querySelectorAll<HTMLButtonElement>(".vault")];
  const elmToEnable = [...document.querySelectorAll<HTMLElement>(".toggle")];

  // let hunterIndex: number = 0;
  let listOfSelectHunters = new Set();

  const enableActionElements = (btn: HTMLButtonElement): void => {
    for (const elm of elmToEnable) {
      elm.removeAttribute("disabled");
    }
  };

  const addInputToVaultState = (
    btn: HTMLButtonElement,
    inputElm: HTMLInputElement,
  ): void => {
    let typeElm = getElementByIdTyped<HTMLSelectElement>("item-type");
    let type = typeElm.value;
    let name = inputElm.value;
    let location = vaultState.vaults[hunterIndex]?.[
      (btn.id === "equip-btn") ? "equippedItems" : "inventory"
    ];

    if (
      ((itemType.includes as (x: unknown) => x is ItemType)(type)) &&
      (name !== undefined && name)
    ) {
      location?.push({
        type,
        name,
      });
      saveState();
      input.value = "";
    }
  };

  // Toggles buttons so only one is active at a time.
  // The active button is the selected vault button.
  for (let [index, button] of vaultBtns.entries()) {
    button.dataset.index = index.toString();

    button.addEventListener("click", function () {
      hunterIndex = parseInt(button.dataset.index!);
      button.classList.add("selected");
      button.value = "true";
      enableActionElements(button);
      updateUI(vaultState, hunterIndex);

      for (const btn of vaultBtns) {
        if (btn !== button) {
          btn.value = "false";
          btn.classList.remove("selected");
        }
      }
    });
  }

  hunterSelect.addEventListener("change", () => {
    for (const btn of vaultBtns) {
      if (btn.value === "true") {
        let selectedHunter = hunterSelect.options[hunterSelect.selectedIndex]
          ?.textContent!;

        btn.textContent = selectedHunter;

        if (vaultState.vaults) {
          vaultState.vaults[hunterIndex] = {
            name: selectedHunter,
            equippedItems: [],
            inventory: [],
          };
          saveState();
        }
      }
    }
  });

  const gearBtns = document.querySelectorAll<HTMLButtonElement>(".add-gear");
  const input = getElementByIdTyped<HTMLInputElement>("item-input");

  for (const btn of gearBtns) {
    btn.addEventListener("click", () => {
      addInputToVaultState(btn, input);
      updateUI(vaultState, hunterIndex);
    });
  }

  /*============================================================*/

  consoleBtn.addEventListener("click", () => {
    // renderEquipAndInv();
  });

  consoleBtn2.addEventListener("click", () => {
    console.log(vaultState.vaults[hunterIndex]);
  });

  /*========================================================================*/
}
main();
