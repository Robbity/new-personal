// Shared résumé content for every draft. Edit here once.
export const site = {
  name: "Robbie Laughlen",
  tagline: "Software / Physics / Sound",
  location: "Vancouver, Canada",
  email: "robbie@laughlen.com",
  about:
    "Computer science and physics graduate from the University of British Columbia. I care about software, creating, and music. The magic happens at the intersection of things, because that is where value is created: music and physics, coding and health, industry and environment. I'm excited by our emerging AI world, including the challenges to be overcome.",
  facts: [
    ["Education", "BSc Combined Computer Science & Physics, UBC. 2020 – 2025. cGPA 3.73, Dean's Honour List."],
    ["Languages", "Python, TypeScript, JavaScript, Go, C/C++, Java, R"],
    ["Tech", "React, Node.js, Flask, Dash, Qt, Expo, TensorFlow, AWS, Docker"],
    ["Citizenship", "UK / Canada / Trinidad"],
  ],
  links: [
    ["GitHub", "https://github.com/Robbity"],
    ["LinkedIn", "https://www.linkedin.com/in/robertlaughlen/"],
    ["Résumé", "/data/Robert_Laughlen_Resume.pdf"],
    ["CV", "/data/Robert_Laughlen_CV.pdf"],
  ],
  jobs: [
    {
      role: "Fullstack Developer Intern",
      org: "3DQue",
      when: "May 2024 – Jan 2025",
      code: "3DQ",
      points: [
        "Led a React + Tailwind UI redesign, building a tagging system for 3D print categorization.",
        "Rewrote critical endpoints in Go for concurrency, cutting response times 43% (1.4s → 0.8s).",
        "Built Direct2Print, integrating Shopify and Etsy to grow users and streamline orders.",
      ],
    },
    {
      role: "XRF & VNIR Integration Co-op",
      org: "MineSense",
      when: "May 2022 – Jan 2023",
      code: "MSN",
      points: [
        "Advanced sensor research for ShovelSense: high-speed XRF on mining shovels for real-time ore analysis.",
        "Wrote software for X-ray detector hardware, cutting average XRF sensor testing time by over 50%.",
      ],
    },
  ],
  awards: [
    ["2024", "AI in Software Development Certificate, DeepLearning.AI"],
    ["2024", "Sustainability Track Winner, StormHacks"],
    ["2024", "Best Design, Community Track Winner, nwHacks"],
    ["2023", "Research Grant, Google Vulnerability / LLM bugSWAT"],
    ["2022", "Best Music (x2), UBC Game Developer Awards"],
    ["2019", "Governor's Award, EPQ Project"],
  ],
  projects: [
    { title: "Amazon RECRUIT", year: "2025", href: "https://amazonpleaserecruit.me/", img: "/img/awsrecruit.jpg", desc: "Hiring platform with AI interview question generation and applicant tracking.", stack: "React / Node / Postgres / Docker / OpenAI" },
    { title: "You're Not Trash!", year: "2024", href: "https://devpost.com/software/you-re-not-trash", img: "/img/nottrash.jpg", desc: "Recycling web game. StormHacks 2024 Sustainability Winner.", stack: "React / Spline" },
    { title: "yapyap", year: "2024", href: "https://devpost.com/software/yapyap-anonymous-social-journaling-app", img: "/img/yapyap.jpg", desc: "Anonymous journaling app with RNN emotion analysis. nwHacks 2024 Winner.", stack: "React Native / TensorFlow / AWS" },
    { title: "Multiband Compressor", year: "2024", href: "https://github.com/Robbity/MultibandCompressor", img: "/img/multibandcomp.PNG", desc: "Multiband compressor audio plugin (VST).", stack: "C++ / JUCE" },
    { title: "Music Rating App", year: "2023", href: "https://github.com/Robbity/MusicRating", img: "/img/ratingsplashscreen.png", desc: "Built for CPSC 210.", stack: "Java / Swing" },
    { title: "MSP430 Metronome", year: "2023", href: "/data/PHYS_319_Final_Paper.pdf", img: "/img/phys319.PNG", desc: "Configurable metronome for PHYS 319. Paper available.", stack: "C / MSP430" },
    { title: "X-ray Detector Analytics", year: "2022", href: "https://github.com/Robbity/SensorProgram", img: "/img/minesense.jpg", desc: "Real-time metrics and live graphing for a Ketek detector, for MineSense.", stack: "Python / Dash / Qt" },
    { title: "Heart Failure Risk Analysis", year: "2021", href: "https://github.com/SaadRehmanCS/DSCI_project", img: "/img/heartfailure.PNG", desc: "Built for DSCI 100.", stack: "R" },
    { title: "FFT of Electric Guitar", year: "2019", href: "/data/EPQ_Paper.pdf", img: "/img/epq.PNG", desc: "Governor's Award winning EPQ project. Paper available.", stack: "Physics / DSP" },
  ],
  music: [
    { title: "Cornercutter (video)", year: "2025", href: "https://youtu.be/RyHftWDR0yg", img: "/img/music/CornercutterVideo.jpg", desc: "Music video made in DaVinci Resolve and TouchDesigner." },
    { title: "Cornercutter", year: "2025", href: "https://open.spotify.com/album/64emdZSbSDnZoPepjFSDfC", img: "/img/music/Cornercutter.jpg", desc: "A song I'm very proud of. Reaper, Serum and guitar." },
    { title: "shaft2, live @ takeurtimeback", year: "2025", href: "https://youtu.be/H-1TgKuGUe4", img: "/img/music/shaft2live.jpg", desc: "Charity set raising funds for the PCRF." },
  ],
};
