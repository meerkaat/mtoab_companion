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

type ItemType =
  // | "grenade"
  | "mod"
  // | "shield"
  | "weapon_backpack"
  | "weapon_equipped";

type Item = {
  type: ItemType;
  name: string;
};

type VaultData = {
  name: string;
  items: Item[];
  // items: {
  //   equippedWeapons: string[];
  //   grenades: string[];
  //   charMod: string[];
  // };
};

type State = {
  level: number;
  scenario: number;
  vaults: VaultData[];
};

function getElementByIdOrThrow<T extends HTMLElement>(
  selector: string,
  msg = `Element '${selector}' not found`,
): T {
  const element = document.getElementById(selector);
  if (!element) throw new Error(msg);
  return element as T;
}

function main() {
  const addBtn = getElementByIdOrThrow<HTMLButtonElement>("add-item");
  const itemInput = getElementByIdOrThrow<HTMLInputElement>("item-input");
  const selector = getElementByIdOrThrow<HTMLSelectElement>("item-type");
  const equipped = getElementByIdOrThrow<HTMLParagraphElement>("weapons");

  const orderedList = document.createElement("ol");

  const itemToParagraphMap = {};

  const addItemInputToInventory = (element: HTMLParagraphElement): void => {
    let text = itemInput.value;
    const listItem = document.createElement("li");
    listItem.textContent = text;
    orderedList.append(listItem);
    element.append(orderedList);
  };

  addBtn.addEventListener("click", () => {
    let type = selector.value;
    console.log(type);
    addItemInputToInventory(type);
  });
}

main();
