import * as $ from 'jquery';

export default function init() {
  const togglePasswordDisplay = (passwordField) => (event) => {
    if (passwordField.type === 'password') {
      passwordField.type = 'text';
      event.target.innerHTML =
        'Hide <span class="govuk-visually-hidden">password</span>';
    } else {
      passwordField.type = 'password';
      event.target.innerHTML =
        'Show <span class="govuk-visually-hidden">password</span>';
    }
  };

  function createButton(container, passwordField) {
    const button = $(
      '<button type="button" class="govuk-button govuk-button--secondary password-reveal__button govuk-!-margin-left-2 govuk-!-margin-bottom-0">Show <span class="govuk-visually-hidden">password</span></button>',
    );
    container.append(button);
    button.on('click', togglePasswordDisplay(passwordField));
  }

  $('[data-module="password-reveal"]').each((i, item) => {
    const $el = $(item);
    if ($el.data('password-reveal-initialised')) {
      return;
    }

    $el.data('password-reveal-initialised', true);
    $el.attr('spellcheck', 'false');

    $el.wrap('<div class="password-reveal"></div>');
    const container = $el.parent();
    createButton(container, item);
  });
}
