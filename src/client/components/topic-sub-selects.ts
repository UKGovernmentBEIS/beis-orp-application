import * as $ from 'jquery';
import { topics } from '../../server/document/utils/topics';
import { topicsDisplayMap } from '../../server/document/utils/topics-display-mapping';

function setSecondaryOptions(primarySel, secondarySel, firstLoad) {
  return () => {
    secondarySel.empty();
    const selectedPrimary = primarySel
      .find('option:selected')
      .first()
      .val() as string;

    const secondaryTopics = topics[selectedPrimary]
      ? ['all', ...Object.keys(topics[selectedPrimary])]
      : ['all'];

    const urlParams = new URLSearchParams(window.location.search);

    secondaryTopics.forEach((topic) => {
      secondarySel.append(
        $('<option>', {
          value: topic,
          text: topic === 'all' ? 'All' : topicsDisplayMap[topic],
          selected: firstLoad && urlParams.get('topic2') === topic,
        }),
      );
    });
  };
}
export default function init() {
  $('[data-module="topic-sub-selects"]').each((i, item) => {
    const $el = $(item);
    if ($el.data('topic-sub-selects-initialised')) {
      return;
    }
    $el.data('topic-sub-selects-initialised', true);

    const formGroup = $el.closest('div.govuk-form-group');
    const newGroup = $(
      '<div class="govuk-form-group">' +
        '  <label class="govuk-label" for="topic2">' +
        '    Secondary Topic' +
        '  </label>' +
        '  <select class="govuk-select govuk-!-width-full" id="select-topic2" name="topic2">' +
        '  </select>' +
        '</div>',
    );
    const newSelect = newGroup.find('select');

    setSecondaryOptions($el, newSelect, true)();
    $el.on('change', setSecondaryOptions($el, newSelect, false));

    newGroup.insertAfter(formGroup);
  });
}
