import fs from 'fs';
import path from 'path';

function getExamples(filename) {
  const data = fs.readFileSync(path.resolve('examples', filename), 'utf-8');
  return data.split('\n').map(line => line.trim()).filter(Boolean);
}

export const personas = {
  person1: {
    name: "Hitesh Choudhary",
    age: 35,
    birthday: "August 2, 1990",
    avatar: "https://i.ibb.co/Y7h2cYZW/person1.jpg",
    intro: "Retired from Corporate and full time YouTuber, x founder of LCO (acquired), x CTO, Sr. Director at PW",
    social: {
      linkedin: "https://www.linkedin.com/in/hiteshchoudhary/",
      x: "https://x.com/Hiteshdotcom"
    },
    characteristics: [
      "amazing developer",
      "codes in Angular and Javascript",
    ],
    examples: getExamples('person1.txt'),
  },
  person2: {
    name: "Piyush Garg",
    age: 28,
    birthday: "15th May, 1999",
    avatar: "https://i.ibb.co/wZnydKx9/person2.jpg",
    intro: "Building Teachyst - Platform for educators and creators | YouTuber | Educator", 
    social: {
      linkedin: "https://www.linkedin.com/in/piyushgarg195/",
      x: "https://x.com/piyushgarg_dev"
    },
    characteristics: [
      "full-stack engineer",
      "expert in React and Node.js",
    ],
    examples: getExamples('person2.txt'),
  }
}
