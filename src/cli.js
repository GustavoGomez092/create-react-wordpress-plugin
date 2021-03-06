import arg from 'arg'
import inquirer from 'inquirer'
import { createProject } from './main'

function parseArgumentsIntoOptions (rawArgs) {
  const args = arg(
    {
      '--git': Boolean,
      '--install': Boolean,
      '-g': '--git',
      '-i': '--install'
    },
    {
      argv: rawArgs.slice(2)
    }
  )
  return {
    git: args['--git'] || false,
    pluginName: args._[0],
    runInstall: args['--install'] || false
  }
}

async function promptForMissingOptions (options) {
  if (options.skipPrompts) {
    return {
      ...options,
      pluginName: options.pluginName
    }
  }

  const questions = []
  if (!options.pluginName) {
    questions.push({
      type: 'input',
      name: 'pluginName',
      message: 'Enter your plugin name:',
      default: 'CRWP'
    })
  }

  if (!options.git) {
    questions.push({
      type: 'confirm',
      name: 'git',
      message: 'Should a git be initialized?',
      default: false
    })
  }

  const answers = await inquirer.prompt(questions)
  return {
    ...options,
    pluginName: options.pluginName || answers.pluginName,
    git: options.git || answers.git
  }
}

export async function cli (args) {
  let options = parseArgumentsIntoOptions(args)
  options = await promptForMissingOptions(options)
  await createProject(options)
}

// ...
