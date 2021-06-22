## Inspiration
The COVID-19 pandemic has greatly impact every life on earth, especially underserved communities who were significantly impacted by COVID-19 due to a lack of access to medical facilities and misleading and disinformation about COVID-19 and the vaccines. 

The goal of this **COVID-19 Buddy** app is to assist a user by providing accurate information about COVID-19 from trustworthy sources and organizations as well as leveraging AI to suggest nearby Healthcare providers (HCPs) for user based on his/her input to enable greater access to healthcare providers for all.

## What it does

The **COVID-19 Buddy** app was designed to be user-friendly and easy access to the SDK to search for HCPs near a user.

### "Find Healthcare Providers" dialog
The "Find Healthcare Providers" dialog is a modal dialog that can be easily launched either by clicking a permanant button in the app's navigation bar or a link that is provided by the buddy. 

The SDK is the main component in this dialog where a user can use it to find nearby HCPs neary him/her. In addition, a quick search option has also been added to this dialog to assist a user to find particular specialists which could help a user with COVID-19 related health issues (e.g. PEDIATRICS-Children, OBSTETRICS-Pregnancy, PSYCHIATRY-Mental Health)

### Landing Page
When a user visits the app, he/she will be provided with accurate, concise, and easy to consume information about what to do during the Pandemic and easy to find UI components to navigate to the **Find Healthcare Providers** dialog or the **Ask Buddy** page.

### Ask Buddy Page
The Ask Buddy page provides 3 modes of assistance which are:
* **FAQs**
* **Buddy**
* **Checker**

#### - FAQs
For the **FAQs** mode, a user can choose or search for a Frequently Asked Question (FAQ) that he/she is interested in. The FAQs were collected from trustworthy organizations which are WHO, CDC (US), and FDA (US).

In addition to providing a response from a selected FAQ, the app also 
* Provides a suggestion to find particular specialists nearby in a map if applicable or default to provide a link any HCP near a user.
* Provides a list of nearby specialists nearby in a response map if applicable

#### - Buddy

For the **Buddy** mode, a user can enter any questions that he/she has about COVID-19 and the app will let an AI respond with an answer from a FAQ that is closest to a user question and also provides additional responses that are closely related to a user question.

Similar to the FAQs mode, the app will also provides a suggestion to find particular specialists nearby in a map and in a response text

#### - Checker

The **Checker** mode leverages the **CDC HealthBot** which aims to help *unvaccinated individuals* to help them make decisions on when to seek testing and medical care. This chatbot is ***embedded in the COVID-19 BUDDY app*** and a user can easily launch the SDK to find the nearest HCPs after chatting with the CDC HealthBot if needed

## How we built it

The **COVID-19 BUDDY app** is a fullstack app with an AI deployed at the server and there are 4 major components that are required for this app which are:
1. FAQs collection machinery
2. AI models creation machinery
3. Server (Back-end)
4. Client (Front-end)

#### 1. FAQs Collection Machinery
The FAQs data was scraped from the WHO, CDC, and FDA websites using python and saved in a .json formatto ease next steps in the pipeline which will be implemented with JavaScript (nodejs).

Currently, there are **794 FAQs** collected and used in the COVID-19 BUDDY app.

#### 2. AI models creation machinery
The COVID-19 BUDDY app utilizes a pretrained **Universal Sentence Encoder (USE)** lite model in tensorflow.js ([link](https://github.com/tensorflow/tfjs-models)) and was greatly inspired by the following demos/posts:
1. *Stadia: Creating Game AI Using Mostly English, Anna Kipnis  ([link](https://stadia.dev/intl/fr_ca/blog/creating-game-ai-using-mostly-english/))*
2. *Google: [The Mystery of the Three Bots](https://google.github.io/mysteryofthreebots/) ([github](https://github.com/google/mysteryofthreebots))*

Specifically, a USE model is used to complete the following tasks 
1. Find an appropriate response based on a user input in the **Ask Buddy** assistance mode (USEModel#1)
2. Suggest a type of specialist based on a user input or FAQs (USEModel#2)

Node.js scripts were developed to automate tasks to
1. Clean and format the collected FAQs data to make it suitable to the server script and save it to a .json file 
2. Create embedding maps for each model using the FAQs and a pre-defined set of sentences to specialists map and save them to a .json file. These embedding maps will be used to compute a response score in our AI models.

#### 3. Server (Back-end)

Our server was developed with nodejs and Express is used to create a server.

There are 3 REST (GET) apis provided by the server where the Client (Front-end) can use to retrieve data for the following tasks which are memory intensive:
* (FAQs) Get all or a particular category of FAQ(s) data
* (FAQs) Get an answer (response) for a submitted FAQ
* (Buddy) Use AI to provide an answer (response) to a user question as well as provide a suggestion to a particular healthcare specialist

We are using a server-side rendering by rendering the built bundle of the client app.

#### 4. Client (Front-end)
The client-side of this app was developed with React and the HCLSDK is loaded to the app via cdn and the React-Route was leveraged to enable Single-Page Application (SPA).

The data required in the FAQs and Buddy modes is retrieved through REST apis provided by the server for memory intensive tasks that are not suitable to be run on a mobile device.

Specifically for the “Find Healthcare Providers” dialog, a quick search feature was implemented by programmatically searching nearby particular specialists by customizing the prebuilt screens of the SDK upon a user submission

## Challenges we ran into
There are quite a few challenges I ran into while working on this project but the most challenging one is to successfully integreate the HealthCareLocatorWebSDK into my app due to multiple issues as described below

#### Issues with the HealthCareLocatorWebSDK

##### Lack of Documentation
The current [Healthcare Locator documentation](https://docs.healthcarelocator.com/index.htm#t=index_1.html) is still evolving and either provided 
* incorrect information, e.g. 
  * incorrect path to cdn
* insufficient information
  * very little information about how to programatically customize the SDK or update its state
  * No information about a url to make a GraphQL query and how to to specify a subscription key to a request 

during the hackathon period and this required a lot of time to do trials and errors and dig into the source code in the SDK to get unblock. I did posted a few questions to the Discussion tab of the Hackathon page but most of them did not get any responses and I needed to figure out how to handle issues I was facing when integrating SDK into my app. 

##### Free Trial Limits
At the beginning of the Hackathon period, I was playing around with the GraphQL UI to make various queries to get a better understanding of a query and available data in the database and I was encountering an issue where I could no longer make any requests because I reached a limit and the error message stated that my subscription will be blocked for 20 days (Though I got unblocked after a week but encountered a CORs issue afterward).

##### Systemic issues
In addition to the issues mentioned above, during the last 2 weeks of the hackathon period, I encountered an issue where I could neither customize the prebuilt screen to searchNearMe nor make any query from my app due to a CORS issue from a request made in the underlying JavaScriptSDK provided by the cdn and there is no documentation / help for this issue from the Discussions tab in the Hackathon page, and even the provided examples in the HealthCareLocatorWebSDK in [github](https://github.com/hcl-sdk/HealthCareLocatorWebSDK) also encounters the same issue. 

I eventually got this issue resolved during the last week of the hackathon by creating a new HealthcareLocator account to get a new apiKey :\


## Accomplishments that we're proud of
Although I was unable to successfully utilize many of the WebSDK feature and integrate them into my app as planned, I got an opportunity to have this hands-on to integrate AI in a fullstack app and deploy it for a wider-use. I encountered multiple hiccups in the early phase where my application worked well on my development machine and crashes when deploying to Heroku due to memory usage and timeout issues or rendering on the app on a mobile phone due to unsupported JavaScript apis on mobiles or a large amount of memory used by the AI model and those issues forced me to change courses or find different approaches to optimize both server and client sources.

This is my first project to integrate AI in a fullstack app and I was able to successfully deploy and serve it to wider audience (not only on my local machine :) ) and I am super proud of it!

## What we learned
In addition to what described in the previous session, I also learned about the HealthcareLocator SDK and its potential to be creatively use either for commercial or help communities to get a better access to Healthcare!

## What's next for Covid Buddy
* For the next step, I'd like to enhance the Covid Buddy app to improve the UX and ease of use to 
  * Provide and suggest a list of Healthcare Providers based on user intents from the selected FAQs and input questions and include it as a part of the AI response
  * Automatically switch and query for Healthcare Providers in the SDK screen with easy to use filters
* Another next step for the Covid Buddy app is to fully automate the Machine Learning pipelines. Currently, a developer needs to run a few scripts to complete multiple tasks (Collecting FAQ data, generate AI models, reformat data) before integrating data which is a result of those tasks during development a fullstack app and deployment and those tasks must be manually executed again once there is any changes in the data or workflow (e.g. collecting additional FAQ data will also require a developer to re-generate AI models). One possible approach is to leverage a ML Ops platform like **Microsoft Azure** to help automate and accelerate the machine learning lifecycle.
* Currently, I have collected around 800 FAQs and most of FAQs are very specific to the US and more FAQs data would need to be collected to better serve users who have questions in other domains or live outside the US. In addition, I am also planning to share this dataset to a wider audience (e.g. Kaggle, Medium, etc.) and hope that it can help accelerate a research or AI development in this area (NLP);
* Lastly, I'd love to enhance the AI models to provide a more accurate and a better response and predicted suggested specialist by either training them with more data or leverage and integrate other novel AI models to solve this problem