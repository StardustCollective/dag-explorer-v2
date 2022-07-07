const path = require('path');
const fs = require('fs');

const { Command } = require('commander');
const dotenv = require('dotenv');

const defineEnv = (envs) => {
  let finalEnv = {};
  for (const env of envs) {
    const envFilePath = path.resolve(process.cwd(), `.env.${env}`);
    const parsedEnv = dotenv.parse(fs.readFileSync(envFilePath));
    finalEnv = Object.assign(finalEnv, parsedEnv);
  }

  const envContent = Object.entries(finalEnv).map(([key, value]) => `${key}=${value}`);

  fs.writeFileSync(path.resolve(process.cwd(), '.env'), envContent.join('\n'));
  console.log(`Using ${envs.join('+')} envs`);
};

const program = new Command();
program.argument('<envs...>');
program.action(defineEnv);
program.parse();
