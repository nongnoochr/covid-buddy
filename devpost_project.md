## Inspiration
The COVID-19 pandemic has been greatly impacting every life on earth. Not only the virus is so deadly, The World Health Organization (WHO) declared an "infodemic" of incorrect information about the virus that poses risks to global health([source](https://en.wikipedia.org/wiki/COVID-19_misinformation)). According to a study published by the National Bureau of Economic Research, areas of the country exposed to television programming that downplayed the severity of the pandemic saw greater numbers of cases and deaths—because people didn’t follow public health precautions ([source](https://www.scientificamerican.com/article/covid-misinformation-is-killing-people1/)).

Combining with ongoing issues in the underserved communities with a lack of access to medical facilities and healthcare, the impact of COVID-19 to the underserved communities is greatly amplified. 

The goal of this **COVID-19 Buddy** app to help users including those in the underserved communities to get a better access to healthcare when needed with accurate information and suggestion during the COVID-19 pandemic by leverage a power of **AI** and **IQVIA's HealthCare Locator Software Developer Kit (SDK)**.

## What it does

The **COVID-19 Buddy** app is designed to be user-friendly with an easy access to the IQVIA's HealthCare Locator SDK as well as provide accurate information about COVID-19.


The app consists of 3 major components including:
* "Find Healthcare Providers" dialog
* Landing Page
* Ask Buddy Page

### "Find Healthcare Providers" dialog
The "Find Healthcare Providers" dialog is a modal dialog which consists of two main components:
1. *Quick Search*
   * This section enable a user to applie a filter to quickly search for nearby specialists in the HealthCare Locator SDK
   * A set of specialists in this QuickSearch was determined by possible health issues from COVID-19 that were identified in the collected FAQ data which are
     * Pediatrics
     * Obstetrics
     * Psychiatry

2. *HealthCare Locator SDK*
   * Leveraging a rich set of built-in features of the IQVIA's HealthCare Locator SDK to allow better access to Healthcare Providers to a user

To launch the 'Find Healthcare Providers" dialog is easy, a user can easily launch the dialog from a permanant button in the app's navigation bar or a contextual hyperlink which is provided throughout the app.

### Landing Page
The Landing Page provides a fact sheet of COVID-19. When a user visits the app, he/she will be provided with accurate, concise, and easy to consume information about COVID-19 and an easy access to the **Find Healthcare Providers** dialog and the **Ask Buddy** page.

### Ask Buddy Page
The Ask Buddy page provides 3 modes of assistance which are:
* FAQs
* Buddy
* Self-Checker

#### - FAQs

For the **FAQs** mode, a user can select a Frequently Asked Question (FAQ) that he/she would like to get answered. The FAQs data was collected from trustworthy organizations which are [WHO](https://www.who.int/emergencies/diseases/novel-coronavirus-2019/question-and-answers-hub), [CDC](https://www.cdc.gov/coronavirus/2019-ncov/faq.html), [FDA](https://www.fda.gov/emergency-preparedness-and-response/coronavirus-disease-2019-covid-19/covid-19-frequently-asked-questions).

In addition to providing a response from a selected FAQ, 
* the app also provides a suggestion to find particular specialists nearby in a map (if applicable) or default to provide a link to find HCPs nearby.
* If a type of specialist is suggested in a response, a list of nearby specialists will also be provided contextually in the same view.

#### - Buddy

For the **Buddy** mode, a user can enter any COVID-19 related question and an AI will respond with a FAQ that is the closest match to the user's question as well as provide other top FAQs that are closely related to the user's question.

Similar to the FAQs mode, the app will also provides a suggestion to find nearby HCPs for each provided FAQ in the response.

#### - Self-Checker

The **Self-Checker** mode leverages the **[CDC HealthBot](https://tools.cdc.gov/medialibrary/index.aspx#/media/id/405848)** to help *unvaccinated individuals* make decisions on when to seek testing and medical care, this chatbot is ***directly embedded in the COVID-19 BUDDY app***. If a user decides to find nearby HCPs after chatting with the CDC HealthBot, he/she can easily launch the Healthcare Locator SDK from the provided find HCPs link.

## How we built it

The **COVID-19 BUDDY app** is a fullstack app with an AI deployed at the server. There are 4 major components that are required to build this app which are:

1. FAQs collection machinery
2. AI models creation machinery
3. Server (Back-end)
4. Client (Front-end)

#### 1. FAQs Collection Machinery
The FAQs data was scraped from the [WHO](https://www.who.int/emergencies/diseases/novel-coronavirus-2019/question-and-answers-hub), [CDC](https://www.cdc.gov/coronavirus/2019-ncov/faq.html) and [FDA](https://www.fda.gov/emergency-preparedness-and-response/coronavirus-disease-2019-covid-19/covid-19-frequently-asked-questions) websites using python. The collected data was saved in a .json format to ease the next steps in the pipeline which will be implemented with JavaScript (nodejs).

Currently, there are **794 FAQs** collected and used in the COVID-19 BUDDY app.

#### 2. AI models creation machinery

The COVID-19 BUDDY app utilizes a pretrained **Universal Sentence Encoder (USE)** lite model in tensorflow.js ([link](https://github.com/tensorflow/tfjs-models)) to perform the following tasks: 
1. Find an appropriate response based on a user input in the **Ask Buddy** assistance mode (USEModel#1)
2. Suggest a type of specialist based on a user input or FAQs (USEModel#2)

To accomplish this, nodejs scripts were developed to automate tasks to
1. Clean and format the collected FAQs data to make it suitable for the server script, and save the clean data to a .json file.
2. Create embedding maps for each AI model using the FAQs and a pre-defined set of sentence-to-specialist map and save it to a .json file. These embedding maps will be used to make a suggestion for the suggested specialist in the app.

Note that this AI machinery was greatly inspired by the following demos/posts:
1. *Stadia: Creating Game AI Using Mostly English, Anna Kipnis  ([link](https://stadia.dev/intl/fr_ca/blog/creating-game-ai-using-mostly-english/))*
2. *Google: [The Mystery of the Three Bots](https://google.github.io/mysteryofthreebots/) ([github](https://github.com/google/mysteryofthreebots))*

#### 3. Server (Back-end)

Our server was developed with nodejs and Express to host the app as well as perform expensive operations in the back-end, i.e. perform the AI tasks.

The server provides 3 REST apis (GET) where the Client (Front-end) can use to retrieve data for the following tasks:
* (FAQs) Get all or a particular category of FAQ(s) data
* (FAQs) Get an answer (response) for a submitted FAQ and provide a suggested healthcare specialist
* (Buddy) Use AI to provide an answer (response) to a user question as well as provide a suggestion to a particular healthcare specialist

Note that our full stack app is server-side rendering using the built bundle of the client app.

#### 4. Client (Front-end)
Our client-side app is a Single-Page Application (SPA) and it is developed with React. The IQVIA's HealthCare Locator JavaScript SDK is completely used in the client side via cdn.

To optimize the performance of the app and make it possible to run this AI app on mobile devices, all expensive operations (i.e. AI tasks) are done in the server, and the client-side app retrieves the output data through the provided REST apis.

Specifically for the IQVIA's HealthCare Locator JavaScript SDK, the COVID-19 Buddy app utilizes both UI and Service calls features where
* The **SDK UI** is used mainly in the “Find Healthcare Providers” dialog with a QuickSearch functionality as described earlier
* The **SDK Service Calls** are made to get a list of nearby specialists if the AI suggested for a particular specialist in the response either in the FAQs or Buddy mode.

## Challenges we ran into

There are quite a few challenges I ran into while working on this project but the most challenging one is to successfully integrate the HealthCareLocatorWebSDK into my app due to multiple issues as described below

#### Issues with the HealthCareLocatorWebSDK

##### Documentation
The [Healthcare Locator documentation](https://docs.healthcarelocator.com/index.htm#t=index_1.html) is still evolving. I started going over this documentation during the beginning of this hackathon and encountered a few issues while developing this project where some of those issues were already fixed, and some of them are still open. For example,
* (Fixed) Incorrect information about the cdn's path
* Insufficient information in multiple areas.
  * There is very little information about how to programmatically customize the SDK UI or update its state
  * There is no information about a url to make a GraphQL query or a playground as well as how to to specify a subscription key to a request 

I have spent quite a lot of time doing trials and errors and digging into the source code in the SDK to get unblock. I did posted a few questions to the [Discussions forum](https://healthcareappchallenge.devpost.com/forum_topics) throughout the Hackathon period but did not receive much help until the last week of the Hackathon. Because of this, I could only start integrating more SDK features only during the last week of the Hackathon period. 

##### Free Trial Limit

At the beginning of the Hackathon period, I was playing around with the GraphQL UI to make various queries to get a better understanding of a query and available data in the database. I was encountering an issue where I could no longer make any requests because I reached a limit and the error message stated that my subscription will be blocked for 20 days (Though I was unblocked after a week but encountered a CORs issue afterward - See more details in the next section).

##### Systemic issues

In addition to the issues mentioned above, during the last 2 weeks of the hackathon period, I encountered a mysterious CORS issue where I could neither customize the prebuilt screen to searchNearMe nor make any query from my app due to a CORS issue. This turns out to be an issue that came from the quota expired issue where I came to know during the last week of the Hackathon (See more details [here](https://healthcareappchallenge.devpost.com/forum_topics/35090-cannot-make-any-query-due-to-statuscode-403-message-out-of-call-volume-quota-quota-will-be-replenished-in-19-22-26-53))

I was struggle with this error while trying to integrate the SDK to my app for a few weeks, and finally got it resolved by acquiring a new apiKey from a new account (I almost gave up on this project since I could not get the SDK to work in my app) :\


## Accomplishments that we're proud of

With all the struggles mentioned above, I (eventually) successfully integrated the HealthCare Locator JavaScript SDK to the app (Thanks to all the helps I received from the Discussions forum during the last week of the Hackathon!).  I was not only integrated the SDK UI to the app but spent the last few days of the Hackathon period to integrate the Service Calls to the app as well.

Although the Free Trial quota posed quite a few challenges while developing this app (i.e. a number of requests made must be less than 500 a day otherwise the app will experience the CORS issue and the apiKey can no longer be used), it forces me to think hard on where, when, and how to optimize a number of the request to keep my app up and running with this limitation after deployment (e.g. caching mechanism was developed, a request call was removed from a react component, etc.).

In addition to getting an opportunity to learn the Healthcare Locator SDK and sharpen my problem solving as mentioned above, this project gave me an opportunity to have hands-on experience in integrating AI in a fullstack app and deploy it for the wider audience. While developing this project, I encountered multiple hiccups in the early development phase. For example,
* The app worked well on my machine but randomly crashed when deploying it in Heroku due to memory usage and timeout issues
* The app crashed badly on a mobile device due to a use of unsupported JavaScript apis on mobiles or a large amount of memory used by the AI model

The struggles mentioned above forced me to change courses during development to find new approaches to solve problems and optimize both server and client sources, and this is such a great learning experience :)


## What we learned

In addition to what I have described in the previous session, I also learned a lot about the IQVIA's HealthCare Locator SDK and its potential to help more people to get better access to Healthcare for all!!

## What's next for Covid Buddy
* For the next step, I'd like to extract the AI models + a use of the HealthCare Locator SDK to a standalone service and open source it so other developers can leverage and extend this service to help improve access to Healthcare especially for those in the underserved communities.
* Another next step for the Covid Buddy app is to fully automate the Machine Learning pipelines. Currently, a developer needs to run a few scripts to complete multiple tasks individually (i.e. collect FAQ data, generate AI models, reformat data) before having the data ready for use by the fullstack app. Moreover, those tasks must be manually executed again once there is any changes in the data or workflow (e.g. collecting additional FAQ data will also require a developer to re-generate AI models).
   * One possible solution is to leverage a ML Ops platform like **Microsoft Azure** to help automate and accelerate the machine learning lifecycle for the app.
* Currently, I have collected around 800 FAQs and most of FAQs are very specific to the US and more FAQs data would need to be collected to better serve users who have questions in other areas or live outside the US. In addition, I'd like to share this dataset to a wider audience (e.g. Kaggle, Medium, etc.) and hope that it can help accelerate a research or AI development (NLP) in this area
* Lastly, I'd like to enhance the AI models to provide a better response by either re-train the AI models from the pretrained ones, providing more embedding data, or integrate with other novel AI models.