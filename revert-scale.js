const fs = require('fs');
const path = require('path');

const mapping = {
  // Fonts
  'text-\\[12px\\]': 'text-[10px]',
  'text-\\[13px\\]': 'text-[11px]',
  'text-\\[14\\.5px\\]': 'text-[12.5px]',
  'text-\\[15px\\]': 'text-[13px]',
  'text-\\[16px\\]': 'text-[14px]',
  'text-\\[19px\\]': 'text-[17px]',
  'text-\\[1\\.12rem\\]': 'text-[1.02rem]',
  'text-\\[1\\.15rem\\]': 'text-[1.05rem]',
  'text-xl(?![a-zA-Z0-9_-])': 'text-lg',
  'text-lg(?![a-zA-Z0-9_-])': 'text-base',
  'text-base(?![a-zA-Z0-9_-])': 'text-sm',
  'text-sm(?![a-zA-Z0-9_-])': 'text-xs',

  // Layouts
  '\\bmax-w-\\[90rem\\]\\b': 'max-w-6xl',
  '\\bmax-w-7xl\\b': 'max-w-5xl',
  '\\bmax-w-6xl\\b': 'max-w-4xl',
  '\\bmax-w-5xl\\b': 'max-w-3xl',
  '\\bmax-w-4xl\\b': 'max-w-2xl',
  '\\bmax-w-3xl\\b': 'max-w-xl',

  // Icons / sizes (largest to smallest to avoid cascading)
  '\\bw-16\\b': 'w-14',
  '\\bh-16\\b': 'h-14',
  '\\bw-14\\b': 'w-12',
  '\\bh-14\\b': 'h-12',
  '\\bw-12\\b': 'w-10',
  '\\bh-12\\b': 'h-10',
  '\\bw-6\\b': 'w-5',
  '\\bh-6\\b': 'h-5',
  '\\bw-5\\b': 'w-4',
  '\\bh-5\\b': 'h-4',
  
  'size=\\{12\\}': 'size={9}',
  'size=\\{18\\}': 'size={14}',
  'size=\\{20\\}': 'size={16}',
  'size=\\{24\\}': 'size={20}',
  'size=\\{28\\}': 'size={24}', // Note: bump script changed 28 -> 34, so we revert 34 -> 28
  'size=\\{34\\}': 'size={28}',

  // Buttons padding
  '\\bpx-8 py-4\\b': 'px-6 py-3',
  '\\bpx-7 py-3\\.5\\b': 'px-5 py-2.5',
  '\\bpx-6 py-3\\b': 'px-4 py-2',
  '\\bpx-3\\.5 py-1\\.5\\b': 'px-2.5 py-1',
  '\\bpx-3 py-1\\b': 'px-2.5 py-0.5',
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
        console.log(`Reverted ${fullPath}`);
      }
    }
  }
}

processDir(path.join(__dirname, 'components'));
processDir(path.join(__dirname, 'app'));
