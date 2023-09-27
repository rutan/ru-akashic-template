import { Converter } from '@akashic-extension/akashic-hover-plugin';
import { Story } from '@kudohamu/storybook-akashic';
import { action } from '@storybook/addon-actions';
import { assetsSample1, createWithAsset } from '$assets';

export default {
  title: 'sample/Sample',
};

const Template: Story<g.SpriteParameterObject> = (params) => {
  const sprite = createWithAsset(params.scene, g.Sprite, assetsSample1, 'ru', {
    ...params,
    touchable: true,
  });
  Converter.asHoverable(sprite).hovered.add(action('hover'));
  sprite.onPointDown.add(action('pointDown'));

  return sprite;
};

export const Default = Template.bind({});
