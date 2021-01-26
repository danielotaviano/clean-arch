export default {
  mongoUrl: process.env.MONGO_URL || 'mongodb://mongo:27017/clean-node-api',
  port: process.env.PORT || 3000,
  jwtSecret: process.env.JWT_SECRET || 'FE37FBF7FBBD5B49C1CC9A5BD1B240D2F7E17330E5D38425CEB6B3D93F64FE42'
}
