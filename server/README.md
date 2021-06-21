# Server scripts

This folder includes NodeJS scripts to
* Perform server operations (aka services) - `QnAService.js`
* Generate AI models and data that are used by the server
  * `generate_models.js` - This script must be run to re-generate AI data for FAQ when new data is scraped in `./data` 
  * `generate_specialist_models.js` - This script must be run to re-generate AI data for Specialist prediction when `specialist_map.js` is updated
