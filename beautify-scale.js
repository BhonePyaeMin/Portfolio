const fs = require('fs');
const path = require('path');

const mapping = {
  // Hero massive text
  'text-5xl sm:text-6xl lg:text-7xl xl:text-\\[5rem\\]': 'text-3xl sm:text-4xl lg:text-5xl',
  'text-2xl font-bold sm:text-3xl lg:text-4xl': 'text-xl sm:text-2xl lg:text-3xl',
  
  // Section headers (About, Career, Certs, Projects, Skills, Timeline)
  'text-\\[2\\.4rem\\] font-bold leading-\\[1\\.1\\] tracking-tight text-ink sm:text-5xl lg:text-\\[3\\.25rem\\]': 'text-3xl font-bold leading-tight tracking-tight text-ink sm:text-4xl',
  'text-\\[2\\.25rem\\] font-bold leading-\\[1\\.1\\] tracking-tight text-ink sm:text-5xl': 'text-3xl font-bold leading-tight tracking-tight text-ink sm:text-4xl',
  'text-\\[2\\.25rem\\] font-bold leading-\\[1\\.1\\] tracking-tight text-ink sm:text-4xl lg:text-5xl': 'text-3xl font-bold leading-tight tracking-tight text-ink sm:text-4xl',
  'text-4xl font-bold tracking-tight text-ink lg:text-5xl': 'text-3xl font-bold tracking-tight text-ink sm:text-4xl',

  // Projects background text (watermark)
  'text-7xl font-bold text-white/\\[0\\.03\\]': 'text-6xl font-bold text-white/[0.03]',

  // Random body sizing
  'text-\\[1\\.05rem\\]': 'text-sm sm:text-base',
  'text-\\[1\\.02rem\\]': 'text-sm font-semibold',
  
  // Layout spacing and widths - tightening everything up for a sleek look
  'max-w-\\[90rem\\]': 'max-w-6xl',
  'max-w-7xl': 'max-w-5xl',
  'max-w-6xl': 'max-w-5xl',
  
  // Padding tuning
  'py-24': 'py-20',
  'lg:py-32': 'lg:py-24',
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
        // use simple string replacement instead of regex to avoid escaping hell
        modified = modified.split(find).join(replace);
      }
      
      if (content !== modified) {
        fs.writeFileSync(fullPath, modified, 'utf8');
        console.log(`Beautified ${fullPath}`);
      }
    }
  }
}

processDir(path.join(__dirname, 'components'));
processDir(path.join(__dirname, 'app'));
