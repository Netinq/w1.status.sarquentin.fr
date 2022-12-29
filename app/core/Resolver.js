const Status = require("../../database/models/Status");
const Host = require('../../database/models/Host')
const https = require('https')
const mail = require("../core/mail");

class Resolver {
  
  constructor(delay) {
    setInterval(() => {
      this.resolve()
    }, delay);
  }

  async getHosts() {
    return await Host.findAll();
  }

  async resolve() {
    const hosts = await this.getHosts();
    const start_at = Date.now()

    hosts.forEach(async (host) => {
      https.get({ host: host.url, headers: { 'User-Agent': 'Mozilla/5.0' } }, async (res) => {
        const json = {
          id: host.id,
          url: host.url,
          code: res.statusCode,
          server: res.headers["server"],
          status: res.statusMessage,
          tech: res.headers["x-powered-by"],
          delay: Date.now() - start_at,
          time: start_at
        };
        if (json.code != 200 || json.delay >= 3000) this.hasError(json)
        await this.store(host.id, json);
      });
    });
  }

  static resolveNow = (host) => {
    return new Promise((resolve, reject) => {
      const start_at = Date.now()
      console.log('TRYING TO RESOLVER', host.url);
      https.get({ host: host.url, headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
        console.log('RESOLVED', host.url);
        const json = {
          id: host.id,
          url: host.url,
          actual: {
            code: res.statusCode,
            server: res.headers["server"],
            status: res.statusMessage,
            tech: res.headers["x-powered-by"],
            time: Date.now() - start_at
          }
        };
        console.log('RESOLVED', json);
        resolve(json)
      }).on('error', () => {
        resolve({
          id: host.id,
          url: host.url,
          actual: {
            code: 500,
            server: '',
            status: '',
            tech: '',
            time: Date.now() - start_at
          }
        })
      });
    });
  };

  async store(host_id, json) {
    const status = await Status.create({
      code: json.code,
      server: json.server,
      status: json.status,
      tech: json.tech,
      delay: json.delay,
      date: json.time,
      host_id: host_id
    })

    await status.save()
  }

  async hasError(json) {
    await mail.sendMail({
      from: "🔧 Monitoring",
      to: 'pro@sarquentin.fr',
      subject: '🚨 ALERT Monitoring',
      html: `<h1>🚨 ALERT Monitoring</h1>
      <h2>${JSON.stringify(json.url)}</h2>
      <code>${json.code != 200 ? '🚨': '✅' } Status : ${JSON.stringify(json.code)} ${JSON.stringify(json.status)}</code>
      <br>
      <code>${json.delay >= 3000 ? '🚨': '✅' } Delay : ${JSON.stringify(json.delay)} ms</code>
      <br>
      <p>Date : ${new Date(json.time).toLocaleDateString('fr-FR', {timeZone: 'Europe/Paris', day: 'numeric', month: 'long', year: 'numeric', hour:'numeric', minute:'numeric'})} </p>
      <br>`
    })
  }
}

module.exports = {
  Resolver
}