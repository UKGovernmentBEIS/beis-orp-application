import * as $ from 'jquery';

export default function init() {
  const getCounterText = (selects) => {
    let count = 0;

    selects.each((i, item) => {
      const selected = $(item).find('option:selected');

      if (selected && selected.val() !== 'all') {
        count++;
      }
    });
    return `${count} selected`;
  };

  $('[data-module="count-selections"]').each((i, item) => {
    const $el = $(item);
    if ($el.data('count-selections-initialised')) {
      return;
    }
    $el.data('count-selections-initialised', true);

    const details = $el.children('details')[0];
    const selects = $el.find('select');

    const counter = $(
      `<p class="govuk-hint govuk-!-font-size-16">${getCounterText(
        selects,
      )}</p>`,
    );
    $(details).before(counter);

    selects.on('change', () => counter.text(getCounterText(selects)));
  });
}
