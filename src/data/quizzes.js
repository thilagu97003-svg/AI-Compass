export const quizzes = {
  chatgpt: [
    {
      q: 'You have a new project idea. What is the best first step with ChatGPT?',
      options: [
        'Ask for the complete finished project in one prompt',
        'Share the idea and ask for a feature list and task plan',
        'Start coding and ask only when you are stuck',
      ],
      answer: 1,
      explain: 'Defining the scope first gives you a clear plan, and smaller tasks are easier to build and test.',
    },
    {
      q: 'You have a task list. How should you ask ChatGPT for code?',
      options: [
        'For every task in one single request',
        'For one task only, then run it before moving on',
        'For the final design only',
      ],
      answer: 1,
      explain: 'Working on one task at a time makes it easy to test and fix problems early.',
    },
    {
      q: 'Your code shows an error. What should you send to ChatGPT?',
      options: [
        'The exact error message together with the related code',
        'Only the words: it is not working',
        'Nothing, ask for a brand new project',
      ],
      answer: 0,
      explain: 'The exact error and the related code give ChatGPT the context it needs to find the cause.',
    },
    {
      q: 'Your project is finished. What is a good final use of ChatGPT?',
      options: [
        'Skip your own testing completely',
        'Review it for bugs and draft a README, then test it yourself',
        'Rewrite the whole project from scratch',
      ],
      answer: 1,
      explain: 'ChatGPT can suggest improvements and write documentation, but you must review and test the result.',
    },
    {
      q: 'Why should you check ChatGPT answers yourself?',
      options: [
        'It never makes mistakes',
        'It cannot write code',
        'It can sound confident and still be wrong',
      ],
      answer: 2,
      explain: 'AI chat tools can give confident but incorrect answers, so review and test before you submit.',
    },
  ],

  claude: [
    {
      q: 'Which kind of task is Claude especially suited to, as described in this app?',
      options: [
        'Long documents and careful reasoning',
        'Only image editing',
        'Only one-word answers',
      ],
      answer: 0,
      explain: 'Claude handles long documents well and gives clear, structured answers.',
    },
    {
      q: "You have answered Claude's questions about your project. What should you ask for next?",
      options: [
        'A project plan and folder structure',
        'The finished website with no review',
        'A list of unrelated tools',
      ],
      answer: 0,
      explain: 'A plan and folder structure give you a clear base before any code is written.',
    },
    {
      q: 'How should you generate code with Claude for a bigger project?',
      options: [
        'Request the entire app in one go',
        'Section by section, testing each part',
        'Skip testing to save time',
      ],
      answer: 1,
      explain: 'Building one section at a time makes errors easier to find and fix.',
    },
    {
      q: 'What is a useful prompt for the final review with Claude?',
      options: [
        'Delete the project and start over',
        'Write a new unrelated project',
        'Review responsiveness, accessibility and code quality, and list improvements',
      ],
      answer: 2,
      explain: 'A focused review request gives you a prioritised list of improvements to apply yourself.',
    },
    {
      q: 'Claude gives you a solution. What should you do before relying on it?',
      options: [
        'Trust it fully because it is detailed',
        'Delete your own notes',
        'Test it and verify important facts yourself',
      ],
      answer: 2,
      explain: 'Claude can still make factual mistakes, so human checking is always needed.',
    },
  ],

  gemini: [
    {
      q: 'What is a strength of Gemini mentioned in this app?',
      options: [
        'It works closely with Google services',
        'It works only offline',
        'It replaces your code editor',
      ],
      answer: 0,
      explain: 'Gemini integrates well with Google apps and is easy to access with a Google account.',
    },
    {
      q: 'You have no project topic yet. How can Gemini help?',
      options: [
        'By submitting a blank report',
        'By suggesting beginner-friendly project ideas',
        'By exporting the document before you write anything',
      ],
      answer: 1,
      explain: 'Asking for ideas with a short description for each helps you choose a topic quickly.',
    },
    {
      q: 'You used Gemini to draft a report section. What next?',
      options: [
        'Submit it unchanged',
        'Edit it in your own words and verify the facts',
        'Ask for the same text again',
      ],
      answer: 1,
      explain: 'Drafts are a starting point. Rewrite in your own words and verify the facts.',
    },
    {
      q: 'Before submitting your report, what should you ask Gemini to list?',
      options: [
        'Only the title of the report',
        'Nothing, the draft is final',
        'The factual claims you should verify, with suggested sources',
      ],
      answer: 2,
      explain: 'Listing claims to verify helps you catch mistakes before you submit.',
    },
    {
      q: 'For important work, what should you do with Gemini answers?',
      options: [
        'Assume every feature works the same in every region',
        'Skip checking because it is made by Google',
        'Verify the information from reliable sources',
      ],
      answer: 2,
      explain: 'Answers can vary in quality and feature availability changes often, so verify what matters.',
    },
  ],

  perplexity: [
    {
      q: 'What makes Perplexity different from a general chatbot?',
      options: [
        'It shows the sources used for its answers',
        'It only writes poems',
        'It edits code files',
      ],
      answer: 0,
      explain: 'Perplexity answers using web search and shows source links you can open.',
    },
    {
      q: 'After you get an answer, what should you do with the source links?',
      options: [
        'Ignore them',
        'Open them and prefer official documentation',
        'Hide them from your notes',
      ],
      answer: 1,
      explain: 'Sources can still be low quality, so open them and prefer official pages.',
    },
    {
      q: 'How should you use follow-up questions in Perplexity?',
      options: [
        'Ask focused questions to go deeper on one point',
        'Repeat the same question again and again',
        'Close the tab after the first answer',
      ],
      answer: 0,
      explain: 'Follow-up questions keep the context and help you fill gaps in your research.',
    },
    {
      q: 'Before using a fact in your final work, what should you do?',
      options: [
        'Copy it without checking',
        'Confirm it on official sources and write it in your own words',
        'Remove the source links',
      ],
      answer: 1,
      explain: 'Summaries can miss details, so cross-check important facts before using them.',
    },
    {
      q: 'Which task is Perplexity less suited for?',
      options: [
        'Fast research',
        'Creative writing',
        'Finding source links',
      ],
      answer: 1,
      explain: 'It is designed for research with sources, so it is less suited for creative writing.',
    },
  ],

  cursor: [
    {
      q: 'What is Cursor?',
      options: [
        'An AI-first code editor',
        'A search engine',
        'A photo editor',
      ],
      answer: 0,
      explain: 'Cursor is a code editor that understands your project and edits code with AI.',
    },
    {
      q: 'How should you describe a feature to Cursor?',
      options: [
        'The whole app in one request',
        'One feature at a time, described clearly',
        'No description, just click accept',
      ],
      answer: 1,
      explain: 'A clear, single feature makes the suggested changes easier to review.',
    },
    {
      q: 'Cursor suggests changes to several files. What should you do?',
      options: [
        'Accept everything immediately',
        'Review each change, accept the good ones and reject the rest',
        'Close the editor',
      ],
      answer: 1,
      explain: 'Cursor can change code you did not expect, so review every change before accepting.',
    },
    {
      q: 'Why should you test the app after accepting changes?',
      options: [
        'Testing is only for beginners',
        'Cursor deletes your project',
        'Generated code may contain bugs',
      ],
      answer: 2,
      explain: 'AI-generated code can have bugs, so run the app and test before moving on.',
    },
    {
      q: 'All features work. What is a good final step with Cursor?',
      options: [
        'Stop testing because the AI wrote the code',
        'Delete the project folder',
        'Ask for a review of bugs and unused code and a README, then check it yourself',
      ],
      answer: 2,
      explain: 'Cursor can help clean up and document, but you still need to review and test.',
    },
  ],

  copilot: [
    {
      q: 'Where does GitHub Copilot work, as described in this app?',
      options: [
        'Inside VS Code',
        'Only inside WhatsApp',
        'Only on printed paper',
      ],
      answer: 0,
      explain: 'Copilot works inside your editor, such as VS Code, and also offers a chat for questions.',
    },
    {
      q: 'How can you guide GitHub Copilot to suggest a function?',
      options: [
        'Restart your computer',
        'Write a comment describing what you need',
        'Rename the project folder',
      ],
      answer: 1,
      explain: 'A clear comment describing the function helps Copilot suggest the right code.',
    },
    {
      q: 'Why ask Copilot Chat to explain suggested code?',
      options: [
        'To understand what the code does before running it',
        'To make the code run faster automatically',
        'To avoid testing',
      ],
      answer: 0,
      explain: 'Understanding the code stops you from depending blindly on suggestions.',
    },
    {
      q: 'Your page works. How can Copilot help next?',
      options: [
        'Publish it without testing',
        'Refactor the code and add error handling, then test it yourself',
        'Remove all comments',
      ],
      answer: 1,
      explain: 'Refactoring improves readability, and you must test the result with valid and invalid inputs.',
    },
    {
      q: 'Copilot suggests some code. Which is the safest habit?',
      options: [
        'Accept every suggestion with Tab',
        'Never read the suggestions',
        'Understand the suggestion, then test it',
      ],
      answer: 2,
      explain: 'Suggestions are sometimes wrong, and accepting without understanding makes you over-depend on the tool.',
    },
  ],

  metaai: [
    {
      q: 'Where can you use Meta AI, as described in this app?',
      options: [
        'Only inside Excel',
        'Only in a terminal',
        'Inside apps such as WhatsApp and Instagram',
      ],
      answer: 2,
      explain: 'Meta AI is available inside Meta apps you already use.',
    },
    {
      q: 'Meta AI generates a logo image for you. How should you treat it?',
      options: [
        'As the final design with no changes',
        'As inspiration to refine in a design tool',
        'As something to delete immediately',
      ],
      answer: 1,
      explain: 'Generated images are good concepts, but refining them in a design tool gives a better result.',
    },
    {
      q: 'Meta AI writes a LinkedIn post draft. What should you do?',
      options: [
        'Post it exactly as generated',
        'Ask a friend to rewrite it',
        'Edit it in your own voice before posting',
      ],
      answer: 2,
      explain: 'AI drafts can sound generic, so edit them to match your own voice.',
    },
    {
      q: 'Your task needs deep technical work or a big project. What should you do?',
      options: [
        'Continue only in Meta AI',
        'Move the task to a stronger tool',
        'Skip the task',
      ],
      answer: 1,
      explain: 'Meta AI is good for quick ideas and drafts. Bigger tasks need a more capable tool.',
    },
    {
      q: 'Meta AI features can differ by what?',
      options: [
        'Country or region',
        'Keyboard colour',
        'Screen brightness',
      ],
      answer: 0,
      explain: 'Feature availability depends on your country or region.',
    },
  ],

  lovable: [
    {
      q: 'What does Lovable AI do?',
      options: [
        'Only checks grammar',
        'Turns a text description into a working web app',
        'Only translates text',
      ],
      answer: 1,
      explain: 'Lovable builds a working web app from your prompt, and you keep editing it by chat.',
    },
    {
      q: 'What makes a good first prompt in Lovable?',
      options: [
        'Just the word: app',
        'An empty prompt',
        'A detailed description of the app, its pages and its look',
      ],
      answer: 2,
      explain: 'A clear, detailed prompt gives you a better first version.',
    },
    {
      q: 'The first version of your app is ready. What should you do next?',
      options: [
        'Publish immediately without looking',
        'Delete the project',
        'Test every page and button',
      ],
      answer: 2,
      explain: 'Generated apps can have broken parts. Test everything before you request changes or publish.',
    },
    {
      q: 'What is the best way to request changes in Lovable?',
      options: [
        'One change at a time',
        'Ten changes in one long message every time',
        'Never request changes',
      ],
      answer: 0,
      explain: 'One change at a time lets you see exactly what changed and fix problems quickly.',
    },
    {
      q: 'When you report a bug to Lovable, what should you include?',
      options: [
        'Only the words: fix it',
        'What you did, what happened and what you expected',
        'Nothing at all',
      ],
      answer: 1,
      explain: 'A precise description helps Lovable fix the exact problem.',
    },
  ],
};