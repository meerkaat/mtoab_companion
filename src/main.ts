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
  | "weapon"
  | "grenade"
  | "shield"
  | "mod"
  | "misc";

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
//   vaults: [
//     {
//       name: amara,
//       equippedItems: [
//         { type: "weapon", name: "gun" },
//       ],
//       inventory: [
//         { type: "weapon", name: "gun" },
//       ],
//     },
//   ],
// };

function getElementByIdOrThrow<T extends HTMLElement>(
  selector: string,
  msg = `Element '${selector}' not found`,
): T {
  const element = document.getElementById(selector);
  if (!element) throw new Error(msg);
  return element as T;
}

//*=========================================== MAIN ===========================================*/

function main() {
  const equipItem = getElementByIdOrThrow<HTMLButtonElement>("equip-item");
  const equipItemInput = getElementByIdOrThrow<HTMLInputElement>(
    "equip-item-input",
  );
  const equipItemType = getElementByIdOrThrow<HTMLSelectElement>(
    "equip-item-type",
  );
  const equipWeapon = getElementByIdOrThrow<HTMLParagraphElement>(
    "equip-weapons-ul",
  );

  const itemToParagraphMap = {};

  const addItemToUL = (
    input: HTMLInputElement,
    type: HTMLSelectElement,
  ): void => {
    let newLI = document.createElement("li");
    let ul = (type.id === "equip-item-type")
      ? getElementByIdOrThrow<HTMLUListElement>(`equip-${type.value}-ul`)
      : getElementByIdOrThrow<HTMLUListElement>(`inv-${type.value}-ul`);

    newLI.textContent = input.value;
    ul.append(newLI);
  };

  equipItem.addEventListener("click", () => {
    addItemToUL(equipItemInput, equipItemType);
    // let x = orderedList.getElementsByTagName("li");
    // console.log(x[0].textContent);
  });
}

main();
