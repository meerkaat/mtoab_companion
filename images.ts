export const vaultHunters: String[] = [];

// for await (const dirEntry of Deno.readDir("./assets")) {
//   let capNames = dirEntry.name.charAt(0).toUpperCase() +
//     dirEntry.name.slice(1);

//   vaultHunters.push(capNames.replace("Image.jpg", ""));
// }

// vaultHunters.sort();

/*========================================================================*/

// let hunterOptions;

// for (const hunter of vaultHunters) {
//   let html = `<option value="${hunter}">${hunter}</option>`;
//   hunterOptions = hunterOptions + "\n" + html;
// }

/*========================================================================*/

let html;

for await (const dirEntry of Deno.readDir("./assets")) {
  let name = dirEntry.name.replace(".jpg", "");
  let snippet = `<option value="${name}">${name}</option>`;
  html = html + "\n" + snippet;
}


console.log(html);

/* array
  [
    "Amara",    "Athena",
    "Aurelia",  "Axton",
    "Brick",    "Cl4ptp",
    "Fl4k",     "Gaige",
    "Krieg",    "Lilith",
    "Maya",     "Mordecai",
    "Moze",     "Mrtorgue",
    "Nisha",    "Roland",
    "Salvador", "Timothylawrence",
    "Tinytina", "Wilhelm",
    "Zane",     "Zero"
  ]
*/

/* html
    <option value="amara">Amara</option>
    <option value="athena">Athena</option>
    <option value="aurelia">Aurelia</option>
    <option value="axton">Axton</option>
    <option value="brick">Brick</option>
    <option value="cl4ptp">Cl4ptp</option>
    <option value="fl4k">Fl4k</option>
    <option value="gaige">Gaige</option>
    <option value="krieg">Krieg</option>
    <option value="lilith">Lilith</option>
    <option value="maya">Maya</option>
    <option value="mordecai">Mordecai</option>
    <option value="moze">Moze</option>
    <option value="mr-torgue">Mr. Torgue</option>
    <option value="nisha">Nisha</option>
    <option value="roland">Roland</option>
    <option value="salvador">Salvador</option>
    <option value="timothy-lawrence">Timothy Lawrence</option>
    <option value="tiny-tina">Tiny Tina</option>
    <option value="wilhelm">Wilhelm</option>
    <option value="zane">Zane</option>
    <option value="zero">Zero</option>
*/
