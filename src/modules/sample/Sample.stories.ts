import { mount } from '$storybook';
import { Converter } from '@akashic-extension/akashic-hover-plugin';
import { action } from '@storybook/addon-actions';
import { StoryObj, Meta } from '@storybook/html';
import { assetsSample1, createWithAsset } from '$assets';

type Props = g.SpriteParameterObject & {
  name: 'a' | 'ru';
};

const meta = {
  title: 'sample/Sample',
  render: mount((params) => {
    const sprite = createWithAsset(params.scene, g.Sprite, assetsSample1, params.name, {
      ...params,
      touchable: true,
    });
    Converter.asHoverable(sprite).hovered.add(action('hover'));
    sprite.onPointDown.add(action('pointDown'));

    return sprite;
  }),
} satisfies Meta<Props>;

export default meta;

type Story = StoryObj<Props>;

export const A: Story = {
  name: 'あ',
  args: {
    name: 'a',
  },
};

export const Ru: Story = {
  name: 'る',
  args: {
    name: 'ru',
  },
};
