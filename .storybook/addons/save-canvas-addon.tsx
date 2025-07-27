import { CameraIcon } from '@storybook/icons';
// biome-ignore lint/correctness/noUnusedImports: vite-react 入れてないので省略不可
import React from 'react';
import { IconButton } from 'storybook/internal/components';
import { addons, types, useStorybookApi } from 'storybook/manager-api';

function saveCanvas(storyName: string) {
  const iframe = document.querySelector<HTMLIFrameElement>('#storybook-preview-iframe');
  if (!iframe || !iframe.contentDocument) {
    alert('iframeが見つかりません');
    return;
  }
  const canvas = iframe.contentDocument.querySelector('canvas');
  if (!canvas) {
    alert('canvasが見つかりません');
    return;
  }

  const now = new Date();
  const filename = `${[
    now.getFullYear(),
    '-',
    String(now.getMonth() + 1).padStart(2, '0'),
    '-',
    String(now.getDate()).padStart(2, '0'),
    '_',
    String(now.getHours()).padStart(2, '0'),
    '-',
    String(now.getMinutes()).padStart(2, '0'),
    '-',
    String(now.getSeconds()).padStart(2, '0'),
  ].join('')}_${storyName}.png`;

  const url = canvas.toDataURL('image/png');
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
}

export function setupCanvasAddon() {
  addons.register('akashic/save-canvas-addon', () => {
    addons.add('akashic/save-canvas-addon/button', {
      type: types.TOOL,
      title: 'Save Canvas',
      match: ({ viewMode }) => viewMode === 'story',
      render: () => {
        const api = useStorybookApi();
        const data = api.getCurrentStoryData();
        const name = data?.id || 'story';

        return (
          <IconButton
            type="button"
            onClick={() => {
              saveCanvas(name);
            }}
          >
            <CameraIcon />
          </IconButton>
        );
      },
    });
  });
}
