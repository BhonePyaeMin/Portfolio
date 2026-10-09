const fs = require('fs');
const path = require('path');

const mapping = {
  '\\bmax-w-xl\\b': 'max-w-3xl',
  '\\bmax-w-2xl\\b': 'max-w-4xl',
  '\\bmax-w-3xl\\b': 'max-w-5xl',
  '\\bmax-w-4xl\\b': 'max-w-6xl',
  '\\bmax-w-5xl\\b': 'max-w-7xl',
  '\\bmax-w-6xl\\b': 'max-w-[90rem]',
};

function processDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDir(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let modified = content;
      
      for (const [find, replace] of Object.entries(mapping)) {
        const regex = new RegExp(find, 'g');
        modified = modified.replace(regex, replace);
      }
      
      if (content !== modified) {
        fs.writeFileSync(fullPath, modified, 'utf8');
        console.log(`Updated ${fullPath}`);
      }
    }
  }
}

processDir(path.join(__dirname, 'components'));
processDir(path.join(__dirname, 'app'));
