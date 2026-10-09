const fs = require('fs');
const path = require('path');

const mapping = {
  // Global width requested
  'max-w-5xl mx-auto px-4': 'w-full max-w-[1050px] mx-auto px-4',
  'max-w-[1100px]': 'max-w-[1050px]',
  'max-w-5xl': 'max-w-[1050px]',
  
  // Projects exact layout
  '"grid gap-4 sm:grid-cols-2 lg:grid-cols-3"': '"grid gap-6 sm:grid-cols-2 w-full max-w-[1000px] mx-auto"',
  '"grid gap-4 grid-cols-1 md:grid-cols-3"': '"grid gap-6 grid-cols-1 md:grid-cols-2 w-full max-w-[1000px] mx-auto"',

  // Career timeline specific fixes
  'mx-auto w-full max-w-xl px-4': 'mx-auto w-full max-w-[900px] px-4', // Fixes off-center crunch
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
        modified = modified.split(find).join(replace);
      }
      
      if (content !== modified) {
        fs.writeFileSync(fullPath, modified, 'utf8');
        console.log(`Updated ${file}`);
      }
    }
  }
}

processDir(path.join(__dirname, 'components', 'sections'));
processDir(path.join(__dirname, 'components'));
processDir(path.join(__dirname, 'app'));
