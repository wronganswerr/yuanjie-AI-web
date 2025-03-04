import { createStore } from "vuex";
const store = createStore({
  state() {
    return {
      bot_conversation_map: new Map(),
    };
  },
  getters: {
    get_latest_conversation_id: (state) => (bot_id: string) => {
      return state.bot_conversation_map.get(bot_id);
    }
  },
  mutations: {
    init_bot_conversation_map(state) {
      state.bot_conversation_map.clear();
      let serialized:string|null = localStorage.getItem("bot_conversation_map");
      if (serialized != null) {
        state.bot_conversation_map = new Map(JSON.parse(serialized));
      } else {
        state.bot_conversation_map = new Map();
      }
    },
    update_bot_conversation_map(
      state,
      { bot_id, conversation_id }: { bot_id: string; conversation_id: string }
    ) {
      state.bot_conversation_map.set(bot_id, conversation_id);
      // 持久化到本地
      console.log(state.bot_conversation_map);
      localStorage.setItem(
        "bot_conversation_map",
        JSON.stringify(Array.from(state.bot_conversation_map))
      );
    },
  },
});

export default store;
