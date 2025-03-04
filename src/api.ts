
export const url = {
  get_bot_list: `https://api.coze.cn/v1/space/published_bots_list`,
  conversation_created: "https://api.coze.cn/v1/conversation/create",
  message_list: "https://api.coze.cn/v1/conversation/message/list",
  chat: "https://api.coze.cn/v3/chat"
};

export function add_query_data(url_no_query: string, payload: Object): string{
  let url:string = url_no_query + '?';
  for (let b in payload) {
    url += `${b}=${(payload as any)[b]}&`
  }
  return url;
}

export const Access_Token =
  "pat_Kavi2jjX7cKxnSPjhd1lLJ82muWYnEpJm4EPc081CdYHX0MO3HB0cI7d0TgmUiT1";

export const api_config = {
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${Access_Token}`,
  },
};
