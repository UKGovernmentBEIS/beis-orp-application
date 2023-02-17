import * as $ from 'jquery';

export default function init() {
  const getSelectedText = (inputBoxes) => {
    let selected = false;
    inputBoxes.each((i, item) => {
      if ($(item).val()) {
        selected = true;
        return false;
      }
    });
    return selected ? 'Selected' : 'Not selected';
  };

  $('[data-module="display-selected"]').each((i, item) => {
    const $el = $(item);
    if ($el.data('display-selected')) {
      return;
    }
    const details = $el.children('details')[0];
    const inputBoxes = $(details).find('input');
    const display = $(
      `<p class="govuk-hint govuk-!-font-size-16">${getSelectedText(
        inputBoxes,
      )}</p>`,
    );
    $(details).before(display);

    inputBoxes.each((i, item) => {
      $(item).on('change', () => display.text(getSelectedText(inputBoxes)));
    });
  });
}
