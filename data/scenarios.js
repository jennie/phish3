export default [
  {
    id: 1,
    cards: [
      {
        type: "story",
        text: "Ah! Oh! I'm so glad you're here!",
        trustLabel: "Did something happen?",
        distrustLabel: "Hey Beejou!",
        isFlipped: false,
      },
      {
        type: "story",
        text: "I just got an email that says Security Team Alpha detected suspicious activity using my student ID!",
        trustLabel: "Oh no…",
        distrustLabel: "Go Back",
        isFlipped: false,
      },
      {
        type: "story",
        text: "They're gonna lock my account if I don't verify my identity... That can't be good.",
        trustLabel: "… verify?",
        distrustLabel: "Go Back",
        isFlipped: false,
      },
      {
        type: "story",
        text: "I'm me, the one and only Beejou! Could you watch my things while I go and sort this out?",
        trustLabel: "Can I take a look at that email?",
        distrustLabel: "Go Back",
        isFlipped: false,
      },
      {
        type: "story",
        text: `Subject: Urgent: Immediate Account Verification Required!
From: security@reelcampgoos.ca
To: BeejouB@reelpolytechnic.ca

Dear Beejou,
Security Team Alpha has detected suspicious actvity for your learning account!
Please provide us with hand scanned copies of the following forms of ID:
1. Student ID card
2. Drivering license or passport
3. Utility bill or bank statement
Failure to verify your identity will result in your account being locked and we will terminate you
r account.
Click the link below to upload your documints and complete the verification process. Do not wait! Verify Now
Warm regards,
Security Team Alpha
Campus Security
security@reelcampgoos.ca`,
        trustLabel: "This looks serious",
        distrustLabel: "This seems fishy",
        isFlipped: false,
      },
      {
        type: "decision",
        text: "Do you trust this email and help Beejou verify her identity?",
        trustLabel: "Trust",
        distrustLabel: "Distrust",
        trustChoice: {
          consequences: { trust: -10, security: -15, gooseInfiltration: 10 },
          feedback:
            "It asks for 3 different and scanned forms of ID! Beejou heads to the library to scan her cards and you make sure her things don't move an inch while she's gone.",
        },
        distrustChoice: {
          consequences: { trust: 5, security: 10, gooseInfiltration: -5 },
          feedback:
            "It wants 3 different and scanned forms of ID! You warn Beejou that this is likely a scam. She's relieved because she actually was acting a little suspicious, but only cause she wanted to surprise you with a fresh donut from Do or Donut.",
        },
        isFlipped: false,
      },
      {
        type: "reveal",
        text: `Subject: Urgent: Immediate Account Verification Required!
From: security@reelcampgoos.ca
To: BeejouB@reelpolytechnic.ca

Dear Beejou,
Security Team Alpha has detected suspicious actvity for your learning account. To protect your data and prevent unauthrized access, we must verify your identity immediately!
Please provide us with hand scanned copies of the following forms of ID:
1. Student ID card
2. Drivering license or passport
3. Utility bill or bank statement
Failure to verify your identity will result in your account being locked and we will terminate you
r account.
We take your security very serious and want to ensure your information stays safe, always!
Click the link below to upload your documints and complete the verification process:
Verify Now
Thank you for your prompt response to this critical matter. Do not wait! We apologize for any stresses this may cause you and appreciate you're co operation.
Warm regards,
Security Team
Campus Security
security@reelcampgoos.ca`,
        trustLabel: "I see",
        distrustLabel: "Got it",
        isFlipped: false,
      },
    ],
  },
];
