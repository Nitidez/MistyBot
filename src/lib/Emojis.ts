import rawEmojis from '@/json/emj';

type EmojiNames = keyof typeof rawEmojis;

interface EmojiInfo {
  id: string;
  animated: boolean;
}

class EmojiWrapper {
  private emojis: Record<EmojiNames, EmojiInfo>;

  constructor(emojis: Record<string, EmojiInfo>) {
    this.emojis = emojis;
  }

  getEmoji(name: EmojiNames): string {
    const emj = this.emojis[name];
    return `<${emj.animated ? "a" : ""}:${name}:${emj.id}>`
  }
}

const emojis = new EmojiWrapper(rawEmojis);

const emojiProxy: Record<EmojiNames, string> = new Proxy({} as any, {
  get(_, prop: string) {
    return emojis.getEmoji(prop as EmojiNames);
  },
});

export {emojiProxy as Emojis};