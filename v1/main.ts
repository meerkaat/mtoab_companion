// I have no idea how the Borderlands inventory works
// so I'm not sure what these data structures should look like…
// 🔥🔥🔥🔥🔥🔥🚿🚒 *Me dealing with the heat*

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
      name: "",
      equippedItems: [],
      inventory: [],
    },
  ],
};

function assert(expr: unknown, msg?: string): asserts expr {
  if (!expr) throw new Error(msg);
}

function getElementByIdTyped<T extends HTMLElement>(
  selector: string,
  msg = `Element '${selector}' not found`,
): T {
  const element = document.getElementById(selector);
  if (!element) throw new Error(msg);
  return element as T;
}

// function loadState(): State {
//   return vaultState;
// }

//*================================ MAIN ================================*/

function main() {
  const vaultState: State = JSON.parse(localStorage.getItem("vaultState")!) ||
    defaultState;

  function saveState(): void {
    localStorage.setItem("vaultState", JSON.stringify(vaultState));
  }

  const consoleBtn = getElementByIdTyped<HTMLButtonElement>("console");
  const consoleBtn2 = getElementByIdTyped<HTMLButtonElement>("console2");

  /*================== Hunter/Valut Selection =================*/

  const vaultBtns = [...document.querySelectorAll<HTMLButtonElement>(".vault")];
  const hunterSelect = getElementByIdTyped<HTMLSelectElement>("char-select");

  let hunterIndex: number;
  let selectedVaultBtn: HTMLButtonElement;
  let listOfSelectHunters = new Set();

  // Toggles buttons so only one is active at a time.
  // The active button is the selected vault button.
  vaultBtns.forEach((button, index) => {
    button.dataset.index = index.toString();
  });

  vaultBtns.forEach((button) => {
    // button.dataset.index = index.toString();

    button.addEventListener("click", function () {
      hunterIndex = parseInt(button.dataset.index!);
      selectedVaultBtn = button;
      button.classList.add("selected");
      button.value = "true";

      vaultBtns.forEach((btn) => {
        if (btn !== button) {
          btn.value = "false";
          btn.classList.remove("selected");
        }
      });
      updateUI();
    });
  });

  consoleBtn.addEventListener("click", () => {
    console.log(vaultState);
  });

  // Adds selected hunter to active vault button.
  // Creates/updates hunter on `vaultState.vaults[hunterIndex]` object.
  hunterSelect.addEventListener("change", () => {
    for (const btn of vaultBtns) {
      if (btn.value === "true") {
        btn.textContent = hunterSelect.value;
        listOfSelectHunters.add(hunterSelect.value);

        vaultState.vaults[hunterIndex] = {
          name: hunterSelect.value,
          equippedItems: [],
          inventory: [],
        };

        for (const o of hunterSelect.options) {
          if (listOfSelectHunters.has(o.value)) {
            o.setAttribute("disabled", "true");
          }
        }

        saveState();
      }
    }
  });
  /*============================================================*/

  consoleBtn2.addEventListener(
    "click",
    () => {
      updateUI();
    },
  );

  /*================== Level/Scenario Counters =================*/

  const levelElm = getElementByIdTyped<HTMLParagraphElement>("level");
  const sceneElm = getElementByIdTyped<HTMLParagraphElement>("scenario");
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
  [levelDecrease, levelIncrease, sceneDecrease, sceneIncrease].forEach(
    (elm) => {
      elm.addEventListener("click", () => {
        if (vaultState.level !== 0 && elm === levelDecrease) {
          vaultState.level--;
          levelElm.textContent = `Level: ${vaultState.level.toString()}`;
          saveState();
        }
        if (vaultState.level >= 0 && elm === levelIncrease) {
          vaultState.level++;
          levelElm.textContent = `Level: ${vaultState.level.toString()}`;
          saveState();
        }
        if (vaultState.scenario !== 0 && elm === sceneDecrease) {
          vaultState.scenario--;
          sceneElm.textContent = `Scenario: ${vaultState.scenario.toString()}`;
          saveState();
        }
        if (vaultState.scenario >= 0 && elm === sceneIncrease) {
          vaultState.scenario++;
          sceneElm.textContent = `Scenario: ${vaultState.scenario.toString()}`;
          saveState();
        }
      });
    },
  );
  /*============================================================*

  /*=========================== Inputs =========================*/

  const input = getElementByIdTyped<HTMLInputElement>("equip-item-input");
  const inputType = getElementByIdTyped<HTMLSelectElement>("equip-item-type");
  const equipItemBtn = getElementByIdTyped<HTMLButtonElement>("equip-item");
  const invAddBtn = getElementByIdTyped<HTMLButtonElement>("inv-add-item");
  const clearStore = getElementByIdTyped<HTMLButtonElement>("clear-storage");

  clearStore.addEventListener("click", () => localStorage.clear());

  // const addRemoveBtn = (): void => {
  // };

  const isItemType = (x: unknown): x is ItemType =>
    itemType.includes(x as ItemType);

  // Creates/updates ULs and `vaultState` properties `equippedItems` and `inventory`
  // via input element or `removeBtn`s.
  const addInputToUL = (
    typeElm: HTMLSelectElement,
    inputElm: HTMLInputElement,
    btnElm: HTMLButtonElement,
  ): void => {
    let newLI = document.createElement("li");
    let removeBtn = document.createElement("button");
    removeBtn.className = "remove-btn";
    removeBtn.textContent = "remove";

    let ul;
    let saveToEquipOrInv;
    const vault = vaultState.vaults[hunterIndex];

    if (vault !== undefined) {
      if (btnElm.id === "equip-item") {
        ul = getElementByIdTyped<HTMLUListElement>(`equip-${typeElm.value}-ul`);
        ul.dataset.type = `${typeElm.value}`;
        saveToEquipOrInv = vault.equippedItems;
      } else {
        ul = getElementByIdTyped<HTMLUListElement>(`inv-${typeElm.value}-ul`);
        ul.dataset.type = `${typeElm.value}`;
        saveToEquipOrInv = vault.inventory;
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

          saveState();
        }
      }
    }

    inputElm.value = "";

    removeBtn.addEventListener("click", (e) => {
      if (e.target instanceof HTMLButtonElement) {
        const equipContainer = getElementByIdTyped<HTMLDivElement>(
          "equip-con",
        );

        let itemToDelete = e.target.parentElement?.firstChild?.textContent;
        let containingDiv = e.target.parentElement?.parentElement
          ?.parentElement;
        let type = e.target.parentElement?.parentElement?.dataset.type;

        // let location = (containingDiv?.id === equipContainer.id)
        //   ? vaultState.vaults[hunterIndex].equippedItems
        //   : vaultState.vaults[hunterIndex].inventory;

        let location = vaultState.vaults[hunterIndex]?.[
          (containingDiv?.id === equipContainer.id)
            ? "equippedItems"
            : "inventory"
        ];

        if (location === undefined) throw new Error("'location' is undefined");
        if (type === undefined) throw new Error("'data-type' does not exist");
        if ((itemToDelete === undefined) || (itemToDelete === null)) {
          throw new Error("'itemToDelete' is undefined");
        }

        let index = location.findIndex((i) =>
          i.type === type && i.name === itemToDelete
        );

        if (index !== -1) location.splice(index, 1);

        saveState();

        newLI.remove();
      }
    });
  };

  equipItemBtn.addEventListener("click", () => {
    addInputToUL(inputType, input, equipItemBtn);
  });

  invAddBtn.addEventListener("click", () => {
    addInputToUL(inputType, input, invAddBtn);
  });
  /*========================================================================*/

  const updateUI = (): void => {
    levelElm.textContent = vaultState.level.toString();
    sceneElm.textContent = vaultState.scenario.toString();

    let newLI = document.createElement("li");
    let removeBtn = document.createElement("button");
    removeBtn.className = "remove-btn";
    removeBtn.textContent = "remove";

    const vault = vaultState.vaults[hunterIndex];

    // for (let index = 0; index < vaultBtns.length; index++) {
    // vaultBtns[index].textContent = vaultState.vaults[index].name!;

    if (vault !== undefined) {
      for (const item of vault.equippedItems) {
        let ul = getElementByIdTyped<HTMLUListElement>(
          `equip-${item.type}-ul`,
        );
        newLI.textContent = item.name;
        newLI.append(removeBtn);
        newLI.append(ul);
      }

      for (const item of vault.inventory) {
        let ul = getElementByIdTyped<HTMLUListElement>(
          `inv-${item.type}-ul`,
        );
        newLI.textContent = item.name;
        newLI.append(removeBtn);
        newLI.append(ul);
      }
    }
    // }
  };
}

main();
