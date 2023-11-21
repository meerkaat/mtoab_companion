import { getElementByIdTyped } from "./utilities.js";

export function renderEquipAndInv(): void {
  const equipCon = getElementByIdTyped<HTMLDivElement>("equip-con");
  const invCon = getElementByIdTyped<HTMLDivElement>("inventory-con");

  const equipHTML = `
    <h2 class="headers">Equipped Gear</h2>
    <h3 id="weapon">Weapons</h3>
    <ul id="equip-weapon-ul">
    </ul>
    <h3 id="grenade">Grenades</h3>
    <ul id="equip-grenade-ul">
    </ul>
    <h3 id="shield">Shields</h3>
    <ul id="equip-shield-ul">
    </ul>
    <h3 id="misc">Misc.</h3>
    <ul id="equip-misc-ul">
    </ul>
    `;

  const invHTML = `
    <h2 class="headers">Inventory</h2>
    <h3 class="inventory" id="weapon-inv">Weapons</h3>
    <ul id="inv-weapon-ul">
    </ul>
    <h3 class="inventory" id="grenade-inv">Grenades</h3>
    <ul id="inv-grenade-ul">
    </ul>
    <h3 class="inventory" id="shield-inv">Shields</h3>
    <ul id="inv-shield-ul">
    </ul>
    <h3 class="inventory" id="misc-inv">Misc.</h3>
    <ul id="inv-misc-ul">
    </ul>
  `;

  equipCon.innerHTML = equipHTML;
  invCon.innerHTML = invHTML;
}
