// Mapping of a specialist to sentences
// This mapping will be used to create an embedding from a USE model in the 
// generate_specialist_models.js script

const specialistToSentencesMap = {
    'PEDIATRICS': [
        "Can adolescents catch COVID-19?",
        "Can adolescents spread COVID-19 to other people even if they have mild or no symptoms?",
        "Since there are few known cases of adolescents getting seriously ill with COVID-19, should I go to a health facility if I develop symptoms of the disease?",
        "Can children be cared for at home if they have COVID-19?",
        "What is the incubation period for children?",
        "Should children with underlying health conditions (asthma, diabetes, obesity) return to school?",
        "What is the risk of my child becoming sick with COVID-19?",
        "What is multisystem inflammatory syndrome in children (MIS-C)?",
        "My child has an underlying medical condition. What additional steps should my family take?",
        "Should my infant or child be tested for COVID-19?",
        "Is it safe for my child to get a COVID-19 vaccine?",
        "Why should my child get vaccinated against COVID-19?",
        "Where can I find child and youth mental health services?",
        "I’m worried about my child or teenager. Where can I find help?",
    ],
    'OBSTETRICS': [
        "Can COVID-19 be passed through breastfeeding?",
        "In communities where COVID-19 is prevalent, should mothers breastfeed?",
        "Following delivery, should a baby still be immediately placed skin-to-skin and breastfed if the mother is confirmed or suspected to have COVID-19?",
        "Can women with confirmed or suspected COVID-19 breastfeed?",
        "If a mother confirmed or suspected to have COVID-19 does not have a medical face mask should she still breastfeed?",
        "I have confirmed or suspected COVID-19 and am too unwell to breastfeed my baby directly. What can I do?",
        "I had confirmed or suspected COVID-19 and was unable to breastfeed, when can I start to breastfeed again?",
        "I have confirmed or suspected COVID-19, is it safer to give my baby infant formula milk?",
        "Should pregnant and breastfeeding women living with HIV with COVID-19 and their newborns be managed differently?",
        "Could pregnant women be cared for at home if they have COVID-19?",
        "Are pregnant women at higher risk from COVID-19?",
        "I’m pregnant. How can I protect myself against COVID-19?",
        "Should pregnant women be tested for COVID-19?",
        "Can COVID-19 be passed from a woman to her unborn or newborn baby?",
        "What care should be available during pregnancy and childbirth?",
        "Do pregnant women with suspected or confirmed COVID-19 need to give birth by caesarean section?",
        "Can I touch and hold my newborn baby if I have COVID-19?",
        "If I am pregnant, can I get a COVID-19 vaccine?",
        "Can pregnant women pass COVID-19 to unborn children?",
        "Is it safe for a mother to breastfeed if she is infected with COVID-19?",
    ],
    // Mostly from: https://www.heretohelp.bc.ca/questions-and-answers
    'PSYCHIATRY': [
        "Since my parents stopped going out to work, they have been arguing with each other much more, and in some instances, I have seen one parent harm or hurt the other either verbally or physically. I don’t feel safe at home. What should I do?",
        "I feel like my future has been affected. I am not able to apply for the jobs I wanted, and now that I have a new job I find it hard to be noticed when remote working",
        "I’m worried about bullying, discrimination and stigmatization. What’s the best way to talk about what’s happening?",
        "How can I find a doctor, psychiatrist, psychologist, or counsellor?",
        "How can I see a psychiatrist?",
        "How can I see a psychologist?",
        "How can I see a counsellor?",
        "Where can I find child and youth mental health services?",
        "Where can older adults find help for mental health concerns?",
        "I’m having a hard time coping with a physical health problem. Where can I find help?",
        "An adult in my life seems ill and won’t find help. What can I do?",
        "I’m worried about my child or teenager. Where can I find help?",
        "Someone I love has been diagnosed with depression. How can I help?",
        "I’m a young person and one of my parents has a mental illness. What can I do?",
        "I have thoughts of suicide, or someone I care about is talking about suicide. What should I do?",
        "What's the difference between mental health and mental illness?",
        "I have thoughts of suicide, or someone I care about is talking about suicide. What should I do?",
        "Where can I find more information about depression?",
        "What’s the difference between anxiety and an anxiety disorder?",
        "What's the difference between anxiety and stress?",
        "What's the difference between sadness and depression?",
        "Where can I find information and help for borderline personality disorder?",
        "What happens during a counseling appointment? How do counseling appointments work now because of the coronavirus?",
    ]
};

module.exports = {
    specialistToSentencesMap
};
