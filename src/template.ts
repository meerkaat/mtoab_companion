import { getElementByIdTyped } from "./utilities.js";

export function renderEquipAndInv(): void {
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