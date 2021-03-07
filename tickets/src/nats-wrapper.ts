import nats, { Stan } from 'node-nats-streaming';

class NatsWrapper {
  private _client?: Stan; //The '?' tells to typeScript that _client will be undefined for some period of time

  //This is a getter in TypeScript
  get client() {
    if (!this._client) {
      throw new Error('Cannot access NATS client before connecting');
    }
    return this._client;
  }

  connect(clusterId: string, clientId: string, url: string) {
    this._client = nats.connect(clusterId, clientId, { url });

    //We are doing a promise because the second argument of "this.client!.on" is a callback function
    //Then, we want to wait until we have a positive answer or negative answer.
    //So, we can do that with a promise.
    return new Promise<void>((resolve, reject) => {
      this.client.on('connect', () => {
        console.log('Connected to NATS');
        resolve();
      });
      this.client.on('error', (err) => {
        reject(err);
      });
    });
  }
}

//Note that we are importing THE INSTANCE OD THE CLASS. NOT THE CLASS.
export const natsWrapper = new NatsWrapper();
