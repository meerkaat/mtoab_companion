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
      equippedItems: [{ type: "weapon", name: "bfg" }],
      inventory: [{ type: "shield", name: "small" }],
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

function renderEquipAndInv(): void {
  const main = getElementByIdTyped<HTMLDivElement>("main");

  const html = `
  <div id="equip-con">
    <h2>Equipped Gear</h2>
    <p id="weapon">Weapons</p>
    <ul id="equip-weapon-ul">
    </ul>
    <p id="grenade">Grenades</p>
    <ul id="equip-grenade-ul">
    </ul>
    <p id="shield">Shields</p>
    <ul id="equip-shield-ul">
    </ul>
    <p id="misc">Misc.</p>
    <ul id="equip-misc-ul">
    </ul>
  </div>

  <div id="inventory-con">
    <h2>Inventory</h2>
    <p class="inventory" id="weapon-inv">Weapons</p>
    <ul id="inv-weapon-ul">
    </ul>
    <p class="inventory" id="grenade-inv">Grenades</p>
    <ul id="inv-grenade-ul">
    </ul>
    <p class="inventory" id="shield-inv">Shields</p>
    <ul id="inv-shield-ul">
    </ul>
    <p class="inventory" id="misc-inv">Misc.</p>
    <ul id="inv-misc-ul">
    </ul>
  </div>
  `;

  main.innerHTML = html;
}

function addItemsToUL(data: State): void {
  const vault = data.vaults[hunterIndex];

  if (vault !== undefined) {
    for (const item of vault.equippedItems) {
      const ul = getElementByIdTyped<HTMLUListElement>(`equip-${item.type}-ul`);
      ul.dataset.type = item.type;
      let newLI = document.createElement("li");
      newLI.textContent = item.name;
      addRemoveBtn(newLI);
      ul.append(newLI);
    }

    for (const item of vault.inventory) {
      const ul = getElementByIdTyped<HTMLUListElement>(`inv-${item.type}-ul`);
      ul.dataset.type = item.type;
      let newLI = document.createElement("li");
      newLI.textContent = item.name;
      addRemoveBtn(newLI);
      ul.append(newLI);
    }
  }
}

function addRemoveBtn(element: HTMLLIElement): void {
  const removeBtn = document.createElement("button");
  removeBtn.textContent = "remove";
  removeBtn.id = "remove-btn";
  element.append(removeBtn);

  removeBtn.addEventListener("click", () => {
    deleteItemFromStateAndDOM(removeBtn, element, defaultState);
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

  // let hunterIndex: number = 0;
  let selectedVaultBtn: HTMLButtonElement;
  let listOfSelectHunters = new Set();

  // Toggles buttons so only one is active at a time.
  // The active button is the selected vault button.
  for (let [index, button] of vaultBtns.entries()) {
    button.dataset.index = index.toString();

    button.addEventListener("click", function () {
      hunterIndex = parseInt(button.dataset.index!);
      selectedVaultBtn = button;
      button.classList.add("selected");
      button.value = "true";
      updateUI();

      for (const btn of vaultBtns) {
        if (btn !== button) {
          btn.value = "false";
          btn.classList.remove("selected");
        }
      }
    });
  }

  const selectVaultHunter = () => {
    let selectedHunter;

    hunterSelect.addEventListener("change", () => {
      selectedHunter = hunterSelect.options[hunterSelect.selectedIndex]
        ?.textContent!;
      let vault = vaultState.vaults[hunterIndex];
      if (vault) {
        vault.name = selectedHunter;
        saveState();
      }
    });
    return selectedHunter;
  };

  /*============================================================*/

  consoleBtn.addEventListener("click", () => {
    // renderEquipAndInv();
    addItemsToUL(defaultState);
  });

  consoleBtn2.addEventListener("click", () => {
    console.log(defaultState.vaults[hunterIndex]);
  })

  /*========================================================================*/

  function updateUI(): void {
    // selectVaultHunter();
    renderEquipAndInv();
  }
}
main();
