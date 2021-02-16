import nats, { Stan } from 'node-nats-streaming';

class NatsInstance {
  private _client?: Stan;

  get client() {
    if (!this._client) {
      throw new Error('NATS NOT YET CONNECTED');
    }
    return this._client;
  }

  connect(clusterID: string, clientID: string, url: string) {
    this._client = nats.connect(clusterID, clientID, { url });

    return new Promise((resolve, reject) => {
      this._client!.on('connect', () => {
        console.log('Connected to NATS');
        resolve('DONE');
      });
      this._client?.on('error', err => {
        reject(err);
      });
    });
  }
}

export const natsInstace = new NatsInstance();
