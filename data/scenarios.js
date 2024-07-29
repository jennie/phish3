export default [
  {
    id: 1,
    cards: [
      {
        id: 1,
        type: "story",
        order: 1,
        text: "TUTORIAL PLACE HOLDER: You're the only one at the lounge this morning. You can't wait until The Pond reopens for morning coffee!",
        trustLabel: "Enjoy the quiet\u2026",
        distrustLabel: "Enjoy the quiet!",
        "Is Flipped": false,
        image: "/images/8-1.png",
      },
      {
        id: 1,
        type: "story",
        order: 2,
        text: "Beejou enters anxiously: Ah! Oh! I'm so glad you're here!",
        trustLabel: "Did something happen?",
        distrustLabel: "Hey Beejou!",
        "Is Flipped": false,
        image: "/images/8-2.png",
      },
      {
        id: 1,
        type: "story",
        order: 3,
        text: "I just got an email that says Security Team Alpha detected suspicious activity using my student ID!",
        trustLabel: "Oh no\u2026",
        distrustLabel: "Go Back",
        "Is Flipped": false,
        image: "/images/8-2.png",
      },
      {
        id: 1,
        type: "story",
        order: 4,
        text: "They're gonna lock my account if I don't verify my identity...That can't be good.",
        trustLabel: "\u2026verify?",
        distrustLabel: "Go Back",
        "Is Flipped": false,
        image: "/images/8-3.png",
      },
      {
        id: 1,
        type: "story",
        order: 5,
        text: "I'm me, the one and only Beejou! Could you watch my things while I go and sort this out?",
        trustLabel: "Let me take a look\u2026",
        distrustLabel: "Go Back",
        "Is Flipped": false,
        image: "/images/8-3.png",
      },
      {
        id: 1,
        type: "story",
        order: 6,
        text: "The first thing we're going to look at is the header.",
        trustLabel: "Let's keep reading\u2026",
        distrustLabel: "Back",
        "Is Flipped": false,
        image: "/images/8-4.png",
      },
      {
        id: 1,
        type: "story",
        order: 7,
        text: "Next, we're going to look at the email's body.",
        trustLabel: "Keep looking\u2026",
        distrustLabel: "Back",
        "Is Flipped": false,
        image: "/images/8-5.png",
      },
      {
        id: 1,
        type: "story",
        order: 8,
        text: "Finally, we're going to look at the email's call to action and signature.",
        trustLabel: "Hmm\u2026",
        distrustLabel: "Hmm\u2026",
        "Is Flipped": false,
        image: "/images/8-6.png",
      },
      {
        id: 1,
        type: "decision",
        order: 9,
        text: "TUTORIAL PLACE HOLDER: Is this email legit?",
        trustLabel: "Looks like the real deal!",
        distrustLabel: "Something's not right!",
        "Is Flipped": false,
        image: "/images/8-6.png",
        overlayContent: "Information about decision 1",

        trustChoice: {
          consequences: {
            trust: -10,
            security: -15,
            gooseInfiltration: 10,
          },
          feedback:
            "It asks for 3 different forms of ID! Beejou heads to the library to scan her cards and you make sure her things don't move an inch while she's gone.",
        },
        distrustChoice: {
          consequences: {
            trust: 5,
            security: 10,
            gooseInfiltration: -5,
          },
          feedback:
            "It wants 3 different forms of ID! You warn Beejou that this is likely a scam. She's relieved because she actually was acting a little suspicious, but only cause she wanted to surprise you with a fresh donut from Do or Donut.",
        },
      },
      {
        id: 1,
        type: "reveal",
        order: 10,
        text: "",
        trustLabel: "I see",
        distrustLabel: "Got it",
        "Is Flipped": false,
        image: "/images/card-back.png",
        "trustChoice.consequences": "",
        "trustChoice.feedback": "",
        "distrustChoice.consequences": "",
        "distrustChoice.feedback": "",
      },
    ],
  },
  {
    id: 5,
    cards: [
      {
        id: 5,
        type: "story",
        order: 1,
        text: "One of the best features of Reel Polytechnic's campus is their Pond cafeteria",
        trustLabel: "Who else has a Pond?!",
        distrustLabel: "Go back",
        "Is Flipped": false,
        image: "/images/5-1.png",
      },
      {
        id: 5,
        type: "story",
        order: 2,
        text: "You read all about it in the brochure, so you're excited to experience the Advanced Salad Bar",
        trustLabel: "Yummy toppings!",
        distrustLabel: "Go back",
        "Is Flipped": false,
        image: "/images/5-2.png",
      },
      {
        id: 5,
        type: "story",
        order: 3,
        text: "But you're dismayed to see it's Closed for Beautification!",
        trustLabel: "Oh no\u2026",
        distrustLabel: "Go back",
        "Is Flipped": false,
        image: "/images/5-3.png",
      },
      {
        id: 5,
        type: "story",
        order: 4,
        text: "What does that even mean? You check the college website to find out.",
        trustLabel: "beautification?",
        distrustLabel: "Go back",
        "Is Flipped": false,
        image: "/images/5-4.png",
      },
      {
        id: 5,
        type: "story",
        order: 5,
        text: "You head to the Reel Polytechnic website.",
        trustLabel: "Okay\u2026",
        distrustLabel: "Go back",
        "Is Flipped": false,
        image: "/images/5-5.png",
      },
      {
        id: 5,
        type: "story",
        order: 6,
        text: "There's a blog about it! Let's read on...",
        trustLabel: "Keep looking\u2026",
        distrustLabel: "Back",
        "Is Flipped": false,
        image: "/images/5-6.png",
      },
      {
        id: 5,
        type: "decision",
        order: 7,
        text: "Is this a trusted source for this information?",
        trustLabel: "Guess I'll wait!",
        distrustLabel: "I don't believe it!",
        "Is Flipped": false,
        image: "/images/5-6.png",
        trustChoice: {
          consequences: {
            trust: -10,
            security: -15,
            gooseInfiltration: 10,
          },
          feedback:
            "Sounds like you'll have to go somewhere else for Advanced Salad options, but the new features sound great.",
        },
        distrustChoice: {
          consequences: {
            trust: 5,
            security: 10,
            gooseInfiltration: -5,
          },
          feedback:
            "Unfortunately the doors are locked. Looks like you better be looking for refreshments elsewhere. With features like these, this will take months to complete.",
        },
      },
      {
        id: 5,
        type: "reveal",
        order: 8,
        text: "",
        trustLabel: "I see",
        distrustLabel: "Got it",
        "Is Flipped": false,
        image: "/images/card-back.png",
        "trustChoice.consequences": "",
        "trustChoice.feedback": "",
        "distrustChoice.consequences": "",
        "distrustChoice.feedback": "",
      },
    ],
  },
  {
    id: 6,
    cards: [
      {
        id: 6,
        type: "story",
        order: 1,
        text: "You're enjoying your morning outside, daydreaming about your next visit to The Pond when it reopens.",
        trustLabel: "Relax and wait...",
        distrustLabel: "Go back",
        "Is Flipped": false,
        image: "/images/6-1.png",
      },
      {
        id: 6,
        type: "story",
        order: 2,
        text: "Beejou flies in, buzzing: Did you see the posters? We're hosting a Four-Armed Basketball tournament!",
        trustLabel: "Tell me more!",
        distrustLabel: "Go back",
        "Is Flipped": false,
        image: "/images/6-2.png",
      },
      {
        id: 6,
        type: "story",
        order: 3,
        text: "We have to go! I used to play, back in the day, you know!",
        trustLabel: "Of course!",
        distrustLabel: "Go back",
        "Is Flipped": false,
        image: "/images/6-3.png",
      },
      {
        id: 6,
        type: "story",
        order: 4,
        text: "But there's a problem... I tried to get tickets, and my card isn't working!",
        trustLabel: "Oh no...",
        distrustLabel: "Go back",
        "Is Flipped": false,
        image: "/images/6-4.png",
      },
      {
        id: 6,
        type: "story",
        order: 5,
        text: "Can you help me get them? Please, I don't want to miss this!",
        trustLabel: "Let me check it out...",
        distrustLabel: "Go back",
        "Is Flipped": false,
        image: "/images/6-4.png",
      },
      {
        id: 6,
        type: "story",
        order: 6,
        text: "Beejou sends you the website and you open it up on your phone.",
        trustLabel: "Okay\u2026",
        distrustLabel: "Back",
        "Is Flipped": false,
        image: "/images/6-5.png",
      },
      {
        id: 6,
        type: "story",
        order: 7,
        text: "Let's take a look at this webpage",
        trustLabel: "Keep looking\u2026",
        distrustLabel: "Back",
        "Is Flipped": "",
        image: "/images/6-5.png",
      },
      {
        id: 6,
        type: "decision",
        order: 8,
        text: "Do you buy the tickets?",
        trustLabel: "Gotta see the game!",
        distrustLabel: "I don't like this...",
        "Is Flipped": false,
        image: "/images/card-placeholder.png",
        trustChoice: {
          consequences: {
            trust: -10,
            security: -25,
            gooseInfiltration: 10,
          },
          feedback:
            "You check out and are promised the hand delivery. You're advised to stay on campus, otherwise they wont be able to find you, but no one ever arrives.",
        },
        distrustChoice: {
          consequences: {
            trust: 5,
            security: 10,
            gooseInfiltration: -5,
          },
          feedback:
            "Beejou discovers that you can just get tickets at a table by the gym and she says she'll get you a ticket as thanks since you helped her out.",
        },
      },
      {
        id: 6,
        type: "reveal",
        order: 9,
        text: "",
        trustLabel: "I see",
        distrustLabel: "Got it",
        "Is Flipped": false,
        image: "/images/card-back.png",
        "trustChoice.consequences": "",
        "trustChoice.feedback": "",
        "distrustChoice.consequences": "",
        "distrustChoice.feedback": "",
      },
    ],
  },
  {
    id: 7,
    cards: [
      {
        id: 7,
        type: "story",
        order: 1,
        text: "You're sitting out on the grass, sipping your coffee and catching up on some reading.",
        trustLabel: "Enjoy the moment...",
        distrustLabel: "Go back",
        "Is Flipped": false,
        image: "/images/card-placeholder.png",
      },
      {
        id: 7,
        type: "story",
        order: 2,
        text: "Beejou calls you: Guess what! Beeyonce is coming to campus!!",
        trustLabel: "Really?",
        distrustLabel: "Go back",
        "Is Flipped": false,
        image: "/images/card-placeholder.png",
      },
      {
        id: 7,
        type: "story",
        order: 3,
        text: "I just got an email from my Beeyonce fan community with an exclusive link to buy tickets before they go on sale to the public!",
        trustLabel: "Sounds awesome!",
        distrustLabel: "Go back",
        "Is Flipped": false,
        image: "/images/card-placeholder.png",
      },
      {
        id: 7,
        type: "story",
        order: 4,
        text: "I'm so excited, but also a little nervous...",
        trustLabel: "Why's that?",
        distrustLabel: "Go back",
        "Is Flipped": false,
        image: "/images/card-placeholder.png",
      },
      {
        id: 7,
        type: "story",
        order: 5,
        text: "It opens a link that asks for my student ID and credit card info. Do you think it's ok?",
        trustLabel: "Let's look together.",
        distrustLabel: "Go back",
        "Is Flipped": false,
        image: "/images/card-placeholder.png",
      },
      {
        id: 7,
        type: "story",
        order: 6,
        text: "Take a look at the URL",
        trustLabel: "Okay...",
        distrustLabel: "Back",
        "Is Flipped": false,
        image: "/images/card-placeholder.png",
      },
      {
        id: 7,
        type: "story",
        order: 7,
        text: "Next, we're going to look at the webpage.",
        trustLabel: "Keep looking\u2026",
        distrustLabel: "Back",
        "Is Flipped": "",
        image: "/images/card-placeholder.png",
      },
      {
        id: 7,
        type: "decision",
        order: 8,
        text: "Should Beejou trust the site?",
        trustLabel: "Yes! Let's get tickets!",
        distrustLabel: "Maybe we shouldn't.",
        "Is Flipped": false,
        image: "/images/card-placeholder.png",
        trustChoice: {
          consequences: {
            trust: -10,
            security: -15,
            gooseInfiltration: 10,
          },
          feedback:
            "You and Beejou get front row tickets. Beejou's so excited, she says she wont sleep for weeks.",
        },
        distrustChoice: {
          consequences: {
            trust: 5,
            security: 10,
            gooseInfiltration: -5,
          },
          feedback:
            "Sounds worrying so you decide not to go but you can't help but wonder if concert will be one of those life changing, world altering one that everyone won't stop talking about for weeks.",
        },
      },
      {
        id: 7,
        type: "reveal",
        order: 9,
        text: "",
        trustLabel: "I see",
        distrustLabel: "Got it",
        "Is Flipped": false,
        image: "/images/card-back.png",
        "trustChoice.consequences": "",
        "trustChoice.feedback": "",
        "distrustChoice.consequences": "",
        "distrustChoice.feedback": "",
      },
    ],
  },
  {
    id: 8,
    cards: [
      {
        id: 8,
        type: "story",
        order: 1,
        text: "You're the only one at the lounge this morning. You can't wait until The Pond reopens for morning coffee!",
        trustLabel: "Enjoy the quiet\u2026",
        distrustLabel: "Enjoy the quiet!",
        "Is Flipped": false,
        image: "/images/8-1.png",
      },
      {
        id: 8,
        type: "story",
        order: 2,
        text: "Beejou enters anxiously: Ah! Oh! I'm so glad you're here!",
        trustLabel: "Did something happen?",
        distrustLabel: "Hey Beejou!",
        "Is Flipped": false,
        image: "/images/8-2.png",
      },
      {
        id: 8,
        type: "story",
        order: 3,
        text: "I just got an email that says Security Team Alpha detected suspicious activity using my student ID!",
        trustLabel: "Oh no\u2026",
        distrustLabel: "Go Back",
        "Is Flipped": false,
        image: "/images/8-2.png",
      },
      {
        id: 8,
        type: "story",
        order: 4,
        text: "They're gonna lock my account if I don't verify my identity...That can't be good.",
        trustLabel: "\u2026verify?",
        distrustLabel: "Go Back",
        "Is Flipped": false,
        image: "/images/8-3.png",
      },
      {
        id: 8,
        type: "story",
        order: 5,
        text: "I'm me, the one and only Beejou! Could you watch my things while I go and sort this out?",
        trustLabel: "Let me take a look\u2026",
        distrustLabel: "Go Back",
        "Is Flipped": false,
        image: "/images/8-3.png",
      },
      {
        id: 8,
        type: "story",
        order: 6,
        text: "The first thing we're going to look at is the header.",
        trustLabel: "Let's keep reading\u2026",
        distrustLabel: "Back",
        "Is Flipped": false,
        image: "/images/8-4.png",
      },
      {
        id: 8,
        type: "story",
        order: 7,
        text: "Next, we're going to look at the email's body.",
        trustLabel: "Keep looking\u2026",
        distrustLabel: "Back",
        "Is Flipped": false,
        image: "/images/8-5.png",
      },
      {
        id: 8,
        type: "story",
        order: 8,
        text: "Finally, we're going to look at the email's call to action and signature.",
        trustLabel: "Hmm\u2026",
        distrustLabel: "Hmm\u2026",
        "Is Flipped": false,
        image: "/images/8-6.png",
      },
      {
        id: 8,
        type: "decision",
        order: 9,
        text: "Is this email legit?",
        trustLabel: "Looks like the real deal!",
        distrustLabel: "Something's not right!",
        "Is Flipped": false,
        image: "/images/8-6.png",
        trustChoice: {
          consequences: {
            trust: -10,
            security: -15,
            gooseInfiltration: 10,
          },
          feedback:
            "It asks for 3 different forms of ID! Beejou heads to the library to scan her cards and you make sure her things don't move an inch while she's gone.",
        },
        distrustChoice: {
          consequences: {
            trust: 5,
            security: 10,
            gooseInfiltration: -5,
          },
          feedback:
            "It wants 3 different forms of ID! You warn Beejou that this is likely a scam. She's relieved because she actually was acting a little suspicious, but only cause she wanted to surprise you with a fresh donut from Do or Donut.",
        },
      },
      {
        id: 8,
        type: "reveal",
        order: 10,
        text: "",
        trustLabel: "I see",
        distrustLabel: "Got it",
        "Is Flipped": false,
        image: "/images/card-back.png",
        "trustChoice.consequences": "",
        "trustChoice.feedback": "",
        "distrustChoice.consequences": "",
        "distrustChoice.feedback": "",
      },
    ],
  },
  {
    id: 9,
    cards: [
      {
        id: 9,
        type: "story",
        order: 1,
        text: "You're checking your email in between power naps at the campus library.",
        trustLabel: "It's so quiet\u2026",
        distrustLabel: "Go back",
        "Is Flipped": false,
        image: "/images/9-1.png",
      },
      {
        id: 9,
        type: "story",
        order: 2,
        text: "There's an offer to access a plentitude of ebooks and textbooks!",
        trustLabel: "I love ebooks!",
        distrustLabel: "Go back",
        "Is Flipped": false,
        image: "/images/9-2.png",
      },
      {
        id: 9,
        type: "story",
        order: 3,
        text: "It sounds like it could be a good deal...",
        trustLabel: "Check it out!",
        distrustLabel: "Go back",
        "Is Flipped": false,
        image: "/images/9-2b.png",
      },
      {
        id: 9,
        type: "story",
        order: 4,
        text: "First, who's sending this to me.",
        trustLabel: "Let's see...",
        distrustLabel: "Go back",
        "Is Flipped": false,
        image: "/images/9-3.png",
      },
      {
        id: 9,
        type: "story",
        order: 5,
        text: "Let's examine the body of the email.",
        trustLabel: "Seems interesting.",
        distrustLabel: "Back",
        "Is Flipped": "",
        image: "/images/9-4.png",
      },
      {
        id: 9,
        type: "story",
        order: 6,
        text: "Finally, let's look at the offer and the signature.",
        trustLabel: "Sounds appealing...",
        distrustLabel: "Back",
        "Is Flipped": "",
        image: "/images/9-5.png",
      },
      {
        id: 9,
        type: "decision",
        order: 7,
        text: "Do you trust this offer?",
        trustLabel: "I want books!",
        distrustLabel: "This isn't right!",
        "Is Flipped": false,
        image: "/images/9-5.png",
        trustChoice: {
          consequences: {
            trust: -10,
            security: -15,
            gooseInfiltration: 10,
          },
          feedback:
            "It's worrying when you crack open the dusty .pdf of 'Key Study Habits for Sucess.' It's just a single paged document listing out 3 study habits: 1. Studie with TV on. 2. Pcrorastinate until the last minnit. 3. Skip brekfast.",
        },
        distrustChoice: {
          consequences: {
            trust: 5,
            security: 10,
            gooseInfiltration: -5,
          },
          feedback:
            "You report it as a phishing attempt and are thanked for your report. You worry you'll have to find 10,000's of books elsewhere, but you remember you can go to the library!",
        },
      },
      {
        id: 9,
        type: "reveal",
        order: 8,
        text: "",
        trustLabel: "I see",
        distrustLabel: "Got it",
        "Is Flipped": false,
        image: "/images/card-back.png",
        "trustChoice.consequences": "",
        "trustChoice.feedback": "",
        "distrustChoice.consequences": "",
        "distrustChoice.feedback": "",
      },
    ],
  },
  {
    id: 10,
    cards: [
      {
        id: 10,
        type: "story",
        order: 1,
        text: "You're working late in the study lounge getting some last minute things done before you go home.",
        trustLabel: "Gotta finish...",
        distrustLabel: "Go back",
        "Is Flipped": false,
        image: "/images/card-placeholder.png",
      },
      {
        id: 10,
        type: "story",
        order: 2,
        text: "You get an email asking you participate in an official college survey about student life.",
        trustLabel: "I have opinions...",
        distrustLabel: "Go back",
        "Is Flipped": false,
        image: "/images/card-placeholder.png",
      },
      {
        id: 10,
        type: "story",
        order: 3,
        text: "You've gotten three of these this week!",
        trustLabel: "No inbox space!",
        distrustLabel: "Go back",
        "Is Flipped": false,
        image: "/images/card-placeholder.png",
      },
      {
        id: 10,
        type: "story",
        order: 4,
        text: "I guess it could be worth it to check out.",
        trustLabel: "Let's see about this\u2026",
        distrustLabel: "Go back",
        "Is Flipped": false,
        image: "/images/card-placeholder.png",
      },
      {
        id: 10,
        type: "story",
        order: 5,
        text: "Let's start by examining the email's header.",
        trustLabel: "Let's keep reading\u2026",
        distrustLabel: "Go back",
        "Is Flipped": false,
        image: "/images/card-placeholder.png",
      },
      {
        id: 10,
        type: "story",
        order: 6,
        text: "Next up, we'll focus on the email's message.",
        trustLabel: "Keep looking\u2026",
        distrustLabel: "Back",
        "Is Flipped": false,
        image: "/images/card-placeholder.png",
      },
      {
        id: 10,
        type: "story",
        order: 7,
        text: "Finally, let's look at the email's call to action and signature.",
        trustLabel: "Hmm\u2026",
        distrustLabel: "Go back.",
        "Is Flipped": "",
        image: "/images/card-placeholder.png",
      },
      {
        id: 10,
        type: "decision",
        order: 8,
        text: "Is this email legit?",
        trustLabel: "Give my feedback!",
        distrustLabel: "They want my thoughts?",
        "Is Flipped": false,
        image: "/images/card-placeholder.png",
        trustChoice: {
          consequences: {
            trust: -10,
            security: -15,
            gooseInfiltration: 10,
          },
          feedback:
            "You get a sweet $10 campus store gift card, and a follow up email gives you two more to share with your friends, or get two really small mugs.",
        },
        distrustChoice: {
          consequences: {
            trust: 5,
            security: 10,
            gooseInfiltration: -5,
          },
          feedback:
            "You receive an email thanking you for your vigilance in identifying phishing scams, but remember, phishing emails often request sensitive information, which Reel Polytechnic will never do!",
        },
      },
      {
        id: 10,
        type: "reveal",
        order: 9,
        text: "",
        trustLabel: "I see",
        distrustLabel: "Got it",
        "Is Flipped": false,
        image: "/images/card-back.png",
        "trustChoice.consequences": "",
        "trustChoice.feedback": "",
        "distrustChoice.consequences": "",
        "distrustChoice.feedback": "",
      },
    ],
  },
  {
    id: 11,
    cards: [
      {
        id: 11,
        type: "story",
        order: 1,
        text: "Your computer's going into red alert mode!!! There's a flashing software update message for BugBuster Antivirus!",
        trustLabel: "Check the message...",
        distrustLabel: "Go back",
        "Is Flipped": false,
        image: "/images/card-placeholder.png",
      },
      {
        id: 11,
        type: "story",
        order: 2,
        text: "You're unsure whether to trust it.",
        trustLabel: "Call for help?",
        distrustLabel: "Go back",
        "Is Flipped": false,
        image: "/images/card-placeholder.png",
      },
      {
        id: 11,
        type: "story",
        order: 3,
        text: "You call the IT service desk for help. They ask you to meet them at The Pond, where they're busy angling the phish.",
        trustLabel: "Head to The Pond.",
        distrustLabel: "Go back",
        "Is Flipped": false,
        image: "/images/card-placeholder.png",
      },
      {
        id: 11,
        type: "story",
        order: 4,
        text: "One of them looks up and says: Hey there! Let's see what's going on with your computer.",
        trustLabel: "Explain the issue.",
        distrustLabel: "Go back",
        "Is Flipped": false,
        image: "/images/card-placeholder.png",
      },
      {
        id: 11,
        type: "story",
        order: 5,
        text: "Ah, yes! They mentioned this update was talked about on BugBuster's blog.",
        trustLabel: "Tell me more.",
        distrustLabel: "Go back",
        "Is Flipped": false,
        image: "/images/card-placeholder.png",
      },
      {
        id: 11,
        type: "story",
        order: 6,
        text: "It says this update fixes a security bug. It's important to install it for your safety.",
        trustLabel: "Lemmie think...",
        distrustLabel: "Back",
        "Is Flipped": false,
        image: "/images/card-placeholder.png",
      },
      {
        id: 11,
        type: "decision",
        order: 7,
        text: "Is this update legit?",
        trustLabel: "Looks like the real deal!",
        distrustLabel: "Something's not right!",
        "Is Flipped": false,
        image: "/images/card-placeholder.png",
        trustChoice: {
          consequences: {
            trust: -10,
            security: -15,
            gooseInfiltration: 10,
          },
          feedback:
            "You decide to trust their advice and install the update. You feel secure knowing your system is protected.",
        },
        distrustChoice: {
          consequences: {
            trust: 5,
            security: 10,
            gooseInfiltration: -5,
          },
          feedback:
            "Sure, it sounds critical, but it can't actually be that critical. It can wait!",
        },
      },
      {
        id: 11,
        type: "reveal",
        order: 8,
        text: "",
        trustLabel: "I see",
        distrustLabel: "Got it",
        "Is Flipped": false,
        image: "/images/card-back.png",
        "trustChoice.consequences": "",
        "trustChoice.feedback": "",
        "distrustChoice.consequences": "",
        "distrustChoice.feedback": "",
      },
    ],
  },
  {
    id: 12,
    cards: [
      {
        id: 12,
        type: "story",
        order: 1,
        text: "You're researching at the library and get a frantic text from Beejou.",
        trustLabel: "What's happening?",
        distrustLabel: "Go back",
        "Is Flipped": false,
        image: "/images/card-placeholder.png",
      },
      {
        id: 12,
        type: "story",
        order: 2,
        text: "Beejou: AAA DONT CLIKC FOR FREE FLOPWERS!!!",
        trustLabel: "What??",
        distrustLabel: "Go back",
        "Is Flipped": false,
        image: "/images/card-placeholder.png",
      },
      {
        id: 12,
        type: "story",
        order: 3,
        text: "You rush to find Beejou. She looks desperate and worried about her computer.",
        trustLabel: "What's wrong?",
        distrustLabel: "Go back",
        "Is Flipped": false,
        image: "/images/card-placeholder.png",
      },
      {
        id: 12,
        type: "story",
        order: 4,
        text: "All I did was click a link to get free flowers and now my computer's locked!",
        trustLabel: "Let's get help!",
        distrustLabel: "Go back",
        "Is Flipped": false,
        image: "/images/card-placeholder.png",
      },
      {
        id: 12,
        type: "story",
        order: 5,
        text: "You take Beejou to the IT service team to check over her computer. They're catching phish, but they're happy to help.",
        trustLabel: "Explain the situation.",
        distrustLabel: "Go back",
        "Is Flipped": false,
        image: "/images/card-placeholder.png",
      },
      {
        id: 12,
        type: "story",
        order: 6,
        text: "(beaver 1): Oh my, this looks like ransomware!",
        trustLabel: "What can we do?",
        distrustLabel: "Back",
        "Is Flipped": false,
        image: "/images/card-placeholder.png",
      },
      {
        id: 12,
        type: "story",
        order: 7,
        text: "(beaver 2): We can try to fix it, but Beejou you need to be careful with suspicious emails.",
        trustLabel: "Thank you!",
        distrustLabel: "Back",
        "Is Flipped": false,
        image: "/images/card-placeholder.png",
      },
      {
        id: 12,
        type: "story",
        order: 8,
        text: "As they work on Beejou's computer, you receive a notification. It's the same email!",
        trustLabel: "Show them.",
        distrustLabel: "Back",
        "Is Flipped": false,
        image: "/images/card-placeholder.png",
      },
      {
        id: 12,
        type: "story",
        order: 9,
        text: "(beaver 2): Since you're already here, let's walk through it together.",
        trustLabel: "Read the email.",
        distrustLabel: "Back",
        "Is Flipped": false,
        image: "/images/card-placeholder.png",
      },
      {
        id: 12,
        type: "story",
        order: 10,
        text: "Hmm. Now, let's look at the body.",
        trustLabel: "Okay...",
        distrustLabel: "Back",
        "Is Flipped": false,
        image: "/images/card-placeholder.png",
      },
      {
        id: 12,
        type: "story",
        order: 11,
        text: "I can see how Beejou was fooled.",
        trustLabel: "Me too...",
        distrustLabel: "Back",
        "Is Flipped": false,
        image: "/images/card-placeholder.png",
      },
      {
        id: 12,
        type: "decision",
        order: 12,
        text: "What do you think about this offer?",
        trustLabel: "It could be legit..",
        distrustLabel: "So suspicious!",
        "Is Flipped": false,
        image: "/images/card-placeholder.png",
        trustChoice: {
          consequences: {
            trust: -10,
            security: -15,
            gooseInfiltration: 10,
          },
          feedback:
            "Ahh! I know flowers are tempting but you should be wary about offers that sounds too good to be true.",
        },
        distrustChoice: {
          consequences: {
            trust: 5,
            security: 10,
            gooseInfiltration: -5,
          },
          feedback:
            "That's right! If an offer sounds too good to be true, it probably is!",
        },
      },
      {
        id: 12,
        type: "reveal",
        order: 13,
        text: "",
        trustLabel: "I see",
        distrustLabel: "Got it",
        "Is Flipped": false,
        image: "/images/card-back.png",
        "trustChoice.consequences": "",
        "trustChoice.feedback": "",
        "distrustChoice.consequences": "",
        "distrustChoice.feedback": "",
      },
    ],
  },
  {
    id: 13,
    cards: [
      {
        id: 13,
        type: "reveal",
        order: 0,
        text: "",
        trustLabel: "I see",
        distrustLabel: "Got it",
        "Is Flipped": false,
        image: "/images/card-back.png",
        "trustChoice.consequences": "",
        "trustChoice.feedback": "",
        "distrustChoice.consequences": "",
        "distrustChoice.feedback": "",
      },
      {
        id: 13,
        type: "story",
        order: 1,
        text: "You recently read that the Campus Cafe is trying out a new robotic coffee handler.",
        trustLabel: "Robot coffee!",
        distrustLabel: "Go back",
        "Is Flipped": false,
        image: "/images/card-placeholder.png",
      },
      {
        id: 13,
        type: "story",
        order: 2,
        text: "There's a special right now that uses AI to craft the perfect morning beverage based entirely on your mood!",
        trustLabel: "I'm curious...",
        distrustLabel: "Go back",
        "Is Flipped": false,
        image: "/images/card-placeholder.png",
      },
      {
        id: 13,
        type: "story",
        order: 3,
        text: "But, when you get your coffee, it just doesn't taste right. It doesn't seem like it's actually yours.",
        trustLabel: "I don't trust it...",
        distrustLabel: "Go back",
        "Is Flipped": false,
        image: "/images/card-placeholder.png",
      },
      {
        id: 13,
        type: "story",
        order: 4,
        text: "You call the IT support team for help. They listen to your problem.",
        trustLabel: "Hear them out.",
        distrustLabel: "Go back",
        "Is Flipped": false,
        image: "/images/card-placeholder.png",
      },
      {
        id: 13,
        type: "story",
        order: 5,
        text: "(beaver 1): Bring it to The Pond and we'll test it for you!",
        trustLabel: "Head over there.",
        distrustLabel: "Go back",
        "Is Flipped": false,
        image: "/images/card-placeholder.png",
      },
      {
        id: 13,
        type: "story",
        order: 6,
        text: "You arrive at The Pond, coffee in hand. They slap the water with their tails, looking excited.",
        trustLabel: "Hand it over.",
        distrustLabel: "Back",
        "Is Flipped": false,
        image: "/images/card-placeholder.png",
      },
      {
        id: 13,
        type: "story",
        order: 7,
        text: "(beaver 1): Let's take a look...",
        trustLabel: "Watch closely.",
        distrustLabel: "Back",
        "Is Flipped": "",
        image: "/images/card-placeholder.png",
      },
      {
        id: 13,
        type: "decision",
        order: 8,
        text: "You start to suspect that they might just be aiming to get a free drink out of you.",
        trustLabel: "Is this my mood coffee?",
        distrustLabel: "I'll take it back!",
        "Is Flipped": false,
        image: "/images/card-placeholder.png",
        trustChoice: {
          consequences: {
            trust: -10,
            security: -15,
            gooseInfiltration: 10,
          },
          feedback:
            "You watch as they all took a little sip each. It was kinda cute, so you didn't mind, but now you have to go get a new one. They thank you for your trouble.",
        },
        distrustChoice: {
          consequences: {
            trust: 5,
            security: 10,
            gooseInfiltration: -5,
          },
          feedback:
            "They just want to drink your coffee!! Even if it's wrong, you might as well drink it. You've gotta get to the gym before it closes!",
        },
      },
    ],
  },
];
