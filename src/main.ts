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
  // /** Index of current vault */
  // current: number;
};

const defaultState: State = {
  level: 0,
  scenario: 0,
  vaults: [
    {
      name: "",
      equippedItems: [],
      inventory: [],
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
  /*============================ temp helper btns ===========================*/
  const consoleBtn = getElementByIdTyped<HTMLButtonElement>("console");
  const consoleBtn2 = getElementByIdTyped<HTMLButtonElement>("console2");
  const clearStore = getElementByIdTyped<HTMLButtonElement>("clear-storage");
  clearStore.addEventListener("click", () => localStorage.clear());
  /*=========================================================================*/

  const vaultState: State = JSON.parse(localStorage.getItem("vaultState")!) ||
    defaultState;
  // const vaultState: State = defaultState;

  function saveState(): void {
    localStorage.setItem("vaultState", JSON.stringify(vaultState));
  }

  /*=========================================================================*/

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

    function example() {
      type MaybeName = { name: string } | undefined;
      const obj = { name: "shaun" } as MaybeName;
      const name0 = obj.name;
      const name1 = obj["name"];
      const name2 = obj?.name;
      const name3 = obj?.["name"];

      vaultState.vaults[hunterIndex]?.equippedItems;
      vaultState.vaults[hunterIndex]?.["equippedItems"];

      const obj = vaultState["vaults"][hunterIndex];
      if (obj != null) {
        const key = (btn.id === "equip-btn") ? "equippedItems" : "inventory";
        return obj[key];
      } else {
        return undefined;
      }
    }

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

  const elmToEnable = [...document.querySelectorAll<HTMLElement>(".toggle")];

  const enableActionElements = (btn: HTMLButtonElement): void => {
    for (const elm of elmToEnable) {
      elm.removeAttribute("disabled");
    }
  };

  /*========================== Hunter/Vault Selection ==========================*/

  // let hunterIndex: number = 0;
  let listOfSelectHunters = new Set();
  const hunterSelect = getElementByIdTyped<HTMLSelectElement>("char-select");
  const vaultBtns = [...document.querySelectorAll<HTMLButtonElement>(".vault")];

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

  const disableSelectOptions = (): void => {
  };

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

  /*======================== Level/Scenario Counters ========================*/

  const levelElm = getElementByIdTyped<HTMLParagraphElement>("level");
  const sceneElm = getElementByIdTyped<HTMLParagraphElement>("scenario");

  type RepeatedTuple<N extends number, T, Memo extends T[] = []> =
    number extends N ? T[]
      : Memo["length"] extends N ? Memo
      : RepeatedTuple<N, T, [...Memo, T]>;

  // const levelDecrease = getElementByIdTyped<HTMLButtonElement>(
  //   "level-decrease",
  // );
  // const levelIncrease = getElementByIdTyped<HTMLButtonElement>(
  //   "level-increase",
  // );
  // const sceneDecrease = getElementByIdTyped<HTMLButtonElement>(
  //   "scenario-decrease",
  // );
  // const sceneIncrease = getElementByIdTyped<HTMLButtonElement>(
  //   "scenario-increase",
  // );

  const [levelDecrease, levelIncrease, sceneDecrease, sceneIncrease] = [
    "level-decrease",
    "level-increase",
    "scenario-decrease",
    "scenario-increase",
  ].map(
    (id) => getElementByIdTyped<HTMLButtonElement>(id),
  ) as RepeatedTuple<4, HTMLButtonElement>;

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

  // for (
  //   const { button, stateKey, amount, element, prefix } of [
  //     {
  //       button: levelDecrease,
  //       stateKey: "level",
  //       amount: -1,
  //       element: levelElm,
  //       prefix: "Level: ",
  //     },
  //     {
  //       button: levelIncrease,
  //       stateKey: "level",
  //       amount: 1,
  //       element: levelElm,
  //       prefix: "Level: ",
  //     },
  //     {
  //       button: sceneDecrease,
  //       stateKey: "scenario",
  //       amount: -1,
  //       element: sceneElm,
  //       prefix: "Scenario: ",
  //     },
  //     {
  //       button: sceneIncrease,
  //       stateKey: "scenario",
  //       amount: 1,
  //       element: sceneElm,
  //       prefix: "Scenario: ",
  //     },
  //   ] satisfies ReadonlyArray<{
  //     button: HTMLButtonElement;
  //     stateKey: "level" | "scenario";
  //     amount: 1 | -1;
  //     element: HTMLElement;
  //     prefix: string;
  //   }>
  // ) {
  //   const callback = amount > 0
  //     ? () => {
  //       if (vaultState[stateKey] >= 0) {
  //         vaultState[stateKey] += amount;
  //         element.textContent = `${prefix}${vaultState[stateKey].toString()}`;
  //         saveState();
  //       }
  //     }
  //     : () => {
  //       if (vaultState[stateKey] !== 0) {
  //         vaultState[stateKey] += amount;
  //         element.textContent = `${prefix}${vaultState[stateKey].toString()}`;
  //         saveState();
  //       }
  //     };
  //   button.addEventListener("click", callback);
  // }

  /*====================== Equipped or inventory btns ======================*/

  const gearBtns = document.querySelectorAll<HTMLButtonElement>(".add-gear");
  const input = getElementByIdTyped<HTMLInputElement>("item-input");
  // Determines what array input should be pushed to, ...equippedItems or ...inventory
  for (const btn of gearBtns) {
    btn.addEventListener("click", () => {
      addInputToVaultState(btn, input);
      updateUI(vaultState, hunterIndex);
    });
  }

  /*=============================================*/

  consoleBtn.addEventListener("click", () => {
    // renderEquipAndInv();
  });

  consoleBtn2.addEventListener("click", () => {
    console.log(vaultState.vaults[hunterIndex]);
  });

  /*=============================================*/
}
main();
