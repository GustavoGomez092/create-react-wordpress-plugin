import chalk from 'chalk'
import execa from 'execa'
import fs from 'fs'
import gitignore from 'gitignore'
import Listr from 'listr'
import ncp from 'ncp'
import path from 'path'
import { projectInstall } from 'pkg-install'
import license from 'spdx-license-list/licenses/MIT'
import { promisify } from 'util'

const access = promisify(fs.access)
const writeFile = promisify(fs.writeFile)
const copy = promisify(ncp)
const writeGitignore = promisify(gitignore.writeFile)

async function copyTemplateFiles (options) {
  const safeSpacedName = options.pluginName.replace(/\s/g, '_')
  const dir = path.join(options.targetDirectory, safeSpacedName)
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir)
  }
  return copy(options.templateDirectory, dir, {
    clobber: false
  })
}

async function createGitignore (options) {
  const safeSpacedName = options.pluginName.replace(/\s/g, '_')
  const dir = path.join(options.targetDirectory, safeSpacedName)
  const file = fs.createWriteStream(
    path.join(dir, '.gitignore'),
    { flags: 'a' }
  )
  return writeGitignore({
    type: 'Node',
    file: file
  })
}

async function createLicense (options) {
  const safeSpacedName = options.pluginName.replace(/\s/g, '_')
  const dir = path.join(options.targetDirectory, safeSpacedName)
  const targetPath = path.join(dir, 'LICENSE')
  const licenseContent = license.licenseText
    .replace('<year>', new Date().getFullYear())
    .replace('<copyright holders>', `${options.name} (${options.email})`)
  return writeFile(targetPath, licenseContent, 'utf8')
}

async function editFiles (options) {
  const safeSpacedName = options.pluginName.replace(/\s/g, '_')
  const dir = path.join(options.targetDirectory, safeSpacedName)
  const filePath = path.join(dir, '\\wp-react-plugin.php')
  const filePath2 = path.join(dir, '\\plugin_options.php')
  const filePath3 = path.join(dir, '\\src\\index.js')
  const filePath4 = path.join(dir, '\\public\\index.html')
  const filePath5 = path.join(dir, '\\src\\main.scss')
  const safeSpacedNameOptions = `${safeSpacedName}_options`
  const idVersionName = options.pluginName.replace(/\s/g, '-')

  // file 1
  const data1 = fs.readFileSync(filePath, 'utf-8')
  const newValue1 = data1.replace(/<RWP Plugin>/g, options.pluginName)
    .replace(/<WP_React_Plugin>/g, safeSpacedName)
    .replace(/<wp_react_plugin>/g, safeSpacedName)
    .replace(/<wp-react-plugin>/g, idVersionName)
  fs.writeFileSync(filePath, newValue1, 'utf-8')

  // file 2
  const data2 = fs.readFileSync(filePath2, 'utf-8')
  const newValue2 = data2.replace(/<WP_React_Plugin_Options>/g, safeSpacedNameOptions)
    .replace(/<wp_react_plugin_options>/g, safeSpacedNameOptions)
    .replace(/<wp-react-plugin>/g, idVersionName)
    .replace(/<WP React Plugin>/g, options.pluginName)
  fs.writeFileSync(filePath2, newValue2, 'utf-8')

  // file 3
  const data3 = fs.readFileSync(filePath3, 'utf-8')
  const newValue3 = data3.replace(/<wp-react-plugin>/g, idVersionName)
  fs.writeFileSync(filePath3, newValue3, 'utf-8')

  // file 4
  const data4 = fs.readFileSync(filePath4, 'utf-8')
  const newValue4 = data4.replace(/<wp-react-plugin>/g, idVersionName)
  fs.writeFileSync(filePath4, newValue4, 'utf-8')

  // file 5
  const data5 = fs.readFileSync(filePath5, 'utf-8')
  const newValue5 = data5.replace(/<wp-react-plugin>/g, idVersionName)
  fs.writeFileSync(filePath5, newValue5, 'utf-8')
}

async function initGit (options) {
  const safeSpacedName = options.pluginName.replace(/\s/g, '_')
  const dir = path.join(options.targetDirectory, safeSpacedName)
  const result = await execa('git', ['init'], {
    cwd: dir
  })
  if (result.failed) {
    return Promise.reject(new Error('Failed to initialize git'))
  }
}

export async function createProject (options) {
  options = {
    ...options,
    targetDirectory: options.targetDirectory || process.cwd(),
    email: 'gustavogomez092@gmail.com',
    name: 'Gustavo Gomez'
  }

  const fullPathName = new URL(import.meta.url).pathname
  const templateDir = path.resolve(
    fullPathName.substr(fullPathName.indexOf('/')),
    '../../templates/javascript'
  ).replace('C:\\', '')
  options.templateDirectory = templateDir

  try {
    await access(templateDir, fs.constants.R_OK)
  } catch (err) {
    console.error('%s Invalid template name', chalk.red.bold('ERROR'))
    process.exit(1)
  }

  const tasks = new Listr(
    [
      {
        title: 'Copy project files',
        task: () => copyTemplateFiles(options)
      },
      {
        title: 'Editing class names and selectors',
        task: () => editFiles(options)
      },
      {
        title: 'Create gitignore',
        task: () => createGitignore(options)
      },
      {
        title: 'Create License',
        task: () => createLicense(options)
      },
      {
        title: 'Initialize git',
        task: () => initGit(options),
        enabled: () => options.git
      },
      {
        title: 'Install dependencies',
        task: () =>
          projectInstall({
            cwd: path.join(options.targetDirectory, options.pluginName.replace(/\s/g, '_'))
          })
      }
    ],
    {
      exitOnError: false
    }
  )

  await tasks.run()
  console.log('project initialized')
  console.log(`cd ${options.pluginName.replace(/\s/g, '_')}`)
  console.log('%s npm run dev for Development', chalk.green.bold('NPM'))
  console.log('%s npm run prod for packing your plugin', chalk.green.bold('NPM'))
  console.log('%s Enjoy', chalk.green.bold('DONE'))
  return true
}
