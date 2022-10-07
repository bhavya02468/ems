module.exports = {
  environment: process.env.NODE_ENV,
  ip: process.env.NODE_IP,
  port: process.env.NODE_PORT,
  protocol: "http",
  mongo: {
    dbName: process.env.DATABASE_NAME,
    dbUrl: `mongodb+srv://bhavya02468:9811292828@cluster0.i88tuhm.mongodb.net/ems?retryWrites=true&w=majority`,
    options: {
      user: process.env.DATABASE_USER,
      pass: process.env.DATABASE_PASSWORD,
      // server: {socketOptions: {keepAlive: 1, connectTimeoutMS: 30000}},
      // replset: {
      //   socketOptions: {
      //     keepAlive: JSON.parse(process.env.socketOptions).keepAlive,
      //     connectTimeoutMS: JSON.parse(process.env.socketOptions)
      //       .connectTimeoutMS, // 5 minutes
      //   },
      //   ha: process.env.ha, // Make sure the high availability checks are on
      //   haInterval: process.env.haInterval, // Run every 10 seconds
      // },
    },
  },
  swagger_port: 80,
  isDev: true,

  //the above keys are used when someone used othan required envionments
  redis: {
      url: process.env.NODE_IP,
  },

  adminEmail: process.env.SUPER_ADMIN_USER,
  password: process.env.SUPER_ADMIN_PASSWORD,
  email: {
    emailId: process.env.MAIL_EMAIL,
    password: process.env.MAIL_PASSWORD,
  },
  basicAuth: {
    username: process.env.BASIC_AUTH_USER,
    password: process.env.BASIC_AUTH_PASSWORD,
  },
  url: {
    basePath: process.env.NODE_IP,
  },
};
