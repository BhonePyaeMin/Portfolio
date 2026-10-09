const fs = require('fs');
const path = require('path');

const globalMapping = {
  // Global layout max-width wrappers to max-w-5xl mx-auto px-4
  'max-w-[90rem] px-6': 'max-w-5xl mx-auto px-4',
  'max-w-[1100px] px-6': 'max-w-5xl mx-auto px-4',
  'max-w-[90rem]': 'max-w-5xl',
  'max-w-[1100px]': 'max-w-5xl',
  'max-w-6xl': 'max-w-5xl',
  'px-6': 'px-4',
  
  // Section padding (shrink down to py-8 / py-10)
  'py-10 lg:py-12': 'py-8 lg:py-10',
  'py-12 lg:py-16': 'py-8 lg:py-10',
  'py-10 text-center lg:py-24': 'py-8 text-center lg:py-10',
  
  // Global Heading adjustments (drop to 2xl/3xl)
  'text-3xl font-bold leading-tight tracking-tight text-ink sm:text-4xl': 'text-2xl font-bold leading-tight tracking-tight text-ink md:text-3xl',
  'text-3xl font-bold tracking-tight text-ink sm:text-4xl': 'text-2xl font-bold tracking-tight text-ink md:text-3xl',

  // Global Body text adjustments to text-sm
  'text-[15px] leading-relaxed': 'text-sm leading-relaxed',
  'text-[15px]': 'text-sm',

  // Inner card paddings
  'p-5 sm:p-6': 'p-4',
  'p-5 sm:p-7': 'p-4',
  'p-5': 'p-4',
};

const fileSpecificMapping = {
  'Hero.tsx': {
    'text-3xl font-bold leading-tight tracking-tight text-ink sm:text-4xl': 'text-2xl font-bold leading-tight tracking-tight text-ink md:text-3xl',
  },
  'Projects.tsx': {
    // 3 cards per row on desktop (already done but just in case)
    '"grid gap-5 sm:grid-cols-2 lg:grid-cols-3"': '"grid gap-4 grid-cols-1 md:grid-cols-3"',
    '"grid gap-5 sm:grid-cols-2"': '"grid gap-4 grid-cols-1 md:grid-cols-3"',
    'gap-5': 'gap-4',
  },
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
      
      // Apply global
      for (const [find, replace] of Object.entries(globalMapping)) {
        modified = modified.split(find).join(replace);
      }

      // Apply file specific
      if (fileSpecificMapping[file]) {
        for (const [find, replace] of Object.entries(fileSpecificMapping[file])) {
          modified = modified.split(find).join(replace);
        }
      }
      
      if (content !== modified) {
        fs.writeFileSync(fullPath, modified, 'utf8');
        console.log(`Compacted ${file}`);
      }
    }
  }
}

processDir(path.join(__dirname, 'components', 'sections'));
processDir(path.join(__dirname, 'components'));
processDir(path.join(__dirname, 'app'));
