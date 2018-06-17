# Alexa Skill

My own Alexa skills I can use daily.
I run them using Google Cloud Functions.

## Public transportation
Supported utterances:
### Tell 'me' about bikes
Are there any available bikes at the nearby PubliBike station?

Fetch data from https://api.publibike.ch.

Sample answer:
`There are 4 E-Bikes and 6 normal bikes waiting.`

### Tell 'me' about trains
The next trains to go to Zurich HB. Trains departing within the next few minutes -and thus not reachable- are discarded.

Fetch data from https://transport.opendata.ch/docs.html API.

Sample answer:
`Next trains: in 12 minutes from platform 2, in 20 minutes from platform 3, in 31 minutes from platform 2`

### Tell 'me' about trams
The next tramways to reach Zurich Hardbrücke. Trams departing within the next few minutes -and thus not reachable- are discarded.

Fetch data from https://transport.opendata.ch/docs.html API.

Sample answer:
`Next trams: in 7 minutes, in 17 minutes, in 27 minutes`
