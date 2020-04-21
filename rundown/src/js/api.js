const twitch = window.Twitch.ext;

export const api = (endpoint, method, token, callback, data) => {
  fetch(`${EBS_BASE_URL}${endpoint}`, {
    'method': method.toUpperCase(),
    headers: new Headers({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    }),
    body: data,
  }).then(
    response => response.json()
  ).then((json) => {
    callback(json)
  }).catch((error) => {
    console.log(error)
    twitch.rig.log(JSON.stringify(error))
  })
}
