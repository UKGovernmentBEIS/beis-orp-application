import * as $ from 'jquery';

export default function init() {
  $('[data-module="ingest-action"]').each((i, item) => {
    const $el = $(item);
    if ($el.data('ingest-action-initialised')) {
      return;
    }
    $el.data('ingest-action-initialise', true);
    const selector = $el.find('input[name="uploadType"]');
    setAction();
    selector.on('change', setAction);

    function setAction() {
      const selectedValue = $el.find("input[name='uploadType']:checked").val();
      const action =
        selectedValue === 'urlInput' ? '/ingest/ingest-html' : '/ingest/upload';
      const enctype =
        selectedValue === 'urlInput' ? null : 'multipart/form-data';
      $el.attr('action', action);

      if (enctype) {
        $el.attr('enctype', enctype);
      } else {
        $el.removeAttr('enctype');
      }
    }
  });
}
