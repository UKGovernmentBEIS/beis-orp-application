import * as $ from 'jquery';

export default function init() {
  $('[data-module="show-hide"]').each((i, item) => {
    const $el = $(item);
    if ($el.data('show-hide-initialised')) {
      return;
    }
    $el.data('show-hide-initialised', true);
    $el.text('Show');
    $el.on('click', () => {
      if ($el.text() === 'Show') {
        $el.text('Hide');
      } else {
        $el.text('Show');
      }
    });
  });
}
