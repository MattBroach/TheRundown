import '../sass/styles.sass'

import { api } from './api'

const twitch = window.Twitch.ext;
let token
let checkedVisited = false


/* necessary interactive elements */
const rundown = document.getElementById('rundown')
const showButton = document.getElementById('show-button')

const hideRundown = () => {
  /* hide the rundown */
  rundown.style.opacity = 0
  rundown.style.pointerEvents = 'none'

  /* display the show button */
  showButton.style.opacity = 1
}

const showRundown = () => {
  /* hide the rundown */
  rundown.style.opacity = 1
  rundown.style.pointerEvents = 'auto'

  /* display the show button */
  showButton.style.opacity = 0
}

showButton.addEventListener('click', showRundown)


const checkVisited = () => {
  api('visited/', 'get', token, (json) => {
    twitch.rig.log(JSON.stringify(json))

    if (!json.has_viewed) {
      showRundown()  
    }
  })
}

const buildSection = (sectionName, sectionContent) => `
  <div class="section">
    <div class="section-header">
      <h2>${sectionName}</h2>
    </div>
    <div class="section-content">
      ${sectionContent} 
    </div>
  </div>
`

const buildPage = (json) => {
  const sections = json.sections.reduce((sectionString, section) => {
    switch(section.type) {
      case "about":
        return sectionString + buildSection(
          'About', section.text.split('\n').filter(x => x).reduce((text, paragraph) => {
            return text + `<p>${paragraph}</p>`
          }, '')
        )
      case "commands":
        return sectionString + buildSection(
          'Commands', section.commands.reduce((commands, command) => {
            return commands + `
              <div class="icon-list">
                <div class="icon-list-icon">!</div>
                <dl class="icon-list-item">
                  <dt class="icon-list-definition">${command.command}</dt>
                  <dd class="icon-list-description">${command.description}</dd>
                </dl>
              </div>
            `
          }, '')
        )
      case "values":
        return sectionString + buildSection(
          'Values', section.values.reduce((values, value) => {
            return values + `
              <div class="icon-list">
                <div class="icon-list-icon">&#x2764;</div>
                <div class="icon-list-item-simple">
                  ${value}
                </div>
              </div>
            `
          }, '')
        )
      case "rules":
        return sectionString + buildSection(
          'Rules', section.rules.reduce((rules, rule) => {
            return rules + `
              <div class="icon-list">
                <div class="icon-list-icon">${rule.check ? '&#x2713;' : '&#x20E0;'}</div>
                <div class="icon-list-item-simple">
                  ${rule.description}
                </div>
              </div>
            `
          }, '')
        )
      case "clips":
        return sectionString + buildSection(
          'Clips', Object.values(section.clips).reduce((clips, clip) => {
            return clips + `
              <a target="_blank" class="clip-thumbnail-link outline-inward" href="${clip.url}">
                <img class="clip-thumbnail" src="${clip.thumbnail_url}" />
                <input value="${clip.url}" />
                <div></div>
              </a>
            `
          }, '')
        )
      case "memes":
        return sectionString + buildSection(
          'The Memes', section.memes.reduce((memes, meme) => {
            return memes + `
              <div class="icon-list">
                <div class="icon-list-icon">&#x263a;</div>
                <div class="icon-list-item-simple">
                  ${meme}
                </div>
              </div>
            `
          }, '')
        )
      default:
        twitch.rig.log(`"${section.type}" is not a valid section`)
        return sectionString
    }
  }, '')

  const page = `
    <div class="title"><h1>${json.title}</h1></div>
    <div class="sections">
      ${sections}
    </div>
    <div class="footer">
      <button id="watch-button" class="button outline-inward">Watch!</button>
    </div>
  `  
  rundown.innerHTML = page

  const clips = document.querySelectorAll('.clip-thumbnail-link')

  Array.from(clips).forEach((clip) => {
    clip.addEventListener('click', (e) => {
      const input = e.target.querySelector('input')

      input.style.display = 'block'
      input.select()
      document.execCommand('copy')
      input.style.display = 'none'

      const div = e.target.querySelector('div')
      div.innerHTML = ''
      div.innerHTML = '<span class="fade-out">Link Copied!</span>'
    })
  })

  const watchButton = document.getElementById('watch-button')
  watchButton.addEventListener('click', hideRundown)
}

const getPage = () => {
  api('page/', 'get', token, (json) => {
    twitch.rig.log(JSON.stringify(json))
    buildPage(json)
  })
}

twitch.onAuthorized((auth) => {
  token = auth.token

  if (!checkedVisited) {
    checkVisited()
    checkedVisited = true
  }

  getPage()
})

twitch.listen('broadcast', (target, contentType, message) => {
  twitch.rig.log(`MESSAGE: ${message}`)

  buildPage(JSON.parse(message))
})
