import * as $ from 'jquery';

export default function init() {
  $('[data-module="ingest-action"]').each((i, item) => {
    const $el = $(item);
    if ($el.data('ingest-action-initialised')) {
      return;
    }
    $el.data('ingest-action-initialise', true);
    const selector = $el.find('input[name="uploadType"]');
    selector.on('change', function () {
      const action =
        $(this).val() === 'urlInput' ? '/ingest/ingest-html' : '/ingest/upload';
      const enctype =
        $(this).val() === 'urlInput' ? null : 'multipart/form-data';
      $el.attr('action', action);

      if (enctype) {
        $el.attr('enctype', enctype);
      } else {
        $el.removeAttr('enctype');
      }
    });
  });
}
