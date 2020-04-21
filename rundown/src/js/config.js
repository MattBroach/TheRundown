import '../sass/styles.sass'

import { api } from './api'

const twitch = window.Twitch.ext
const sections = []

let token

// form elements
const title = document.getElementById('title')
const submit = document.getElementById('submit')

const getPageData = () => {
  api('page/', 'get', token, (json) => {
    title.value = json.title

    json.sections.forEach((section) => {
      sections.push(section.type)

      switch (section.type) {
        case "about":
          makeSection(section.type, `
            <label for="about">About</label>
            <textarea id="about" rows="8">${section.text}</textarea>
          `)
          break
        case "commands":
          makeSection(section.type, `
            <label for="commands">Commands</label>
            <div id="commands">
              ${section.commands.reduce((commandString, command) => {
                return commandString + `<div class="command-group">
                  <input class="command-name" placeholder="Enter command" value=${command.command} />
                  <textarea class="command-description" rows="3">${command.description}</textarea>
                </div>`
              }, '')}
            </div>
            <button class="button outline-inward" id="add-command">Add Command</button>
          `)

          createAddCommandButton()
          break
        case "values":
          makeSection(section.type, `
            <label for="values">Values</label>
            <div id="values">
              ${section.values.reduce((valueString, value) => {
                return valueString + `
                  <textarea class="value-description" rows="3">${value.trim()}</textarea>
                `
              }, '')}
            </div>
            <button class="button outline-inward" id="add-value">Add Value</button>
          `)

          createAddValueButton()
          break
        case "rules":
          makeSection(section.type, `
            <label for="rules">Rules</label>
            <div id="rules">
              ${section.rules.reduce((ruleString, rule) => {
                return ruleString + `<div class="rule-group">
                  <textarea class="rule-description" rows="3" placeholder="Add your rule here">${rule.description}</textarea>
                  <label for="rule-check">Check?</label>
                  <input type="checkbox" class="rule-check" ${rule.check ? 'checked' : ''}>
                </div>`
              }, '')}
            </div>
            <button class="button outline-inward" id="add-rule">Add Rule</button>
          `)

          createAddRuleButton()
          break
        case "clips":
          makeSection(section.type, `
            <label for="clip1">Clips</label>
            <input type="text" class="clip" id="clip1" placeholder="Enter clip URL" value=${section.clips.clip1 ? section.clips.clip1.url : ''} />
            <input type="text" class="clip" id="clip2" placeholder="Enter clip URL" value=${section.clips.clip2 ? section.clips.clip2.url : ''}/>
          `)
          break
        case "memes":
          makeSection(section.type, `
            <label for="memes">Memes</label>
            <div id="memes">
              ${section.memes.reduce((memeString, meme) => {
                return memeString + `
                  <textarea class="meme-description" rows="3">${meme.trim()}</textarea>
                `
              }, '')}
            </div>
            <button class="button outline-inward" id="add-meme">Add Meme</button>
          `)

          createAddMemeButton()
          break
        default:
          twitch.rig.log(`"${section.type}" is not a valid section`)
        }
    })
  })
}

const getSectionData = () => sections.map(sectionName => {
  switch (sectionName) {
    case 'about':
      return {
        type: sectionName,
        text: document.getElementById('about').value,
      }
    case 'commands':
      return {
        type: sectionName,
        commands: [...document.querySelectorAll('.command-group')].filter(
          group => group.childNodes[1].value  // only save commands that actually have a command
        ).map((group) => ({
          command: group.childNodes[1].value,
          description: group.childNodes[3].value,
        }))
      }
    case 'values':
      return {
        type: sectionName,
        values: [...document.querySelectorAll('.value-description')].filter(
          description => !!description.value.trim()
        ).map(description => description.value)
      }
    case 'rules':
      return {
        type: sectionName,
        rules: [...document.querySelectorAll('.rule-group')].filter(
          group => group.childNodes[1].value  // only save rules that actually have a rule
        ).map((group) => ({
          description: group.childNodes[1].value,
          check: group.childNodes[5].checked,
        }))
      }
    case 'clips':
      return {
        type: sectionName,
        clips: {
          clip1: document.getElementById('clip1').value,
          clip2: document.getElementById('clip2').value,
        }
      }
    case 'memes':
      return {
        type: sectionName,
        memes: [...document.querySelectorAll('.meme-description')].filter(
          description => !!description.value.trim()
        ).map(description => description.value)
      }
    default:
      return {}
  }
})

const postPageData = () => {
  const data = {
    title: title.value,
    sections: getSectionData(),
  }

  twitch.rig.log(JSON.stringify(data))

  api('page/', 'patch', token, () => {}, JSON.stringify(data))
}

twitch.onAuthorized((auth) => {
  token = auth.token
  getPageData()
})

const onSubmit = (e) => {
  e.preventDefault()

  postPageData()
}
submit.addEventListener('click', onSubmit)

const removeSection = (sectionName) => (e) => {
  e.preventDefault()

  let sectionWrapper = document.getElementById(`section-${sectionName}`)
  sectionWrapper.parentNode.removeChild(sectionWrapper)
  sectionWrapper = null

  const index = sections.indexOf(sectionName)
  sections.splice(index, 1)
}

const makeSection = (sectionName, sectionString) => {
  const sectionWrapper = document.createElement('div')
  sectionWrapper.className = 'form-section'
  sectionWrapper.id = `section-${sectionName}`

  const innerSection = `
    <div class="form-section" id="section-${sectionName}">
      <hr />
      ${sectionString}
      <button class="button outline-inward" id="remove-section-${sectionName}">
        Remove Section
      </button>
    </div>
  `

  sectionWrapper.innerHTML = innerSection

  const form = document.getElementById('rundown-config')
  form.appendChild(sectionWrapper)

  const removeButton = document.getElementById(`remove-section-${sectionName}`)
  removeButton.addEventListener('click', removeSection(sectionName))
}

const createAddCommandButton = () => {
  const addCommandButton = document.getElementById('add-command')
  addCommandButton.addEventListener('click', (e) => {
    e.preventDefault()
    
    const commandsWrapper = document.getElementById('commands')
    const newCommand = document.createElement('div')
    newCommand.className = 'command-group'
    newCommand.innerHTML = `
      <input class="command-name" placeholder="Enter command" />
      <textarea class="command-description" rows="3"></textarea>
    `

    commandsWrapper.appendChild(newCommand)
  })
}

const createAddValueButton = () => {
  const addValueButton = document.getElementById('add-value')
  addValueButton.addEventListener('click', (e) => {
    e.preventDefault()
    
    const valuesWrapper = document.getElementById('values')
    const newValue = document.createElement('textarea')
    newValue.className = 'value-description'
    newValue.rows = '3'

    valuesWrapper.appendChild(newValue)
  })
}

const createAddRuleButton = () => {
  const addRuleButton = document.getElementById('add-rule')
  addRuleButton.addEventListener('click', (e) => {
    e.preventDefault()
    
    const rulesWrapper = document.getElementById('rules')
    const newRule = document.createElement('div')
    newRule.className = 'rule-group'
    newRule.innerHTML = `
      <textarea class="rule-description" rows="3" placeholder="Add your rule here"></textarea>
      <label for="rule-check">Check?</label>
      <input type="checkbox" class="rule-check">
    `

    rulesWrapper.appendChild(newRule)
  })
}

const createAddMemeButton = () => {
  const addMemeButton = document.getElementById('add-meme')
  addMemeButton.addEventListener('click', (e) => {
    e.preventDefault()
    
    const memesWrapper = document.getElementById('memes')
    const newMeme = document.createElement('textarea')
    newMeme.className = 'meme-description'
    newMeme.rows = '3'

    memesWrapper.appendChild(newMeme)
  })
}

const addSection = (e) => {
  e.preventDefault()

  const error = document.getElementById('add-error')
  error.innerHTML = ''

  if (sections.length >= 3) {
    error.innerHTML = 'You can have a maximum of three sections. Remove a section to add another.'
  } else {

    const select = document.getElementById('sections')
    const section = select.value

    if (!sections.includes(section)) {
      sections.push(section)

      switch(section) {
        case "about":
          makeSection(section, `
            <label for="about">About</label>
            <textarea id="about" rows="8"></textarea>
          `)
          break
        case "commands":
          makeSection(section, `
            <label for="commands">Commands</label>
            <div id="commands">
              <div class="command-group">
                <input class="command-name" placeholder="Enter command" />
                <textarea class="command-description" rows="3"></textarea>
              </div>
            </div>
            <button class="button outline-inward" id="add-command">Add Command</button>
          `)

          createAddCommandButton()
          break
        case "values":
          makeSection(section, `
            <label for="values">Values</label>
            <div id="values">
              <textarea class="value-description" rows="3"></textarea>
            </div>
            <button class="button outline-inward" id="add-value">Add Value</button>
          `)

          createAddValueButton()
          break
        case "rules":
          makeSection(section, `
            <label for="rules">Rules</label>
            <div id="rules">
              <div class="rule-group">
                <textarea class="rule-description" rows="3" placeholder="Add your rule here"></textarea>
                <label for="rule-check">Check?</label>
                <input type="checkbox" class="rule-check">
              </div>
            </div>
            <button class="button outline-inward" id="add-rule">Add Rule</button>
          `)

          createAddRuleButton()
          break
        case "clips":
          makeSection(section, `
            <label for="clip1">Clips</label>
            <input type="text" class="clip" id="clip1" placeholder="Enter clip URL" />
            <input type="text" class="clip" id="clip2" placeholder="Enter clip URL" />
          `)
          break
        case "memes":
          makeSection(section, `
            <label for="memes">Memes</label>
            <div id="memes">
              <textarea class="meme-description" rows="3"></textarea>
            </div>
            <button class="button outline-inward" id="add-meme">Add Meme</button>
          `)

          createAddMemeButton()
          break
        default:
          twitch.rig.log(`"${section}" is not a valid section`)
      }
    } else {
      error.innerHTML = `You have already added section "${section}."`
    }
  }
}

const sectionAddButton = document.getElementById('section-add')
sectionAddButton.addEventListener('click', addSection)
