export default [
  {
    id: 1,
    text: "Logging into your laptop for the day, a MFA pop-up appears, asking you to input the code that appears on your phone.",
    image: "https://swiperjs.com/demos/images/nature-1.jpg",
    trustChoice: {
      consequences: { trust: 5, security: 10 },
      feedback: "Great choice! Using MFA increases your account security.",
    },
    distrustChoice: {
      consequences: { trust: -5, security: -10 },
      feedback: "Oh no! Ignoring MFA leaves your account vulnerable.",
    },
  },
  {
    id: 2,
    text: "You receive an email from a colleague asking you to review a document. The email contains a link to the document.",
    image: "https://swiperjs.com/demos/images/nature-2.jpg",
    trustChoice: {
      consequences: { trust: -10, security: -15, gooseInfiltration: 10 },
      feedback:
        "Oops! This was a phishing attempt. Always verify unexpected links.",
    },
    distrustChoice: {
      consequences: { trust: 10, security: 15 },
      feedback: "Good job! You've avoided a potential phishing attempt.",
    },
  },
  {
    id: 3,
    text: "Beejou is excited about a new sports event happening on campus. She asks you to get the tickets for her because her card isn't working. The webpage looks suspicious and asks for your student ID and credit card info.",
    image: "https://swiperjs.com/demos/images/nature-3.jpg",
    trustChoice: {
      consequences: { trust: -15, security: -20, gooseInfiltration: 15 },
      feedback:
        "This was a scam! Be cautious when asked to provide sensitive information online.",
    },
    distrustChoice: {
      consequences: { trust: 10, security: 10 },
      feedback:
        "Good decision! It's best to be cautious with suspicious websites asking for personal information.",
    },
  },
  {
    id: 4,
    text: "Beejou received an email claiming that a 'Security Team' detected suspicious activity using her student account. The email warns that her account will be locked unless she verifies her identity immediately.",
    image: "https://swiperjs.com/demos/images/nature-4.jpg",
    trustChoice: {
      consequences: { trust: -10, security: -15, gooseInfiltration: 10 },
      feedback:
        "This was a phishing attempt! Always verify the source of urgent security emails.",
    },
    distrustChoice: {
      consequences: { trust: 10, security: 10 },
      feedback: "Excellent! You've correctly identified a phishing attempt.",
    },
  },
  {
    id: 5,
    text: "Beejou is excited about a discount code she's given to get 33% off Beeyonce tickets. It's given out to people in the Beeyonce fan community, but you gotta buy the tickets in full before you're reimbursed to prove you're a true Beeyonce fan.",
    image: "https://swiperjs.com/demos/images/nature-5.jpg",
    trustChoice: {
      consequences: { trust: -5, security: -10, gooseInfiltration: 5 },
      feedback:
        "Be careful! This could be a scam. Legitimate discounts don't usually require full payment first.",
    },
    distrustChoice: {
      consequences: { trust: 5, security: 5 },
      feedback:
        "Smart move! This offer seems too good to be true and could be a scam.",
    },
  },
  {
    id: 6,
    text: "You get an email offering free ebooks and textbooks. For a limited time, it's offering a special book highlighting key study habits for success. It says it's exclusively available to university students and you need to click a link to download the book.",
    image: "https://swiperjs.com/demos/images/nature-6.jpg",
    trustChoice: {
      consequences: { trust: -10, security: -15, gooseInfiltration: 10 },
      feedback:
        "This was a phishing attempt! Be wary of emails offering free things that require you to click links.",
    },
    distrustChoice: {
      consequences: { trust: 10, security: 10 },
      feedback:
        "Well done! You've correctly identified a potential phishing attempt.",
    },
  },
  {
    id: 7,
    text: "You get an email asking you to participate in an official university survey about student life and campus improvements. The email promises a campus store gift card for completing the survey.",
    image: "https://swiperjs.com/demos/images/nature-7.jpg",
    trustChoice: {
      consequences: { trust: 5, security: 5 },
      feedback:
        "Good choice! This appears to be a legitimate university survey.",
    },
    distrustChoice: {
      consequences: { trust: -5, security: 0 },
      feedback:
        "It's good to be cautious, but this seems to be a legitimate university survey. You might have missed an opportunity to contribute and get a gift card.",
    },
  },
  {
    id: 8,
    text: "A film crew is on campus asking about Feneca's history and culture. They ask to watch your equipment while you run an errand.",
    image: "https://swiperjs.com/demos/images/nature-8.jpg",
    trustChoice: {
      consequences: { trust: -10, security: -15, gooseInfiltration: 15 },
      feedback:
        "Oh no! Never leave your equipment with strangers, even if they seem official.",
    },
    distrustChoice: {
      consequences: { trust: 10, security: 10 },
      feedback:
        "Great decision! It's best not to leave your equipment with strangers, regardless of who they claim to be.",
    },
  },
  {
    id: 9,
    text: "You receive a software update pop-up on your laptop while working on campus.",
    image: "https://swiperjs.com/demos/images/nature-9.jpg",
    trustChoice: {
      consequences: { trust: 5, security: 10 },
      feedback:
        "Good choice! Keeping your software updated is important for security.",
    },
    distrustChoice: {
      consequences: { trust: 0, security: -5 },
      feedback:
        "Be careful! While it's good to be cautious, ignoring legitimate updates can leave your system vulnerable.",
    },
  },
  {
    id: 10,
    text: "A classmate asks to borrow your student ID to check out a book from the library because they forgot theirs.",
    image: "https://swiperjs.com/demos/images/nature-10.jpg",
    trustChoice: {
      consequences: { trust: -5, security: -10 },
      feedback:
        "Sharing your student ID is never a good idea, even with friends. It could lead to security issues.",
    },
    distrustChoice: {
      consequences: { trust: 5, security: 10 },
      feedback:
        "Excellent! Keeping your student ID to yourself is always the right choice.",
    },
  },
];
