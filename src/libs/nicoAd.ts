import { NicoadHistories } from '@atsumaru/api-types';
import { getAtsumaruApi } from './environments';

/**
 * ニコニ広告情報の取得
 * @param offsetAdId
 */
export function fetchNicoAdHistories(offsetAdId?: number): Promise<NicoadHistories> {
  const api = getAtsumaruApi();
  if (!api) {
    return Promise.resolve({
      remainingCount: 0,
      serverTime: 0,
      histories: [],
    });
  }

  return api.nicoad.getHistories(offsetAdId);
}

/**
 * ニコニ広告バーのパラメータ
 */
interface NicoAdBarViewerParameter {
  title: string;
  fontFamily?: string;
  backgroundColor: string;
  textColor: string;
  scrollSpeed: number;
  scrollTimeMax: number;
}

/**
 * ニコニ広告バー
 */
class NicoAdBarViewer {
  private readonly _title: string;
  private readonly _fontFamily: string;
  private readonly _backgroundColor: string;
  private readonly _textColor: string;
  private readonly _scrollSpeed: number;
  private readonly _scrollTimeMax: number;

  private _element!: HTMLDivElement;
  private _barElement!: HTMLDivElement;
  private _titleElement!: HTMLDivElement;
  private _messageElement!: HTMLDivElement;
  private _messageTextElement!: HTMLDivElement;

  constructor(options: NicoAdBarViewerParameter) {
    this._title = options.title;
    this._fontFamily = options.fontFamily || 'sans-serif';
    this._backgroundColor = options.backgroundColor;
    this._textColor = options.textColor;
    this._scrollSpeed = options.scrollSpeed;
    this._scrollTimeMax = options.scrollTimeMax;

    this._createElement();
  }

  get element() {
    return this._element;
  }

  private _createElement() {
    this._element = this._createLayerElement();
    document.body.appendChild(this._element);

    this._barElement = this._createBarElement();
    this._element.appendChild(this._barElement);
    this._titleElement = this._createTitleElement();
    this._barElement.appendChild(this._titleElement);
    this._messageElement = this._createMessageElement();
    this._barElement.appendChild(this._messageElement);
    this._messageTextElement = this._createMessageTextElement();
    this._messageElement.appendChild(this._messageTextElement);

    this.resetStyle();
  }

  private _createLayerElement() {
    const element = document.createElement('div');
    element.id = 'nicoko-layer';
    element.classList.add('nicoko-layer');
    element.style.position = 'absolute';
    element.style.top = '0';
    element.style.left = '0';
    element.style.right = '0';
    element.style.bottom = '0';
    element.style.margin = 'auto';
    element.style.zIndex = '10';
    element.style.overflow = 'hidden';
    element.style.pointerEvents = 'none';
    element.style.fontFamily = this._fontFamily;
    return element;
  }

  private _createBarElement() {
    const element = document.createElement('div');
    element.classList.add('nicoko-bar');
    element.style.position = 'absolute';
    element.style.left = '0';
    element.style.width = '100%';
    element.style.height = '2em';
    element.style.overflow = 'hidden';
    element.style.background = this._backgroundColor;
    element.style.color = this._textColor;
    element.style.opacity = '0';
    element.style.transition = 'all ease-in-out .5s';
    return element;
  }

  private _createTitleElement() {
    const element = document.createElement('div');
    element.classList.add('nicoko-title');
    element.style.position = 'absolute';
    element.style.top = '0';
    element.style.lineHeight = `${2 / 0.8}em`;
    element.style.padding = '0 10px';
    element.style.fontSize = '0.8em';
    element.style.fontWeight = 'bold';
    element.style.transition = 'left ease-in-out .5s 1s, transform ease-in-out .5s 1s';
    element.innerText = this._title;
    return element;
  }

  private _createMessageElement() {
    const element = document.createElement('div');
    element.classList.add('nicoko-message');
    element.style.position = 'absolute';
    element.style.top = '0';
    element.style.right = '0';
    element.style.height = '2em';
    element.style.overflow = 'hidden';
    return element;
  }

  private _createMessageTextElement() {
    const element = document.createElement('div');
    element.classList.add('nicoko-message-text');
    element.style.whiteSpace = 'pre';
    element.style.position = 'absolute';
    element.style.top = '0';
    element.style.lineHeight = `${2 / 0.8}em`;
    element.style.fontSize = '0.8em';
    element.style.padding = '0 10px';
    element.addEventListener('transitionend', this._onTextTransitionEnd.bind(this));
    return element;
  }

  resetStyle() {
    this._barElement.style.bottom = '-2em';
    this._barElement.style.opacity = '0';

    this._titleElement.style.left = '50%';
    this._titleElement.style.transform = 'translateX(-50%)';

    this._messageElement.style.width = '0';

    this._messageTextElement.style.transition = 'initial';
    this._messageTextElement.style.left = '100%';
    this._messageTextElement.style.transform = 'translateX(0%)';
  }

  showMessage(message: string) {
    this._barElement.style.bottom = '0';
    this._barElement.style.opacity = '1';

    this._titleElement.style.left = '0';
    this._titleElement.style.transform = 'translateX(0)';

    const rect = this._titleElement.getBoundingClientRect();
    this._messageElement.style.width = `calc(100% - ${rect.width}px)`;

    this._messageTextElement.innerText = message;
    this._messageTextElement.style.visibility = 'hidden';

    const scrollTime = Math.min(this._messageTextElement.clientWidth / this._scrollSpeed, this._scrollTimeMax);

    window.setTimeout(() => {
      this._messageTextElement.style.visibility = 'visible';
      this._messageTextElement.style.left = '0';
      this._messageTextElement.style.transform = 'translateX(-100%)';
      this._messageTextElement.style.transition = `left linear ${scrollTime}s 2s, transform linear ${scrollTime}s 2s`;
    }, 1);
  }

  private _onTextTransitionEnd() {
    this.resetStyle();
  }
}

/**
 * ニコニ広告バーの表示パラメータ
 */
export interface NicoAdBarParameter extends NicoAdBarViewerParameter {
  itemFormat: string;
  message: string;
}

/**
 * ニコニ広告バーの表示を開始
 */
export function showNicoAdBar(options: NicoAdBarParameter) {
  if (typeof window === 'undefined') return;

  const viewer = new NicoAdBarViewer(options);
  document.body.append(viewer.element);

  window.setTimeout(() => {
    fetchNicoAdHistories().then((resp) => {
      const newItems = resp.histories.reduce((ret, item) => {
        const obj = ret.find((n) => n.advertiserName === item.advertiserName);
        if (obj) {
          obj.adPoint += item.adPoint;
        } else {
          ret.push(item);
        }
        return ret;
      }, [] as { advertiserName: string; adPoint: number }[]);

      if (newItems.length === 0) return;

      const message = [
        newItems
          .sort((a, b) => b.adPoint - a.adPoint)
          .map((item) =>
            options.itemFormat.replace(/%(\d+)/g, (_, n) => {
              const id = Number.parseInt(n);
              switch (id) {
                case 1:
                  return item.advertiserName;
                case 2:
                  return item.adPoint.toString();
              }
              return '';
            })
          )
          .join(' / '),
        options.message,
      ].join(' ');

      viewer.showMessage(message);
    });
  }, 0);
}
