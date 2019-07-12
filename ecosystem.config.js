module.exports = {
  /**
   * Application configuration section
   * http://pm2.keymetrics.io/docs/usage/application-declaration/
   */
  apps : [

    // First application
    {
      name      : 'NEXT_Exchange',
      script    : 'server.js',
      log       : './logs/out.log'
    }
  ]
};
