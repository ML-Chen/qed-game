var GAME_NAME = window.GAME_NAME || 'Heurēka!';
// app.js — what makes this build Heurēka! instead of Q.E.D.!: its topics, its save key and its card label.
// The engine (src/engine.js) reads APP before anything else. Topic ids are stable: saves use them.
// Each topic: id, name, grade (the course level, shown on the topic tile), group (the subject heading in the topic
// list), animal (the host, an ANI kind), mood (the music: bright, desert, sea, night, storm, party), sky and ground
// colours for the between-games page, and line (the host's one plain sentence when the topic starts).
// The curriculum behind every topic is in docs/science/CURRICULUM_*.md.
const APP = {
  name: 'Heurēka!',
  saveKey: 'heureka1',
  noteLabel: 'THE IDEA',
  hideSettings: ['steps', 'mode'], // tap-through steps and the answer tray are Q.E.D.! features
  checkin: false, // no Got it / Confused / Replay slower after a game; a "How it works" button opens the card instead
  stages: [
    // Physics
    { id: 'motion', name: 'Pushes and motion', grade: 'Elementary', group: 'Physics', animal: 'fox', mood: 'bright', sky: ['#7ec8e8', '#bfe6f0', '#fff1c8'], ground: ['#a8d870', '#70a848'], line: 'Things keep moving until something pushes or pulls on them.' },
    { id: 'waves', name: 'Sound and light', grade: 'Elementary', group: 'Physics', animal: 'bird', mood: 'party', sky: ['#ff9ac0', '#ffc890', '#fff2d0'], ground: ['#a8d870', '#70a848'], line: 'Sound is a shake that travels through the air.' },
    { id: 'energy', name: 'Energy and electricity', grade: 'Elementary', group: 'Physics', animal: 'hedgehog', mood: 'night', sky: ['#1a1a48', '#3a3a7a', '#7a6aa0'], ground: ['#4a5a6a', '#2a3a4a'], line: 'Energy can change form, but it never just disappears.' },
    { id: 'forces', name: 'Forces and orbits', grade: 'Middle school', group: 'Physics', animal: 'owl', mood: 'night', sky: ['#1a2050', '#3a3a80', '#8a6ab0'], ground: ['#3a4a6a', '#1e2a40'], line: 'A moving thing goes straight unless a force bends its path.' },
    { id: 'atoms', name: 'Atoms and the cosmos', grade: 'High school', group: 'Physics', animal: 'owl', mood: 'night', sky: ['#0e1030', '#2a2a68', '#5a4a90'], ground: ['#2a3050', '#141a30'], line: 'Everything is made of tiny atoms, and atoms are mostly empty space.' },
    // Chemistry
    { id: 'matter', name: 'Solids, liquids and gases', grade: 'Elementary', group: 'Chemistry', animal: 'penguin', mood: 'sea', sky: ['#7ab8e0', '#c0e0f2', '#f4fbff'], ground: ['#e8f2f8', '#b8d0e0'], line: 'Heating and cooling can turn a solid into a liquid and a gas.' },
    { id: 'reactions', name: 'Mixing and reactions', grade: 'Middle school', group: 'Chemistry', animal: 'beaver', mood: 'desert', sky: ['#f0a070', '#f8c890', '#fff0d0'], ground: ['#c8b070', '#9a8048'], line: 'In a reaction, atoms swap partners and make new stuff.' },
    { id: 'fire', name: 'Fire and plasma', grade: 'High school', group: 'Chemistry', animal: 'fox', mood: 'storm', sky: ['#3a1830', '#8a3a3a', '#f0a060'], ground: ['#5a3a2a', '#3a2418'], line: 'Fire needs fuel, heat and air. Take one away and it goes out.' },
    // Biology and medicine
    { id: 'life', name: 'Living things', grade: 'Elementary', group: 'Biology and medicine', animal: 'frog', mood: 'bright', sky: ['#88c8e8', '#c0e4f2', '#fff4e0'], ground: ['#8ac860', '#5a9a40'], line: 'Every living thing needs food, water and a place to live.' },
    { id: 'body', name: 'Your body', grade: 'Elementary', group: 'Biology and medicine', animal: 'rabbit', mood: 'bright', sky: ['#ffb0a0', '#ffd8b8', '#fff4e0'], ground: ['#a8d870', '#70a848'], line: 'Your heart pumps blood that carries air and food to every part of you.' },
    { id: 'cells', name: 'Cells and genes', grade: 'High school', group: 'Biology and medicine', animal: 'octopus', mood: 'sea', sky: ['#4ab0e8', '#9ad8f0', '#e8f8ff'], ground: ['#f2dca8', '#e0c080'], line: 'Every living thing is built from cells, and every cell carries instructions.' },
    { id: 'medicine', name: 'Germs and medicine', grade: 'High school', group: 'Biology and medicine', animal: 'duck', mood: 'party', sky: ['#a8d8a0', '#d8f0c8', '#fffbe0'], ground: ['#8ac860', '#5a9a40'], line: 'Your immune system learns to recognise germs and fight them off.' },
    // Earth and space
    { id: 'earth', name: 'Weather and Earth', grade: 'Elementary', group: 'Earth and space', animal: 'duck', mood: 'storm', sky: ['#6a8ab0', '#a8c0d8', '#e8f0f0'], ground: ['#8ab060', '#5a8040'], line: 'The Sun warms the air and water, and that drives the weather.' },
    { id: 'space', name: 'Planets and stars', grade: 'Middle school', group: 'Earth and space', animal: 'owl', mood: 'night', sky: ['#0a0c28', '#22225a', '#4a3a80'], ground: ['#3a3a5a', '#1a1a30'], line: 'Gravity holds the planets in their paths around the Sun.' },
    // Engineering and hardware
    { id: 'build', name: 'Building things', grade: 'Elementary', group: 'Engineering and hardware', animal: 'beaver', mood: 'desert', sky: ['#9ad0e8', '#d0ecf4', '#fff6e0'], ground: ['#b8c870', '#88984a'], line: 'Triangles keep a structure from folding.' },
    { id: 'circuits', name: 'Circuits and signals', grade: 'Middle school', group: 'Engineering and hardware', animal: 'hedgehog', mood: 'night', sky: ['#1a2a48', '#2a4a7a', '#5a7aa0'], ground: ['#3a4a5a', '#1a2a3a'], line: 'Electricity only flows around a complete loop.' },
    { id: 'robots', name: 'Robots and gadgets', grade: 'Elementary', group: 'Engineering and hardware', animal: 'ant', mood: 'party', sky: ['#8ac8f0', '#c8e8f8', '#fff8e0'], ground: ['#9ad070', '#6aa048'], line: 'A robot senses, decides, and then acts, over and over.' },
    // Computer science
    { id: 'programs', name: 'You are the computer', grade: 'Elementary', group: 'Computer science', animal: 'turtle', mood: 'bright', sky: ['#a8d8a0', '#d8f0c8', '#fffbe0'], ground: ['#8ac860', '#5a9a40'], line: 'A program is a list of steps the computer follows exactly.' },
    { id: 'apps', name: 'Building apps', grade: 'High school', group: 'Computer science', animal: 'fox', mood: 'party', sky: ['#88b8e0', '#c0dcf0', '#fff4e0'], ground: ['#8ab060', '#5a8040'], line: 'An app is screens, a server and a database passing messages.' },
    { id: 'ai', name: 'How AI works', grade: 'High school', group: 'Computer science', animal: 'owl', mood: 'night', sky: ['#2a2860', '#6a4a8a', '#c88a9a'], ground: ['#6a5a7a', '#4a3a5a'], line: 'An AI model learns patterns from lots of examples.' },
    // Money and business
    { id: 'money', name: 'Money basics', grade: 'Elementary', group: 'Money and business', animal: 'rabbit', mood: 'bright', sky: ['#f0b080', '#f8d0a8', '#fff4e0'], ground: ['#c8b070', '#9a8048'], line: 'Money you save can grow, and money you borrow costs extra.' },
    { id: 'startups', name: 'Startups and investors', grade: 'Business', group: 'Money and business', animal: 'fox', mood: 'party', sky: ['#ff9ac0', '#ffc890', '#fff2d0'], ground: ['#b8d870', '#80a848'], line: 'Build something people want so much that they come back and bring their friends.' },
    { id: 'markets', name: 'Markets and prices', grade: 'Economics', group: 'Money and business', animal: 'duck', mood: 'desert', sky: ['#e8a0c0', '#f8c8d8', '#fff0f0'], ground: ['#c8a870', '#9a7a48'], line: 'When lots of people want something scarce, its price goes up.' },
    // Law, government and consulting
    { id: 'law', name: 'Law and contracts', grade: 'Law', group: 'Law, government and consulting', animal: 'turtle', mood: 'desert', sky: ['#d8b890', '#f0d8b8', '#fff4e0'], ground: ['#b89870', '#8a6a48'], line: 'A contract is a promise the law will make people keep.' },
    { id: 'policy', name: 'Government and policy', grade: 'Civics', group: 'Law, government and consulting', animal: 'penguin', mood: 'bright', sky: ['#7ab0d8', '#b8d8ec', '#f0f6e8'], ground: ['#7aa860', '#4a7a40'], line: 'Every rule has trade-offs: it helps some things and costs others.' },
    { id: 'problems', name: 'Solving problems', grade: 'Consulting', group: 'Law, government and consulting', animal: 'bird', mood: 'party', sky: ['#6ab8e8', '#b8e2f2', '#fff2cc'], ground: ['#9ad070', '#6aa048'], line: 'Break a big problem into smaller parts that don\'t overlap.' },
  ],
};
