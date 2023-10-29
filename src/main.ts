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
  "mods",
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

let vaultState: State = {
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

function saveState(): void {
  localStorage.setItem("vaultState", JSON.stringify(vaultState));
}

function loadState(): State {
  return vaultState;
}

//*================================ MAIN ================================*/

function main() {
  const consoleBtn = getElementByIdTyped<HTMLButtonElement>("console");
  const consoleBtn2 = getElementByIdTyped<HTMLButtonElement>("console2");

  /*================== Hunter/Valut Selection =================*/

  const vaultBtns = [...document.querySelectorAll<HTMLButtonElement>(".vault")];
  const hunterSelect = getElementByIdTyped<HTMLSelectElement>("char-select");

  let hunterIndex: number;
  // let vaultStateEquip = vaultState.vaults[hunterIndex].equippedItems;
  // let vaultStateInv = vaultState.vaults[hunterIndex].inventory;

  consoleBtn.addEventListener("click", () => {
    saveState();
  });

  // at moment makes only one btn "active" signified by background
  // color and 'value' changing to "true".
  vaultBtns.forEach((vaultBtn, index) => {
    vaultBtn.dataset.index = index.toString();

    // consoleBtn.addEventListener("click", () => {
    //   console.log(
    //     {
    //       // Name: hunterBtn,
    //       Index: vaultBtn.dataset.index,
    //       btnTxt: vaultBtn.textContent,
    //     },
    //   );
    // });

    vaultBtn.addEventListener("click", function () {
      if (vaultBtn.value) {
        vaultBtn.classList.add("selected");
        vaultBtn.value = "true";
        hunterIndex = parseInt(vaultBtn.dataset.index!);

        vaultBtns.map((btn) => {
          if (btn !== vaultBtn) {
            btn.value = "false";
            btn.classList.remove("selected");
          }
        });
      }
    });
  });

  hunterSelect.addEventListener("change", () => {
    let chosenHunter = hunterSelect.value;
    vaultBtns.forEach((btn) => {
      if (btn.value === "true") {
        btn.textContent = chosenHunter;

        vaultState.vaults[hunterIndex] = {
          name: chosenHunter,
          equippedItems: [],
          inventory: [],
        };

        // [...hunterSelect.options].map((o) => {
        //   if (o.value !== chosenHunter) o.setAttribute("disabled", "true");
        // });

        saveState();
      }
    });
  });
  /*============================================================*/

  consoleBtn2.addEventListener(
    "click",
    () => {},
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

  const isItemType = (x: unknown): x is ItemType =>
    itemType.includes(x as ItemType);

  const addInputToUL = (
    typeElm: HTMLSelectElement,
    inputElm: HTMLInputElement,
    btnElm: HTMLButtonElement,
  ): void => {
    // console.log(
    //   "after adding",
    //   "\n",
    //   "equip",
    //   vaultState.vaults[hunterIndex].equippedItems,
    //   "inv",
    //   vaultState.vaults[hunterIndex].inventory,
    // );

    let newLI = document.createElement("li");
    let removeBtn = document.createElement("button");
    removeBtn.className = "remove-btn";
    removeBtn.textContent = "remove";

    let ul;
    let saveToEquipOrInv;

    if (btnElm.id === "equip-item") {
      ul = getElementByIdTyped<HTMLUListElement>(`equip-${typeElm.value}-ul`);
      ul.dataset.type = `${typeElm.value}`;
      saveToEquipOrInv = vaultState.vaults[hunterIndex].equippedItems;
    } else {
      ul = getElementByIdTyped<HTMLUListElement>(`inv-${typeElm.value}-ul`);
      ul.dataset.type = `${typeElm.value}`;
      saveToEquipOrInv = vaultState.vaults[hunterIndex].inventory;
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

        // if (containingDiv?.id === equipContainer.id) location = vaultStateEquip;
        // if (containingDiv?.id === ivnContainer.id) location = vaultStateInv;
        let location = (containingDiv?.id === equipContainer.id)
          ? vaultState.vaults[hunterIndex].equippedItems
          : vaultState.vaults[hunterIndex].inventory;

        if (location === undefined) throw new Error("'location' is undefined");
        if (type === undefined) throw new Error("'data-type' does not exist");
        if ((itemToDelete === undefined) || (itemToDelete === null)) {
          throw new Error("'itemToDelete' is undefined");
        }

        if (isItemType(type)) {
          // let index = location.indexOf();
          let index = location.findIndex((i) =>
            i.type === type && i.name === itemToDelete
          );

          if (index !== -1) location.splice(index, 1);

          saveState();

          newLI.remove();
        } else throw new Error("taget doesn't exist");
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
}
main();
