import { Converter } from '@akashic-extension/akashic-hover-plugin';
import type { Meta, StoryObj } from '@storybook/html';
import { action } from 'storybook/actions';
import { assetsSample1, createWithAsset } from '$assets';
import { mount } from '$storybook';

type Props = g.SpriteParameterObject & {
  name: 'a' | 'ru';
};

const meta = {
  title: 'sample/Sample',
  render: mount((params) => {
    action;
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
