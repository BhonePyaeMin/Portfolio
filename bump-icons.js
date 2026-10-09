const fs = require('fs');
const path = require('path');

const mapping = {
  // width/height
  '\\bw-4\\b': 'w-5',
  '\\bh-4\\b': 'h-5',
  '\\bw-5\\b': 'w-6',
  '\\bh-5\\b': 'h-6',
  '\\bw-10\\b': 'w-12',
  '\\bh-10\\b': 'h-12',
  '\\bw-12\\b': 'w-14',
  '\\bh-12\\b': 'h-14',
  '\\bw-14\\b': 'w-16',
  '\\bh-14\\b': 'h-16',
  
  // Lucide icons
  'size=\\{9\\}': 'size={12}',
  'size=\\{14\\}': 'size={18}',
  'size=\\{16\\}': 'size={20}',
  'size=\\{20\\}': 'size={24}',
  'size=\\{28\\}': 'size={34}',
  
  // Buttons padding
  '\\bpx-2\\.5 py-0\\.5\\b': 'px-3 py-1',
  '\\bpx-2\\.5 py-1\\b': 'px-3.5 py-1.5',
  '\\bpx-4 py-2\\b': 'px-6 py-3',
  '\\bpx-5 py-2\\.5\\b': 'px-7 py-3.5',
  '\\bpx-6 py-3\\b': 'px-8 py-4',
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
