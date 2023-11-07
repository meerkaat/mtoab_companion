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

function renderEquipAndInv(): void {
  const main = getElementByIdTyped<HTMLDivElement>("main");

  const html = `
  <div id="equip-con">
    <label for="equip-item-input">
      <select id="equip-item-type" autocomplete="off">
        <option value="weapons">Weapon</option>
        <option value="grenades">Grenade</option>
        <option value="shields">Shield</option>
        <option value="misc">Misc</option>
      </select>
    </label>
    <input type="text" id="equip-item-input" placeholder="Input Gear">
    <button id="equip-item">Add item</button>
    <button id="inv-add-item">Add item</button>
    <h2>Equipped Gear</h2>
    <p id="weapons">Weapons</p>
    <ul id="equip-weapons-ul">
    </ul>
    <p id="grenades">Grenades</p>
    <ul id="equip-grenades-ul">
    </ul>
    <p id="shields">Shields</p>
    <ul id="equip-shields-ul">
    </ul>
    <p id="misc">Misc.</p>
    <ul id="equip-misc-ul">
    </ul>
  </div>

  <div id="inventory-con">
    <h2>Inventory</h2>
    <p class="inventory" id="weapons-inv">Weapons</p>
    <ul id="inv-weapons-ul">
    </ul>
    <p class="inventory" id="grenades-inv">Grenades</p>
    <ul id="inv-grenades-ul">
    </ul>
    <p class="inventory" id="shields-inv">Shields</p>
    <ul id="inv-shields-ul">
    </ul>
    <p class="inventory" id="misc-inv">Misc.</p>
    <ul id="inv-misc-ul">
    </ul>
  </div>`;

  main.innerHTML = html;
}

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
  // const hunterSelect = getElementByIdTyped<HTMLSelectElement>("char-select");

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

  /*============================================================*/

  consoleBtn.addEventListener("click", () => {
    renderEquipAndInv()
  });

  // consoleBtn2.addEventListener(
  //   "click",
  //   () => {
  //     updateUI();
  //   },
  // );

  /*========================================================================*/

  function updateUI(): void {
    renderEquipAndInv();
  }
}

main();
