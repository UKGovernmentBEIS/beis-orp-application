import * as $ from 'jquery';

export default function init() {
  const getCounterText = (name) =>
    `${$(`input[name=${name}]:checkbox:checked`).length} items selected`;

  $('[data-module="count-selections"]').each((i, item) => {
    const $el = $(item);
    if ($el.data('count-selections-initialised')) {
      return;
    }
    const details = $el.children('details')[0];

    const checkBoxes = $(details).find('input.govuk-checkboxes__input');
    const name = $(checkBoxes[0]).attr('name');

    const counter = $(`<p>${getCounterText(name)}</p>`);
    $(details).before(counter);

    checkBoxes.on('change', () => counter.text(getCounterText(name)));
  });
}
