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
  currentIndex: number;
  level: number;
  scenario: number;
  vaults: VaultData[];
};

const defaultState: State = {
  currentIndex: 0,
  level: 0,
  scenario: 0,
  vaults: [
    {
      name: "(empty)",
      equippedItems: [],
      inventory: [],
    },
  ],
};

function addItemsToUL(data: VaultData): void {
  if (data !== undefined) {
    for (const item of data.equippedItems) {
      const ul = getElementByIdTyped<HTMLUListElement>(`equip-${item.type}-ul`);
      ul.dataset.type = item.type;
      let newLI = document.createElement("li");
      newLI.textContent = item.name;
      addRemoveBtn(newLI, data);
      ul.append(newLI);
    }

    for (const item of data.inventory) {
      const ul = getElementByIdTyped<HTMLUListElement>(`inv-${item.type}-ul`);
      ul.dataset.type = item.type;
      let newLI = document.createElement("li");
      newLI.textContent = item.name;
      addRemoveBtn(newLI, data);
      ul.append(newLI);
    }
  }
}

function addRemoveBtn(element: HTMLLIElement, data: VaultData): void {
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
  data: VaultData,
): void {
  const equipCon = getElementByIdTyped<HTMLDivElement>("equip-con");

  const containingDiv = btnElm.parentElement?.parentElement?.parentElement;
  const itemType = btnElm.parentElement?.parentElement?.dataset.type;
  const itemName = btnElm.parentElement?.firstChild?.textContent;

  let location = data?.[
    (equipCon.id === containingDiv?.id) ? "equippedItems" : "inventory"
  ];

  if (location === undefined) throw new Error("'location' is undefined");

  let index = location.findIndex((i) =>
    i.type === itemType && i.name === itemName
  );

  if (index !== -1) location?.splice(index, 1);

  elmToRemove.remove();
}

//*============================================================================
//*                                   MAIN
//*============================================================================

function main() {
  /*============================ temp helper btns ===========================*/

  const consoleBtn = getElementByIdTyped<HTMLButtonElement>("console");
  const consoleBtn2 = getElementByIdTyped<HTMLButtonElement>("console2");
  const clearStore = getElementByIdTyped<HTMLButtonElement>("clear-storage");
  clearStore.addEventListener("click", () => localStorage.clear());

  /*=========================================================================*/

  const vaultState: State = JSON.parse(localStorage.getItem("vaultState")!) ||
    defaultState;
  // const vaultState: State = defaultState;

  const saveState = (): void => {
    localStorage.setItem("vaultState", JSON.stringify(vaultState));
  };

  /*========================================================================*/

  const vaultBtns = [...document.querySelectorAll<HTMLButtonElement>(".vault")];
  const levelElm = getElementByIdTyped<HTMLParagraphElement>("level");
  const sceneElm = getElementByIdTyped<HTMLParagraphElement>("scenario");
  const hunterSelect = getElementByIdTyped<HTMLSelectElement>("char-select");

  const displayImage = (hunter: string): void => {
    hunter = hunter.replace(/\s+/g, "").toLowerCase();
    let newName = hunter.replace(/\.+/g, "");
    let img = document.getElementsByTagName("img")[0];

    if (img) img.src = `/assets/${newName}.jpg`;
  };

  const updateVaultBtnName = (data: State): void => {
    for (const [i, btn] of vaultBtns.entries()) {
      let vault = data.vaults[i];
      if (vault?.name !== undefined) {
        btn.textContent = vault?.name;
      }
    }
  };

  const updateLevelAndSceneCounter = (data: State): void => {
    levelElm.textContent = `Level: ${data.level.toString()}`;
    sceneElm.textContent = `Scenario: ${data.scenario.toString()}`;
  };

  const updateUI = (data: State, index: number): void => {
    // selectVaultHunter();
    let vault = data.vaults[index];
    if (vault?.name) displayImage(vault?.name);
    updateVaultBtnName(data);
    updateLevelAndSceneCounter(data);
    renderEquipAndInv();
    if (vault) addItemsToUL(vault);
  };

  /*================== Init UI =================*/

  vaultState.currentIndex = 0;
  updateUI(vaultState, vaultState.currentIndex);

  /*========================== Hunter/Vault Selection ==========================*/

  const elmsToEnable = [...document.querySelectorAll<HTMLElement>(".toggle")];
  let listOfSelectHunters = new Set();

  const enableActionElements = (btn: HTMLButtonElement): void => {
    for (const elm of elmsToEnable) {
      elm.removeAttribute("disabled");
    }
  };

  // const resetSelectOption = (btn: HTMLButtonElement):void => {
  //   if (btn.textContent === "(empty)") {
  //     hunterSelect.selectedIndex = 0;
  //   } else hunterSelect.selectedIndex = ;

  // }

  // Toggles buttons so only one is active at a time.
  // The active button is the selected vault button.
  for (let [index, button] of vaultBtns.entries()) {
    button.dataset.index = index.toString();

    button.addEventListener("click", function () {
      // hunterIndex = parseInt(button.dataset.index!);
      vaultState.currentIndex = parseInt(button.dataset.index!);
      button.classList.add("selected");
      button.value = "true";

      // resetSelectOption(button);
      enableActionElements(button);
      updateUI(vaultState, vaultState.currentIndex);

      for (const btn of vaultBtns) {
        if (btn !== button) {
          btn.value = "false";
          btn.classList.remove("selected");
        }
      }
    });
  }

  const disableSelectOptions = (): void => {
  };

  hunterSelect.addEventListener("change", () => {
    let selected = hunterSelect.options[hunterSelect.selectedIndex]
      ?.textContent;

    if (selected) displayImage(selected);

    for (const btn of vaultBtns) {
      if (btn.value === "true") {
        let selectedHunter = hunterSelect.options[hunterSelect.selectedIndex]
          ?.textContent!;

        btn.textContent = selectedHunter;

        if (vaultState.vaults) {
          vaultState.vaults[vaultState.currentIndex] = {
            name: selectedHunter,
            equippedItems: [],
            inventory: [],
          };
          saveState();
        }
      }
    }
  });

  /*======================== Level/Scenario Counters ========================*/

  const levelDecrease = getElementByIdTyped<HTMLButtonElement>(
    "level-decrease",
  );
  const levelIncrease = getElementByIdTyped<HTMLButtonElement>(
    "level-increase",
  );
  const sceneDecrease = getElementByIdTyped<HTMLButtonElement>(
    "scenario-decrease",
  );
  const sceneIncrease = getElementByIdTyped<HTMLButtonElement>(
    "scenario-increase",
  );

  // Counts for level and scenario.
  levelDecrease.addEventListener("click", () => {
    if (vaultState.level !== 0) {
      vaultState.level--;
      levelElm.textContent = `Level: ${vaultState.level.toString()}`;
      saveState();
    }
  });

  levelIncrease.addEventListener("click", () => {
    if (vaultState.level >= 0) {
      vaultState.level++;
      levelElm.textContent = `Level: ${vaultState.level.toString()}`;
      saveState();
    }
  });

  sceneDecrease.addEventListener("click", () => {
    if (vaultState.scenario !== 0) {
      vaultState.scenario--;
      sceneElm.textContent = `Scenario: ${vaultState.scenario.toString()}`;
      saveState();
    }
  });

  sceneIncrease.addEventListener("click", () => {
    if (vaultState.scenario >= 0) {
      vaultState.scenario++;
      sceneElm.textContent = `Scenario: ${vaultState.scenario.toString()}`;
      saveState();
    }
  });

  /*====================== Equipped or inventory btns ======================*/

  const addInputToVaultState = (
    btn: HTMLButtonElement,
    inputElm: HTMLInputElement,
  ): void => {
    let typeElm = getElementByIdTyped<HTMLSelectElement>("item-type");
    let type = typeElm.value;
    let name = inputElm.value;
    let location = vaultState.vaults[vaultState.currentIndex]?.[
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

  const input = getElementByIdTyped<HTMLInputElement>("item-input");
  const gearBtns = document.querySelectorAll<HTMLButtonElement>(".add-gear");
  // Determines what array input should be pushed to, ...equippedItems or ...inventory
  for (const btn of gearBtns) {
    btn.addEventListener("click", () => {
      addInputToVaultState(btn, input);
      updateUI(vaultState, vaultState.currentIndex);
    });
  }

  /*=============================================*/
  consoleBtn.addEventListener("click", () => {
    // renderEquipAndInv();
  });

  consoleBtn2.addEventListener("click", () => {
    console.log(vaultState.currentIndex);
  });
  /*=============================================*/
}
main();
