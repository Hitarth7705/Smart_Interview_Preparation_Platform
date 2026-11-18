
const axios = require("axios");

const JUDGE0_URL = (
  process.env.JUDGE0_URL || "https://ce.judge0.com"
).replace(/\/$/, "");

const LANGUAGE_IDS = {
  c: 50,
  cpp: 54,
  java: 62,
  python: 71,
};

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function judge0Request(method, path, data) {
  const headers = { "Content-Type": "application/json" };

  // Optional provider credentials. Keep these on the backend only.
  if (process.env.JUDGE0_API_KEY) {
    headers["X-RapidAPI-Key"] = process.env.JUDGE0_API_KEY;
  }
  if (process.env.JUDGE0_HOST) {
    headers["X-RapidAPI-Host"] = process.env.JUDGE0_HOST;
  }

  return axios({
    method,
    url: `${JUDGE0_URL}${path}`,
    data,
    headers,
    timeout: 15000,
  });
}

async function executeCode({ code, language, stdin, timeLimit = 2 }) {
  const languageId = LANGUAGE_IDS[language];

  if (!languageId) {
    throw new Error("Unsupported programming language");
  }

  const created = await judge0Request(
    "POST",
    "/submissions?base64_encoded=false&wait=false",
    {
      source_code: code,
      language_id: languageId,
      stdin: stdin || "",
      cpu_time_limit: Math.min(Math.max(Number(timeLimit), 1), 5),
      wall_time_limit: 10,
      memory_limit: 128000,
    }
  );

  const token = created.data.token;
  if (!token) throw new Error("Judge0 did not return a submission token");

  // Poll until the result is ready. Status 1 = In Queue, 2 = Processing.
  for (let attempt = 0; attempt < 25; attempt++) {
    await sleep(1000);

    const result = await judge0Request(
      "GET",
      `/submissions/${token}?base64_encoded=false&fields=stdout,stderr,compile_output,message,status,time,memory`
    );

    const data = result.data;
    if (data.status && data.status.id > 2) {
      return data;
    }
  }

  throw new Error("Code execution timed out while waiting for Judge0");
}

module.exports = { executeCode };
