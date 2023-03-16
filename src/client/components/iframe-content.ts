import * as $ from 'jquery';

export default function init() {
  $('[data-module="iframe-content"]').each((i, item: any) => {
    const $el = $(item);
    if ($el.data('copy-content-initialised')) {
      return;
    }
    $el.data('copy-content-initialise', true);
    const frameSrc = $el.attr('src');

    const reloadIframe = () => {
      setTimeout(() => {
        if (item.contentDocument) {
          item.src = null;
          item.src = frameSrc;
          reloadIframe();
        }
      }, 2000);
    };

    reloadIframe();
  });
}
