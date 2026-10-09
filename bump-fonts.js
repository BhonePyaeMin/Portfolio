const fs = require('fs');
const path = require('path');

const mapping = {
  'text-\\[10px\\]': 'text-[12px]',
  'text-\\[11px\\]': 'text-[13px]',
  'text-\\[12.5px\\]': 'text-[14.5px]',
  'text-\\[13px\\]': 'text-[15px]',
  'text-\\[14px\\]': 'text-[16px]',
  'text-\\[17px\\]': 'text-[19px]',
  'text-\\[1.02rem\\]': 'text-[1.12rem]',
  'text-\\[1.05rem\\]': 'text-[1.15rem]',
  'text-xs(?![a-zA-Z0-9_-])': 'text-sm',
  'text-sm(?![a-zA-Z0-9_-])': 'text-base',
  'text-base(?![a-zA-Z0-9_-])': 'text-lg',
  'text-lg(?![a-zA-Z0-9_-])': 'text-xl',
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
