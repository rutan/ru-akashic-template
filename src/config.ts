interface Config {
  game: {
    launch_mode: 'ranking' | 'multi';
  };
  storage: {
    gameKey: string;
  };
}

export const config: Config = {
  /** ゲームに関する設定 */
  game: {
    /** ニコ生プレイ時のモード（ ranking / multi ） */
    launch_mode: 'ranking',
  },
  /** セーブデータに関する設定（1人プレイ専用） */
  storage: {
    /**
     * セーブデータ用 localStorage の key につけるプレフィックス
     * 同一ドメインのサイトで他のゲームのセーブデータと混ざらないようにするために使用します
     */
    gameKey: 'game',
  },
};
