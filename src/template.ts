import { getElementByIdTyped } from "./utilities.js";

export function renderEquipAndInv(): void {
  const main = getElementByIdTyped<HTMLDivElement>("main");

  const html = `
  <div id="equip-con">
    <h2>Equipped Gear</h2>
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
  </div>

  <div id="inventory-con">
    <h2>Inventory</h2>
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
  </div>
  `;

  main.innerHTML = html;
}
