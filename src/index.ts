import { ChatWork } from './modules/chatwork/index';

declare var global: any;

global.reservePost = (): void => {
  const client = new ChatWork({
    token: 'e80a334e30b310745bc0974f94bf1186'
  });
  client.sendMessage({
    room_id: 108476022,
    body: `[toall]
7/5（金）お休みさせていただきます。
よろしくお願いいたします。`
  });
};
