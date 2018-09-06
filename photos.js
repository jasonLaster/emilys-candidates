var Xray = require('x-ray');
var x = Xray();
var fs = require('fs')

// const candidates = require("./candidates.json")

function getId(url) {
  const parts = url.split('/')
  return parts[parts.length-1]
}

function write(path, data) {
  fs.writeFileSync(path, JSON.stringify(data, null, 2))
}

async function getCandidates() {
  const response = await x('https://www.emilyslist.org/candidates/gallery/house/', '.grid__item.candidate', [{
    name: '.candidate__name',
    img: '.candidate__photo@src',
    location: '.candidate__details',
    link: '.candidate__link--bordered@href'
  }])

  return response.map(candidate => ({
    ...candidate,
    id: getId(candidate.link)
  }))
}

async function getCandidate() {

  const response = x('https://www.emilyslist.org/candidates/cindy-axne/', '.candidate-page', [{
    summary: ['.banner__text li'],
    bio: ['article p'],
    donate: '#candidate-donate-2 a@href',
    facebook: '.ss-facebook@href',
    twitter: '.ss-twitter@href'
  }])

  return response;
}
// const candidates = require("./candidates")

//
// candidates.forEach(c => {
//   const img = c.match(/https:\/\/www.emilyslist.org\/i\/(images\/)?(.*)\.png/)
//   const name = img[2]
//   console.log(`curl ${c} > ${name}.png`)
// })

async function main() {
  const candidates = await getCandidates()
  write("./candidates.json", candidates)
  // console.log(candidates)

  const full = {}
  for (const candidate of candidates) {
    const response = await getCandidate(candidate.location)
    // write(`candidates/${candidate.id}.json`, response)
    full[candidate.id] = {...candidate, ...response[0]};
  }

  write("./candidates-full.json", full);
}

// getCandidate()
main()
