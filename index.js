// import jsonfile from "jsonfile";
// import moment from "moment";
// import simpleGit from "simple-git";
// import random from "random";

// const path = "./data.json";

// const markCommit = (x, y) => {
//   const date = moment()
//     .subtract(1, "y")
//     .add(1, "d")
//     .add(x, "w")
//     .add(y, "d")
//     .format();

//   const data = {
//     date: date,
//   };

//   jsonfile.writeFile(path, data, () => {
//     simpleGit().add([path]).commit(date, { "--date": date }).push();
//   });
// };

// const makeCommits = (n) => {
//   if(n===0) return simpleGit().push();
//   const x = random.int(0, 54);
//   const y = random.int(0, 6);
//   const date = moment().subtract(1, "y").add(1, "d").add(x, "w").add(y, "d").format();

//   const data = {
//     date: date,
//   };
//   console.log(date);
//   jsonfile.writeFile(path, data, () => {
//     simpleGit().add([path]).commit(date, { "--date": date },makeCommits.bind(this,--n));
//   });
// };

// makeCommits(100);



import fs from "fs";
import moment from "moment";
import simpleGit from "simple-git";
import random from "random";

const git = simpleGit();
const path = "./commits.json";

// Get all days from Jan 1, 2025 to today
const startDate = moment("2025-01-01");
const endDate = moment(); // today
const totalDays = endDate.diff(startDate, "days") + 1;

// Pick 150 random unique days out of totalDays
let chosenDays = new Set();
while (chosenDays.size < 150) {
  chosenDays.add(random.int(0, totalDays - 1));
}

// Convert to commit objects
const commits = [...chosenDays].map(offset => {
  return {
    date: startDate.clone().add(offset, "days").hour(12).format()
  };
});

// Save to commits.json
fs.writeFileSync(path, JSON.stringify(commits, null, 2));
console.log(`Generated ${commits.length} commit dates from Jan 2025 till now.`);

// Function to apply commits
(async () => {
  for (let c of commits) {
    const date = moment(c.date);

    // Make dummy file content change
    fs.writeFileSync("dummy.txt", date.format());

    // Commit with backdated timestamp
    await git.add(".");
    await git.commit("goGreen commit", { "--date": date.format("YYYY-MM-DDTHH:mm:ss") });

    console.log(`Committed for ${date.format("YYYY-MM-DD")}`);
  }

  // Push once at the end
  await git.push("origin", "main");
})();

