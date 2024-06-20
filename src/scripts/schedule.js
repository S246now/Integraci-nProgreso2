const cron = require('node-cron');
const { exec } = require('child_process');

cron.schedule('0 * * * *', () => {
  exec('npm run update-inventory', (err, stdout, stderr) => {
    if (err) {
      console.error(`Error executing script: ${err}`);
      return;
    }
    console.log(`stdout: ${stdout}`);
    console.error(`stderr: ${stderr}`);
  });
});
