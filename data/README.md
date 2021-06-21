# Frequently Asked Questions (FAQs) Data

This folder contains Jupyter Notebooks to collect FAQ data from the following sources:
* [WHO](https://www.who.int/emergencies/diseases/novel-coronavirus-2019/question-and-answers-hub) - `scrape_who_qna_data.ipynb`
* [CDC](https://www.cdc.gov/coronavirus/2019-ncov/faq.html) - `scrape_qna_cdc_data.ipynb`
* [FDA](https://www.fda.gov/emergency-preparedness-and-response/coronavirus-disease-2019-covid-19/covid-19-frequently-asked-questions) - `scrape_qna_fda_data.ipynb`

The generated data was saved to the `./data/qna/*.json` folder and they are used by the Server scripts in the `./server` folder