function Environment(host, username, password) {
  this.host = host;
  this.username = username;
  this.password = password;
}

var envs = {
  dev: new Environment('host', 'username', 'password'),
  qa: new Environment('host', 'username', 'password'),
  uat: new Environment('host', 'username', 'password'),
  prod: new Environment('host', 'username', 'password')
};

module.exports = envs;