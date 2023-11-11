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


// export function renderEquipAndInv(): void {
//   const main = getElementByIdTyped<HTMLDivElement>("main");

//   while (main.firstChild) main.firstChild.remove();

//   for (
//     const group of [
//       {
//         id: "equip-con",
//         heading: {
//           textContent: "Equipped Gear",
//         },
//         lists: [
//           {
//             heading: {
//               id: "weapon",
//               textContent: "Weapons",
//             },
//             list: {
//               id: "equip-weapon-ul",
//             },
//           },
//           {
//             heading: {
//               id: "grenade",
//               textContent: "Grenades",
//             },
//             list: {
//               id: "equip-grenade-ul",
//             },
//           },
//           {
//             heading: {
//               id: "shield",
//               textContent: "Shields",
//             },
//             list: {
//               id: "equip-shield-ul",
//             },
//           },
//           {
//             heading: {
//               id: "misc",
//               textContent: "Misc.",
//             },
//             list: {
//               id: "equip-misc-ul",
//             },
//           },
//         ],
//       },
//       {
//         id: "inventory-con",
//         heading: {
//           textContent: "Inventory",
//         },
//         lists: [
//           {
//             heading: {
//               id: "weapon-inv",
//               textContent: "Weapons",
//             },
//             list: {
//               id: "inv-weapon-ul",
//             },
//           },
//           {
//             heading: {
//               id: "grenade-inv",
//               textContent: "Grenades",
//             },
//             list: {
//               id: "inv-grenade-ul",
//             },
//           },
//           {
//             heading: {
//               id: "shield-inv",
//               textContent: "Shields",
//             },
//             list: {
//               id: "inv-shield-ul",
//             },
//           },
//           {
//             heading: {
//               id: "misc-inv",
//               textContent: "Misc.",
//             },
//             list: {
//               id: "inv-misc-ul",
//             },
//           },
//         ],
//       },
//     ]
//   ) {
//     const div = document.createElement("div");
//     div.id = group.id;
//     const h2 = document.createElement("h2");
//     h2.textContent = group.heading.textContent;
//     div.appendChild(h2);

//     for (const { heading, list } of group.lists) {
//       const h3 = document.createElement("h3");
//       h3.id = heading.id;
//       h3.textContent = heading.textContent;
//       div.appendChild(h3);
//       const ul = document.createElement("ul");
//       ul.id = list.id;
//       div.appendChild(ul);
//     }

//     main.appendChild(div);
//   }
// }
