const { spawn } = require('node:child_process');

const log = {
  console,
  info(v) { log.console.info(v); },
  error(v) { log.console.error(v); },
};

class Executor {
  constructor(commands) {
    this.commands = commands;
    this.commandIndex = 0;
    this.hasError = false;
  }

  get currentCommand() {
    if (this.isFinished()) {
      throw new Error('it is finished');
    }
    const command = this.commands[this.commandIndex];
    this.commandIndex += 1;
    return command;
  }

  isFinished() {
    return this.commands.length <= this.commandIndex;
  }

  exec() {
    const [label, command, args] = this.currentCommand;
    log.info(label);
    this.addEvents(spawn(command, args, { stdio: 'inherit' }));
  }

  addEvents(proc) {
    proc.on('exit', (code) => {
      if (code === 0) { return; }
      this.hasError = true;
      log.error(`Error code: ${code}`);
    });
    proc.on('error', (data) => {
      log.error('Occured error');
      log.error(data);
      this.hasError = true;
    });
    proc.on('close', () => {
      this.callback();
    });
  }

  callback() {
    if (this.isFinished()) {
      log.info('Finished.');
      return;
    }
    if (this.hasError) {
      log.error('Close by error.');
      return;
    }
    this.exec();
  }
}

const npm = `npm${/^win/.test(process.platform) ? '.cmd' : ''}`;

new Executor([
  ['# Install packages', npm, ['install']],
  ['# Start application', npm, ['start']],
]).exec();
