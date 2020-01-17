module.exports = {
  apps : [
      {
        name: "nuxt",
        script: "./start.js",
        env: {
            "HOST": "0.0.0.0",
            "PORT": 3001,
            "NODE_ENV": "production",
        }
      }
  ]
}