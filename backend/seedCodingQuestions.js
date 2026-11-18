
require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("./config/db");
const CodingQuestion = require("./models/CodingQuestion");

const questions = [
  {
    questionNumber: 1,
    title: "Sum of Two Numbers",
    topic: "Basic Programming",
    difficulty: "Easy",
    description: "Read two integers and print their sum.",
    constraints: ["-100000 <= a, b <= 100000"],
    examples: [
      { input: "10 20", output: "30", explanation: "10 + 20 = 30" },
    ],
    testCases: [
      { input: "10 20", expectedOutput: "30", isHidden: false },
      { input: "5 7", expectedOutput: "12" },
      { input: "-4 9", expectedOutput: "5" },
      { input: "0 0", expectedOutput: "0" },
    ],
  },
  {
    questionNumber: 2,
    title: "Even or Odd",
    topic: "Basic Programming",
    difficulty: "Easy",
    description: "Read an integer and print Even if it is divisible by 2; otherwise print Odd.",
    constraints: ["-1000000 <= n <= 1000000"],
    examples: [
      { input: "8", output: "Even", explanation: "8 is divisible by 2." },
    ],
    testCases: [
      { input: "8", expectedOutput: "Even", isHidden: false },
      { input: "7", expectedOutput: "Odd" },
      { input: "0", expectedOutput: "Even" },
      { input: "-3", expectedOutput: "Odd" },
    ],
  },
  {
    questionNumber: 3,
    title: "Find the Largest Number",
    topic: "Arrays",
    difficulty: "Easy",
    description: "Read N followed by N integers. Print the largest integer.",
    constraints: ["1 <= N <= 1000"],
    examples: [
      { input: "5\n3 9 2 7 4", output: "9", explanation: "9 is the largest value." },
    ],
    testCases: [
      { input: "5\n3 9 2 7 4", expectedOutput: "9", isHidden: false },
      { input: "4\n-5 -2 -9 -1", expectedOutput: "-1" },
      { input: "1\n42", expectedOutput: "42" },
    ],
  },
  {
    questionNumber: 4,
    title: "Reverse a String",
    topic: "Strings",
    difficulty: "Easy",
    description: "Read a single word and print its characters in reverse order.",
    constraints: ["1 <= string length <= 1000"],
    examples: [
      { input: "hello", output: "olleh", explanation: "The characters are reversed." },
    ],
    testCases: [
      { input: "hello", expectedOutput: "olleh", isHidden: false },
      { input: "coding", expectedOutput: "gnidoc" },
      { input: "a", expectedOutput: "a" },
    ],
  },
  {
    questionNumber: 5,
    title: "Check Palindrome",
    topic: "Strings",
    difficulty: "Easy",
    description: "Read a word and print Yes if it reads the same forwards and backwards; otherwise print No.",
    constraints: ["1 <= string length <= 1000"],
    examples: [
      { input: "madam", output: "Yes", explanation: "madam is the same in both directions." },
    ],
    testCases: [
      { input: "madam", expectedOutput: "Yes", isHidden: false },
      { input: "hello", expectedOutput: "No" },
      { input: "level", expectedOutput: "Yes" },
    ],
  },
];

async function seed() {
  try {
    await connectDB();

    for (const question of questions) {
      await CodingQuestion.findOneAndUpdate(
        { questionNumber: question.questionNumber },
        question,
        { upsert: true, new: true, runValidators: true }
      );
    }

    console.log(`${questions.length} coding questions seeded.`);
    process.exit(0);
  } catch (error) {
    console.error("Seeding failed:", error);
    process.exit(1);
  }
}

seed();
