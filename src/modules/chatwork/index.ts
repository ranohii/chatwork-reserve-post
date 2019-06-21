export class ChatWork {
  base_url: string;
  headers: any;
  result: any;
  constructor(config) {
    this.base_url = 'https://api.chatwork.com/v2';
    this.headers = { 'X-ChatWorkToken': config.token };
  }

  /**
   * 自分のルーム一覧を取得
   */
  getRooms() {
    return this.get('/rooms', {});
  }

  /**
   * メッセージ送信
   */
  sendMessage(params) {
    var post_data = {
      body: params.body
    };

    return this.post('/rooms/' + params.room_id + '/messages', post_data);
  }

  /**
   * マイチャットへのメッセージを送信
   */
  sendMessageToMyChat(message) {
    var mydata = this.get('/me', {});

    return this.sendMessage({
      body: message,
      room_id: mydata.room_id
    });
  }

  /**
   * 指定したチャットのメッセージを取得
   */
  getMessages(room_id) {
    return this.get('/rooms/' + room_id + '/messages', {});
  }

  /**
   * タスク追加
   */
  sendTask(params) {
    var to_ids = params.to_id_list.join(',');
    var post_data = {
      body: params.body,
      to_ids: to_ids,
      limit: new Number(params.limit).toFixed() // 指数表記で来ることがあるので、intにする
    };

    return this.post('/rooms/' + params.room_id + '/tasks', post_data);
  }
  /**
   * 指定したチャットのタスク一覧を取得
   */
  getRoomTasks(room_id, params) {
    return this.get('/rooms/' + room_id + '/tasks', params);
  }

  /**
   * 自分のタスク一覧を取得
   */
  getMyTasks(params) {
    return this.get('/my/tasks', params);
  }

  _sendRequest(params) {
    var url = this.base_url + params.path;
    var options = {
      method: params.method,
      headers: this.headers,
      payload: params.payload || {}
    };
    this.result = UrlFetchApp.fetch(url, options);

    // リクエストに成功していたら結果を解析して返す
    if (this.result.getResponseCode() == 200) {
      return JSON.parse(this.result.getContentText());
    }

    return false;
  }

  post(endpoint, post_data) {
    return this._sendRequest({
      method: 'post',
      path: endpoint,
      payload: post_data
    });
  }

  put(endpoint, put_data) {
    return this._sendRequest({
      method: 'put',
      path: endpoint,
      payload: put_data
    });
  }

  get(endpoint, get_data) {
    get_data = get_data || {};

    var path = endpoint;

    // get_dataがあればクエリーを生成する
    // かなり簡易的なので必要に応じて拡張する
    var query_string_list = [];
    for (var key in get_data) {
      query_string_list.push(encodeURIComponent(key) + '=' + encodeURIComponent(get_data[key]));
    }

    if (query_string_list.length > 0) {
      path += '?' + query_string_list.join('&');
    }

    return this._sendRequest({
      method: 'get',
      path: path
    });
  }
}
