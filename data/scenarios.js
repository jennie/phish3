export default [
  {
    id: 1,
    cards: [
      {
        type: "story",
        text: "You're starting your day at Feneca College.",
        isFlipped: false,
      },
      {
        type: "story",
        text: "As you approach your laptop, you notice something unusual.",
        isFlipped: false,
      },
      {
        type: "story",
        text: "Logging into your laptop for the day, a MFA pop-up appears, asking you to input the code that appears on your phone.",
        isFlipped: false,
      },
      {
        type: "decision",
        text: "Do you trust this MFA pop-up and enter the code?",
        image: "https://swiperjs.com/demos/images/nature-1.jpg",
        trustChoice: {
          consequences: { trust: 5, security: 10 },
          feedback: "Great choice! Using MFA increases your account security.",
        },
        distrustChoice: {
          consequences: { trust: -5, security: -10 },
          feedback: "Oh no! Ignoring MFA leaves your account vulnerable.",
        },
        isFlipped: false,
      },
      {
        type: "reveal",
        text: "MFA helps protect your account from unauthorized access.",
        image: "https://swiperjs.com/demos/images/nature-1.jpg",
        isFlipped: false,
      },
    ],
  },
];
