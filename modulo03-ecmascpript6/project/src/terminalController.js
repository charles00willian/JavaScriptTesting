import readlineModule from 'readline';
import DraftLog from 'draftlog';
import chalk from 'chalk';
import chalkTable from 'chalk-table';

import Person from './person.js';

export default class TerminalController {
  constructor({
    readline = readlineModule,
    database = []
  } = {}) {
    this.print = {};
    this.terminal = {};
    this.data = [];
    this.readline = readline;    
    this.database = database;
  }

  initializeTerminal(language) {
    DraftLog(console).addLineListener(process.stdin);
    this.terminal = this.readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    this.initializeTable(language);
  }

  initializeTable(language) {
    const data = this.database.map(item => new Person(item).formatted(language));
    const table = chalkTable(this.getTableOptions(), data);
    this.print = console.draft(table);
    this.data = data;
  }

  question(msg = '') {
    return new Promise((resolve) => this.terminal.question(msg, resolve));
  }

  updateTable(item){
    this.data.push(item);
    this.print(chalkTable(this.getTableOptions(), this.data));
  }

  closeTerminal() {
    this.terminal.close();
  }

  getTableOptions() {
    return {
      leftPad: 2,
      columns: [
        { field: "id", name: chalk.cyan('ID')},
        { field: "vehicles", name: chalk.magenta('Vehicles')},
        { field: "kmTraveled", name: chalk.green('Km Traveled')},
        { field: "from", name: chalk.redBright('From')},
        { field: "to", name: chalk.yellow('To')},
      ]
    }
  }
}

//2 Bike 1231412 2000-01-01 2001-01-01