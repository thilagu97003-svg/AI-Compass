export const rules = [
  {
    id: 'startup',
    title: 'Mobile app idea or business idea',
    keywords: ['mobile app', 'android app', 'startup', 'business idea', 'business plan', 'product idea', 'mvp', 'side project'],
    choose: [
      { toolId: 'perplexity', when: 'You want to research similar products and what users say about them.' },
      { toolId: 'chatgpt', when: 'You want to shape the idea into core features and a launch plan.' },
      { toolId: 'lovable', when: 'You want a working prototype to show to real people.' },
    ],
    workflow: [
      { stage: 'Market research', toolId: 'perplexity', how: 'Find similar apps or businesses and what users say about them.' },
      { stage: 'Define the idea', toolId: 'chatgpt', how: 'Write down target users, core features and what to build first.' },
      { stage: 'Prototype', toolId: 'lovable', how: 'Generate a quick working prototype to test the idea with real people.' },
    ],
  },
  {
    id: 'website',
    title: 'Building a website or app',
    keywords: ['website', 'web app', 'app', 'portfolio', 'landing page', 'frontend', 'html', 'react', 'ui'],
    choose: [
      { toolId: 'lovable', when: 'You want a working preview quickly and have nothing set up yet.' },
      { toolId: 'chatgpt', when: 'You are a beginner and want a plan and code explained step by step.' },
      { toolId: 'cursor', when: 'You already have a project folder and want changes across several files.' },
    ],
    workflow: [
      { stage: 'Plan', toolId: 'chatgpt', how: 'Turn your idea into a feature list and a task plan.' },
      { stage: 'Prototype', toolId: 'lovable', how: 'Generate a first working version to see the idea quickly.' },
      { stage: 'Build properly', toolId: 'cursor', how: 'Edit the real project code with AI assistance.' },
      { stage: 'Review', toolId: 'claude', how: 'Paste your code for a detailed review and a README.' },
    ],
  },
  {
    id: 'research',
    title: 'Research or report writing',
    keywords: ['research', 'report', 'compare', 'comparison', 'survey', 'sources', 'paper', 'thesis'],
    choose: [
      { toolId: 'perplexity', when: 'You need answers with source links that you can open and verify.' },
      { toolId: 'gemini', when: 'You want to summarise content and keep your notes inside Google apps.' },
      { toolId: 'claude', when: 'You already have the material and need it organised into a clear report.' },
    ],
    workflow: [
      { stage: 'Research', toolId: 'perplexity', how: 'Ask questions and collect answers with source links.' },
      { stage: 'Understand', toolId: 'gemini', how: 'Summarise and simplify the key concepts.' },
      { stage: 'Draft', toolId: 'claude', how: 'Write the report section by section from your notes.' },
    ],
  },
  {
    id: 'study',
    title: 'Studying or learning a topic',
    keywords: ['study', 'learn', 'exam', 'notes', 'understand', 'explain', 'concept', 'revision'],
    choose: [
      { toolId: 'chatgpt', when: 'You want a concept explained simply, with examples and practice questions.' },
      { toolId: 'perplexity', when: 'You want to verify a fact against sources before you memorise it.' },
      { toolId: 'gemini', when: 'You want to study from text and images together, such as diagrams in your notes.' },
    ],
    workflow: [
      { stage: 'Explain', toolId: 'chatgpt', how: 'Ask for a simple explanation with examples.' },
      { stage: 'Verify', toolId: 'perplexity', how: 'Check important facts against sources.' },
      { stage: 'Practise', toolId: 'gemini', how: 'Ask for practice questions and test yourself.' },
    ],
  },
  {
    id: 'coding',
    title: 'Coding or debugging',
    keywords: ['code', 'coding', 'bug', 'debug', 'error', 'python', 'javascript', 'function', 'program', 'script'],
    choose: [
      { toolId: 'copilot', when: 'You are writing code in VS Code and want suggestions as you type.' },
      { toolId: 'claude', when: 'You have an error and want a careful explanation of the cause and the fix.' },
      { toolId: 'cursor', when: 'The change spans several files in your project.' },
    ],
    workflow: [
      { stage: 'Write', toolId: 'copilot', how: 'Get inline suggestions while you type in VS Code.' },
      { stage: 'Debug', toolId: 'claude', how: 'Paste the error and code to get the cause and a fix.' },
      { stage: 'Whole project', toolId: 'cursor', how: 'Make changes that span several files.' },
    ],
  },
  {
    id: 'content',
    title: 'Content, posts or images',
    keywords: ['post', 'caption', 'linkedin', 'instagram', 'social', 'poster', 'image', 'logo', 'content', 'marketing'],
    choose: [
      { toolId: 'metaai', when: 'You need quick ideas, taglines or a simple image inside WhatsApp or Instagram.' },
      { toolId: 'chatgpt', when: 'You want a full draft in a specific tone.' },
      { toolId: 'claude', when: 'You already have a draft and want clean, polished wording.' },
    ],
    workflow: [
      { stage: 'Ideas', toolId: 'metaai', how: 'Get quick ideas, taglines and simple images.' },
      { stage: 'Draft', toolId: 'chatgpt', how: 'Write a full draft in the tone you want.' },
      { stage: 'Refine', toolId: 'claude', how: 'Polish the wording and keep your own voice.' },
    ],
  },
  {
    id: 'resume',
    title: 'Resume and job applications',
    keywords: ['resume', 'cv', 'cover letter', 'job application', 'apply for job', 'career', 'linkedin profile'],
    choose: [
      { toolId: 'perplexity', when: 'You first need to know which skills the role asks for.' },
      { toolId: 'chatgpt', when: 'You want a first draft built from your real details.' },
      { toolId: 'claude', when: 'You already have a draft and want it tightened to one page.' },
    ],
    workflow: [
      { stage: 'Research the role', toolId: 'perplexity', how: 'Find the skills and keywords that the job description and the industry ask for.' },
      { stage: 'Draft', toolId: 'chatgpt', how: 'Turn your real experience and projects into clear bullet points.' },
      { stage: 'Polish', toolId: 'claude', how: 'Tighten the wording, fix grammar and keep it to one page. Do not add anything untrue.' },
    ],
  },
  {
    id: 'interview',
    title: 'Interview preparation',
    keywords: ['interview', 'mock interview', 'hr round', 'technical round', 'placement', 'questions to prepare'],
    choose: [
      { toolId: 'perplexity', when: 'You need facts about the company, with sources.' },
      { toolId: 'chatgpt', when: 'You want a mock interview with feedback on each answer.' },
      { toolId: 'claude', when: 'You have written answers and want clearer, shorter versions.' },
    ],
    workflow: [
      { stage: 'Research the company', toolId: 'perplexity', how: 'Collect facts about the company, its products and recent news, with sources.' },
      { stage: 'Practise', toolId: 'chatgpt', how: 'Run a mock interview. Answer in your own words, then ask for feedback.' },
      { stage: 'Improve', toolId: 'claude', how: 'Paste your answers and ask for clearer, more concise versions.' },
    ],
  },
  {
    id: 'presentation',
    title: 'Presentation or seminar slides',
    keywords: ['presentation', 'ppt', 'slides', 'seminar', 'pitch', 'speech', 'powerpoint'],
    choose: [
      { toolId: 'gemini', when: 'You want a slide-by-slide outline and plan to build the slides in Google apps.' },
      { toolId: 'perplexity', when: 'You need facts and statistics with sources for your topic.' },
      { toolId: 'metaai', when: 'You need quick image ideas and short captions.' },
    ],
    workflow: [
      { stage: 'Research', toolId: 'perplexity', how: 'Collect key facts and statistics with sources for your topic.' },
      { stage: 'Outline', toolId: 'gemini', how: 'Create a slide-by-slide outline with a short point list for each slide.' },
      { stage: 'Visuals and captions', toolId: 'metaai', how: 'Get simple image ideas and short captions for your slides.' },
    ],
  },
  {
    id: 'data',
    title: 'Data or Excel analysis',
    keywords: ['data', 'excel', 'spreadsheet', 'csv', 'analyse', 'analyze', 'analysis', 'chart', 'formula', 'sales data'],
    choose: [
      { toolId: 'chatgpt', when: 'You want to upload a file and get an analysis of it.' },
      { toolId: 'claude', when: 'You need an exact formula or script, explained line by line.' },
      { toolId: 'gemini', when: 'You want a second opinion on your conclusions.' },
    ],
    workflow: [
      { stage: 'Understand the data', toolId: 'chatgpt', how: 'Describe your columns and ask what analysis would answer your question.' },
      { stage: 'Get formulas or code', toolId: 'claude', how: 'Ask for the exact Excel formula or Python code and an explanation of each part.' },
      { stage: 'Cross-check', toolId: 'gemini', how: 'Ask for a second opinion on your conclusions and any possible errors.' },
    ],
  },
];

export const fallbackRule = {
  id: 'general',
  title: 'General starting point',
  choose: [
    { toolId: 'chatgpt', when: 'You want a general, all-round starting point.' },
    { toolId: 'perplexity', when: 'You need facts with sources.' },
    { toolId: 'claude', when: 'You have long text to work through.' },
  ],
  workflow: [
    { stage: 'Explore', toolId: 'perplexity', how: 'Research the topic and collect sources.' },
    { stage: 'Plan and create', toolId: 'chatgpt', how: 'Break the work into steps and draft each one.' },
  ],
};

export const examples = [
  'Build a portfolio website',
  'Write a research report',
  'Prepare for an exam',
  'Fix a Python error',
  'Create a LinkedIn post',
  'Make a resume',
  'Prepare for an interview',
  'Create a presentation',
];