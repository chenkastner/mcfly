// var path = require('path');

// const file_name: string = "mcfly";
// const path_to_file: string = path.join(__dirname, '')
export type CommandEntry = {
  id: string,
  command: string,
  category: string,
  description: string,
  weight: number
}

export const getCategorized = (all: any) => {
  const categorized = [];
  for (var i = 0; i < all.length; i++) {
    var command = all[i];
    var obj: any = Object.assign({}, command);
    delete obj.category;
    if (command.category in categorized) {
      categorized[command.category].push(obj);
    } else {
      categorized[command.category] = [obj];
    }
  }
  return categorized;
};

const sortByCommon = (all: any) => {
  all.sort(function (a: any, b: any) {
    return b.weight.localeCompare(a.weight);
  });
};

export const searchResults = (all: CommandEntry[], value: string) => {
  var fits = all.filter((entry: CommandEntry) => {
    console.log(entry);
    const regex = new RegExp(`${value}`, 'gi');
    return entry.command.match(regex) || entry.description.match(regex);
  });
  return fits;
}

// export const addCommand = (command: CommandEntry) => {


// }

// export const createCommandsFileIfNotExist = () => {
//     //check if file exist
//     if(fs.existsSync(filename)){
//       //process if file exist
//     }
//     else{
//       console.log("File doesn\'t exist.Creating new file")
//       fs.writeFile(filename,'',(err)=>{
//         if(err)
//         console.log(err);
//       })
//     }

// }

// const all = require('../../assets/temp.json');
// console.log("all:" + JSON.stringify(all));
// const cat = getCategorized(all);
// const comm = sortByCommon(all);
