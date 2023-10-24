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
    // {
    //   name: "athena",
    //   equippedItems: [],
    //   inventory: [],
    // },
    // {
    //   name: "aurelia",
    //   equippedItems: [],
    //   inventory: [],
    // },
    // {
    //   name: "axton",
    //   equippedItems: [],
    //   inventory: [],
    // },
  ],
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

//*=========================================== MAIN ===========================================*/

function main() {
  const consoleBtn = getElementByIdOrThrow<HTMLButtonElement>("console");
  consoleBtn.addEventListener("click", () => {
    console.log("vaultState.vaults", vaultState.vaults);
  });
  let vaultBtns = [...document.querySelectorAll(".vault")];
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

  let hunterIndex: number = 0;
  let vaultStateEquip = vaultState.vaults[hunterIndex].equippedItems;
  let vaultStateInv = vaultState.vaults[hunterIndex].inventory;

  /*
  order of operations:
    - click vault button
    - select hunter from select options
    - disable selected hunter from select options
    - change button text to hunter name
    - add hunter to vault data
  currently it is the oposite of this:(
  */
  // hunterSelect.addEventListener("change", () => {
  //   // hunterIndex = hunterSelect.selectedIndex - 1;
  //   // vaultState.vaults[hunterIndex] = {...vaultState.vaults[hunterIndex], name: hunterSelect.value};
  //   vaultBtns.forEach((btn, index) => {
  //     btn.addEventListener("click", () => {
  //       if (
  //         (vaultBtns.includes as (x: unknown) => x is HTMLButtonElement)(btn)
  //       ) {
  //         btn.dataset.index = "false";
  //         if (btn.value === "false") {
  //           btn.dataset.index = index.toString();
  //           vaultState.vaults[index] = {
  //             ...vaultState.vaults[index],
  //             name: hunterSelect.value,
  //           };
  //           btn.textContent = hunterSelect.value;
  //           btn.value = "true";
  //         }
  //       }
  //     });
  //   });
  //   saveState();
  // });
  const isButtonElm = (x: unknown): x is HTMLButtonElement =>
    vaultBtns.includes(x as HTMLButtonElement);

  vaultBtns.forEach((btn) => {
    btn.addEventListener("click", function () {
      if (!isButtonElm(btn)) {
        throw new Error("Element not type 'HTMLButtonElement'");
      }

      if (btn.value) {
        btn.classList.add("selected");
        vaultBtns.map((item) => {
          if (!isButtonElm(item)) {
            throw new Error("Element not type 'HTMLButtonElement'");
          }

          if (item !== btn) {
            item.value = "false";
            item.classList.remove("selected");
          }
        });
      }
    });
  });

  vaultBtns.forEach((btn, index) => {
    if (!(vaultBtns.includes as (x: unknown) => x is HTMLButtonElement)(btn)) {
      throw new Error("Element is not 'btn element'");
    }
    btn.value = "false";
    btn.dataset.index = index.toString();
  });

  // hunterSelect.addEventListener("change", () => {
  //   vaultBtns.forEach((btn) => {
  //     if (document.activeElement === btn) {
  //       console.log(document.activeElement);
  //     }
  //   })
  // })

  // for (let i = 0; i < vaultBtns.length; i++) {
  //   const selectedBtn = getElementByIdOrThrow<HTMLButtonElement>(`vault${i}`);
  //   selectedBtn.addEventListener("click", () => {
  //     vaultState.vaults.splice(i, 0, {
  //       ...vaultState.vaults[hunterIndex],
  //       name: hunterSelect.value,
  //     });
  //     console.log(vaultState.vaults);
  //     // let selectedHunter = vaultState.vaults[i];
  //     // selectedBtn.textContent = selectedHunter.name;
  //     // console.log(hunterIndex);
  //   });
  // }

  const input = getElementByIdOrThrow<HTMLInputElement>("equip-item-input");
  const inputType = getElementByIdOrThrow<HTMLSelectElement>("equip-item-type");
  const equipItemBtn = getElementByIdOrThrow<HTMLButtonElement>("equip-item");
  const invAddBtn = getElementByIdOrThrow<HTMLButtonElement>("inv-add-item");
  const clearStore = getElementByIdOrThrow<HTMLButtonElement>("clear-storage");

  clearStore.addEventListener("click", () => localStorage.clear());

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

    let newLI = document.createElement("li");
    let removeBtn = document.createElement("button");
    removeBtn.className = "remove-btn";
    removeBtn.textContent = "remove";

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

        saveState();
      }
    }

    inputElm.value = "";

    removeBtn.addEventListener("click", (e) => {
      if (e.target instanceof HTMLButtonElement) {
        const equipContainer = getElementByIdOrThrow<HTMLDivElement>(
          "equip-con",
        );

        let itemToDelete = e.target.parentElement?.firstChild?.textContent;
        let containingDiv = e.target.parentElement?.parentElement
          ?.parentElement;
        let type = e.target.parentElement?.parentElement?.dataset.type;

        // if (containingDiv?.id === equipContainer.id) location = vaultStateEquip;
        // if (containingDiv?.id === ivnContainer.id) location = vaultStateInv;
        let location = (containingDiv?.id === equipContainer.id)
          ? vaultStateEquip
          : vaultStateInv;

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
}
main();
