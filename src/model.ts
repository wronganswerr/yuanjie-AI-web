export interface SpaceBots {
  bot_id: string;
  bot_name: string;
  description: string;
  icon_url: string;
  publish_time: string;
}

export interface Message {
  bot_id: string;
  chat_id: string;
  content: string;
  content_type: "text" | "image" | "audio" | "video"; // 可以扩展为其他类型
  conversation_id: string;
  created_at: number; // 时间戳，代表消息创建时间
  id: string;
  meta_data: Record<string, any>; // 可扩展的元数据
  role: "user" | "bot"; // 用户或机器人
  type: string; // 消息类型，视情况定制
  updated_at: string; // 更新时间，可能与创建时间不同
  section_id: string;
}

export interface ChatObject {
  id: string;
}
