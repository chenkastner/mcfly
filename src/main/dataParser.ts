var path = require('path');
const electron = require('electron');
const fs = require('fs');
const defaults_path = '../../assets/commands.json';
const userDataPath = electron.app.getPath('userData');
const file_path = path.join(userDataPath, 'mcfly.json');

export type CommandEntry = {
  id: number;
  command: string;
  category: string;
  description: string;
  weight: number;
};

export class DataParser {
  commands_json_arr : any;

  constructor(){
    this.commands_json_arr = parseDataFile(file_path);
  }

  commandExists = (command: CommandEntry): boolean => {
    this.commands_json_arr.forEach((entry: CommandEntry) => {
      if (entry.command == command.command) {
        return true;
      }
    });
    return false;
  }

  getCategorized = () => {
    const categorized: any = {};
    for (var i = 0; i < this.commands_json_arr.length; i++) {
      var command = this.commands_json_arr[i];
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

  sortByCommon = () => {
    this.commands_json_arr.sort(function (a: any, b: any) {
      return b.weight.localeCompare(a.weight);
    });
  };

  addCommand = (command: CommandEntry) => {
    if(this.commandExists(command)) return;
    this.commands_json_arr.push(command);
    fs.writeFileSync(file_path, JSON.stringify(this.commands_json_arr));
  };

  removeCommand = (command_entry: CommandEntry) => {
    if (!this.commandExists(command_entry)) return;
    let i = 0;
    for (; i < this.commands_json_arr.length; i++) {
      if (this.commands_json_arr[i].command == command_entry) {
        delete this.commands_json_arr[i];
      }
    }
    fs.writeFileSync(file_path, JSON.stringify(this.commands_json_arr));
  };

  increaseWeight = (command: string) => {
    this.commands_json_arr.forEach((entry: CommandEntry) => {
      if (entry.command == command) {
        entry.weight++;
      }
    });
    fs.writeFileSync(file_path, JSON.stringify(this.commands_json_arr));
  };
}

function parseDataFile(filePath: string){
  // We'll try/catch it in case the file doesn't exist yet, which will be the case on the first application run.
  // `fs.readFileSync` will return a JSON string which we then parse into a Javascript object
  try {
    return JSON.parse(fs.readFileSync(filePath));
  } catch (error) {
    const starter_commands = require(defaults_path);
    fs.writeFileSync(filePath, JSON.stringify(starter_commands));
    return starter_commands;
  }
};

