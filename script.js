const outputEl = document.getElementById("output");
const form = document.getElementById("terminal-form");
const commandInput = document.getElementById("command");

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const typeLine = async (text, options = {}) => {
  const { className = "line", delayMs = 0 } = options;
  if (delayMs) await delay(delayMs);
  const line = document.createElement("div");
  line.className = className;
  line.innerHTML = text;
  outputEl.appendChild(line);
  outputEl.scrollTop = outputEl.scrollHeight;
};

const scenarios = [
  {
    intro:
      "🚀 PM Challenge: Codex users are waiting for multi-file editing suggestions. How do you prioritize?",
    options: [
      "1. Ship immediately with lightweight heuristics.",
      "2. Run developer shadowing, prototype, and test signal quality before scaling.",
      "3. Pause: invest in infra first, then revisit in six months.",
    ],
    answer:
      "I'd choose option 2: shadow power users, pair with research on signal quality, and prototype in the agent harness. This balances speed with trust—Codex must accelerate developers, not slow them down.",
  },
  {
    intro:
      "🧠 PM Challenge: Researchers just unlocked a brand-new planning capability. What's the move?",
    options: [
      "1. Publish a blog post and wait for community feedback.",
      "2. Embed the capability in an internal dogfood workflow with telemetry.",
      "3. Turn it into an API endpoint with minimal guardrails.",
    ],
    answer:
      "Option 2: partner with internal teams to dogfood, gather telemetry, and define guardrails. Then use those learnings to craft a developer-first launch with clear value moments.",
  },
  {
    intro:
      "⚙️ PM Challenge: Infra costs are spiking as usage doubles. What now?",
    options: [
      "1. Throttle access for new teams.",
      "2. Pair with infra to optimize prompts, caching, and evaluation loops.",
      "3. Freeze feature work entirely.",
    ],
    answer:
      "I'd go with option 2: collaborate with infra to optimize prompts, caching, and evaluation loops—just like I did at Red Bull when we cut AI costs while scaling to 70K users.",
  },
];

let activeScenario = null;

const commandHandlers = {
  help: () => {
    return [
      "Available commands:",
      "- <span class=\"command\">show experience</span> &mdash; Explore 0-to-1 wins and product outcomes.",
      "- <span class=\"command\">show skills</span> &mdash; Peek at my technical toolkit.",
      "- <span class=\"command\">show motivation</span> &mdash; Hear why Codex is my moonshot.",
      "- <span class=\"command\">show role</span> &mdash; Highlight how I map to the Codex PM mandate.",
      "- <span class=\"command\">play challenge</span> &mdash; Try an interactive PM scenario.",
      "- <span class=\"command\">clear</span> &mdash; Clear the terminal.",
    ];
  },
  "show experience": () => {
    return [
      "<strong>Red Bull Media House | AI Product Manager</strong>",
      "• Shipped the company's first global AI product: 0 → 70K users across 40 countries, delivering 20x YoY growth.",
      "• Designed product vision and roadmap from 20+ interviews and 100+ data points, hitting 30% view → activation conversion.",
      "• Built fraud-mitigation & data integrity systems with legal/security, reducing invalid submissions by 21%.",
      "• Accelerated iteration 4× via a generative AI evaluation framework, partnering with Microsoft, AWS, and Suno researchers.",
      "<strong>Google | Software Engineer, Google AdSense</strong>",
      "• Launched a self-service A/B testing API that lifted ARR by $12M in 6 months for automatic search ads.",
      "• Engineered SQL-based monitoring for systems powering 1M+ publishers and uncovered a critical revenue bug in week three.",
      "• Collaborated with design & legal to streamline experimentation workflows, reducing feature churn by 3%.",
      "<strong>Google | SWE Internships</strong>",
      "• Built an AutoAds sampling algorithm still in production; led developer research for internal tooling used by 30K+ engineers.",
    ];
  },
  "show skills": () => {
    return [
      "Technical toolkit unlocked:",
      "• Languages & Data: Python, SQL, large-scale data pipelines, experimentation design, AI prototyping.",
      "• AI & Infra: LLM evaluation, prompt engineering, GenAI quality measurement, cost optimization across AWS/GCP/Azure.",
      "• Product Superpowers: 0→1 strategy, developer workflow empathy, hypothesis-driven discovery, cross-functional leadership.",
      "• Communication: Exec-ready storytelling, stakeholder management, vision setting that rallies researchers, designers & engineers.",
    ];
  },
  "show motivation": () => {
    return [
      "My Codex north star:",
      "I want to help OpenAI make Codex the best AI collaborator engineers have ever worked with—one that truly accelerates development, not just assists it.",
      "I'll bridge research and product so breakthroughs become daily tools developers rely on.",
      "Expect deep empathy for developer workflows, relentless experimentation, and a drive to shape how AGI becomes a creative, reliable coding partner.",
    ];
  },
  "show role": () => {
    return [
      "Mapping to the Codex PM mission:",
      "• <strong>Shape product strategy in 0–1 spaces:</strong> Led ambiguous greenfield launches at Red Bull and Google, aligning teams around a shared vision.",
      "• <strong>Translate breakthroughs into developer magic:</strong> Partnered with research orgs (Microsoft, AWS, Suno) to ship delightful AI audio tools.",
      "• <strong>Deep developer empathy:</strong> Built experimentation platforms and developer-facing APIs that improved workflows for 1M+ AdSense publishers.",
      "• <strong>Execute with technical rigor:</strong> Recently shipped code, managed infra costs, and set up AI quality evaluation loops.",
      "• <strong>Entrepreneurial and adaptable:</strong> From startup-speed iterations to global rollouts, I thrive where ambiguity meets opportunity.",
    ];
  },
  clear: () => {
    outputEl.innerHTML = "";
    return [];
  },
  "play challenge": () => {
    activeScenario = scenarios[Math.floor(Math.random() * scenarios.length)];
    const lines = [activeScenario.intro, "Choose wisely:"].concat(activeScenario.options);
    lines.push("Respond with <span class=\"command\">answer 1</span>, <span class=\"command\">answer 2</span>, or <span class=\"command\">answer 3</span>.");
    return lines;
  },
};

const answerHandler = (choice) => {
  if (!activeScenario) {
    return [
      "No active challenge. Start one with <span class=\"command\">play challenge</span>.",
    ];
  }
  const selected = Number(choice) - 1;
  const response = activeScenario.options[selected]
    ? activeScenario.answer
    : "That option isn't in the backlog yet. Try 1, 2, or 3.";
  const lines = [];
  if (activeScenario.options[selected]) {
    lines.push(`You chose option ${choice}.`);
    lines.push(activeScenario.answer);
    lines.push(
      "Curious how I'd iterate next? Ask with <span class=\"command\">show experience</span> or <span class=\"command\">show motivation</span>."
    );
    activeScenario = null;
  } else {
    lines.push(response);
  }
  return lines;
};

const history = [];
let historyIndex = 0;

commandInput.addEventListener("keydown", (event) => {
  if (!history.length) return;
  if (event.key === "ArrowUp") {
    event.preventDefault();
    historyIndex = Math.max(0, historyIndex - 1);
    commandInput.value = history[historyIndex];
  }
  if (event.key === "ArrowDown") {
    event.preventDefault();
    historyIndex = Math.min(history.length, historyIndex + 1);
    commandInput.value = history[historyIndex] ?? "";
  }
});

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const rawInput = commandInput.value.trim();
  if (!rawInput) return;

  history.push(rawInput);
  historyIndex = history.length;

  await typeLine(`<span class=\"prompt\">Codex://pm&gt;</span> ${rawInput}`);

  commandInput.value = "";

  const lower = rawInput.toLowerCase();

  if (lower.startsWith("answer")) {
    const option = lower.split(" ")[1];
    const lines = answerHandler(option);
    for (const line of lines) {
      await typeLine(line, { delayMs: 80 });
    }
    return;
  }

  const handler = commandHandlers[lower];
  if (handler) {
    const lines = handler();
    for (const line of lines) {
      await typeLine(line, { delayMs: 80 });
    }
  } else {
    await typeLine(
      "Command not recognized. Try <span class=\"command\">help</span> to see what's available.",
      { delayMs: 80 }
    );
  }
});

typeLine("Need a tour? Type <span class=\"command\">help</span>.", { delayMs: 400 });
commandInput.focus();
