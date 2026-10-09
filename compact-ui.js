const fs = require('fs');
const path = require('path');

const globalMapping = {
  // Global layout max-width
  'max-w-\\[90rem\\]': 'max-w-[1100px]',
  'max-w-7xl': 'max-w-[1100px]',
  'max-w-6xl': 'max-w-[1100px]',
  
  // Section padding (shrink 80px/96px to 40px/48px)
  'py-20 lg:py-24': 'py-10 lg:py-12',
  'py-24 lg:py-32': 'py-12 lg:py-16',
  'py-16 lg:py-20': 'py-8 lg:py-10',
  'py-20': 'py-10',

  // Global Heading adjustments
  'text-3xl font-bold leading-tight tracking-tight text-ink sm:text-4xl': 'text-2xl font-bold leading-tight tracking-tight text-ink sm:text-3xl',
  'text-[2.25rem] font-bold leading-[1.1] tracking-tight text-ink sm:text-5xl': 'text-2xl font-bold leading-tight tracking-tight text-ink sm:text-3xl',

  // Global Body text adjustments (pushing from 12px/13px to 15px)
  'text-xs leading-\\[1\\.75\\] text-body': 'text-[15px] leading-relaxed text-body',
  'text-xs leading-relaxed text-body': 'text-[15px] leading-relaxed text-body',
  'text-\\[13px\\] leading-\\[1\\.72\\] text-body': 'text-[15px] leading-relaxed text-body',
  'text-sm leading-\\[1\\.85\\] text-body': 'text-[15px] leading-relaxed text-body',
};

const fileSpecificMapping = {
  'Hero.tsx': {
    'mb-8 font-heading text-3xl font-bold leading-[1.1] tracking-tight text-ink sm:text-4xl lg:text-5xl text-balance': 'mb-6 font-heading text-3xl font-bold leading-tight tracking-tight text-ink sm:text-4xl text-balance',
    'minHeight: "8.5rem"': 'minHeight: "7rem"',
    'py-20 text-center lg:py-24': 'py-12 text-center lg:py-16',
  },
  'Projects.tsx': {
    // 3 cards per row on desktop
    '"grid gap-5 sm:grid-cols-2"': '"grid gap-5 sm:grid-cols-2 lg:grid-cols-3"',
    // Card padding
    'p-7': 'p-5',
    'p-8': 'p-5',
    // Card headings
    'text-[17px]': 'text-[16px]',
    // Tech badges
    'px-2.5 py-0.5 font-body text-[13px]': 'px-2 py-0.5 font-body text-[12px]',
  },
  'Skills.tsx': {
    // Terminal height and padding
    'h-[500px]': 'h-[400px]',
    'h-[600px]': 'h-[450px]',
    'p-6 lg:p-8': 'p-4 lg:p-6',
    // Icon sizes
    'size={46}': 'size={36}',
    'size={48}': 'size={36}',
    'h-16 w-16': 'h-12 w-12',
    'h-14 w-14': 'h-10 w-10',
    // Tighten gaps
    'gap-5': 'gap-3',
    'gap-6': 'gap-4',
  },
  'About.tsx': {
    // Terminal box compacting
    // Need to target the pre/code block and its wrapper
    'mx-auto max-w-[90rem] px-6': 'mx-auto max-w-[1100px] px-6',
    'grid-cols-[minmax(0,5fr)_minmax(0,7fr)]': 'grid-cols-1 lg:grid-cols-2 max-w-4xl mx-auto',
    'p-5 font-mono text-[13px] leading-[1.85]': 'p-4 font-mono text-[13px] leading-snug',
  }
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
