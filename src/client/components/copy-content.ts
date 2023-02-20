import * as $ from 'jquery';

export default function init() {
  $('[data-module="copy-content"]').each((i, item) => {
    const $el = $(item);
    if ($el.data('copy-content-initialised')) {
      return;
    }
    $el.data('copy-content-initialise', true);
    const copyText = $el.text().trim();

    const copyLink = $(`<a href="#" class="govuk-link">Copy</a>`);
    $el.append(copyLink);

    copyLink.on('click', (event) => {
      event.preventDefault();
      navigator.clipboard.writeText(copyText);
    });
  });
}
