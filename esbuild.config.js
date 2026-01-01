import esbuild from 'esbuild';

const config = {
  entryPoints: ['src/index.js'],
  bundle: true,
  outfile: 'public/js/bundle.js',
  loader: {
    '.js': 'jsx'
  },
  sourcemap: true,
};

if (process.argv.includes('--watch')) {
  config.watch = {
    onRebuild(error, result) {
      if (error) console.error('watch build failed:', error)
      else console.log('watch build succeeded:', result)
    },
  }
}

esbuild.build(config).catch(() => process.exit(1));
