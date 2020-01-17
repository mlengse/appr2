const exec = require('child_process').exec 

console.log(`Starting app for dev`)

const build = exec('npm run build && npm run start', { 
  stdio: 'inherit', windowsHide: true 
})

build.stdout && build.stdout.on('data', console.log)
build.stderr && build.stderr.on('data', console.error)

build.on('close', (code) => {
  if (code !== 0) {
    console.log(`Build process exited with code ${code}`)
  }

  if (build.stdin) {
    build.stdin.end()
  }
})