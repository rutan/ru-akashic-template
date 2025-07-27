import type { Meta, StoryObj } from '@storybook/html';
import { action } from 'storybook/actions';
import { mount } from '$storybook';
import { SampleSprite } from './SampleSprite';

type Props = g.SpriteParameterObject & {
  name: 'a' | 'ru';
};

const meta = {
  title: 'sample/sprites/SampleSprite',
  render: mount((params) => {
    action;
    const sprite = new SampleSprite({
      ...params,
      x: g.game.width / 2,
      y: g.game.height / 2,
    });
    sprite.listener.on(action('event'));

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
