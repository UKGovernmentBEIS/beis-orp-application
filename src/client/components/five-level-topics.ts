import * as $ from 'jquery';
import { topicsDisplayMap } from '../../server/document/utils/topics-display-mapping';
import { topics } from '../../server/document/utils/topics';

export default function init() {
  $('[data-module="five-topics-select"]').each((i, item) => {
    const $el = $(item);
    if ($el.data('five-topics-select-initialised')) {
      return;
    }
    $el.data('five-topics-select-initialised', true);

    const $submitBtn = $("button[type='submit']");
    $submitBtn.attr('disabled', 'true');

    const $topicsInPlace = $el.find('select');

    $topicsInPlace.on('change', updateDropDowns);

    if ($topicsInPlace.length > 1) {
      const values = $el.find('select').map(function () {
        return $(this).val();
      });
      const nextTopics = getTopicsForNextDropdown(values);
      if (!nextTopics) {
        $submitBtn.removeAttr('disabled');
      }
    }

    function updateDropDowns() {
      const $formGroup = $(this).closest('.govuk-form-group');
      const thisValue = $(this).val();

      const previousValues = $($formGroup)
        .prevAll('.govuk-form-group')
        .find('select')
        .map(function () {
          return $(this).val();
        });

      const topicsSelected = [...previousValues, thisValue];
      const nextTopics = getTopicsForNextDropdown(topicsSelected);

      if (nextTopics) {
        $submitBtn.attr('disabled', 'true');
        $formGroup.nextAll('.govuk-form-group').remove();
        const $nextSelect = getNextSelect(
          topicsSelected.length + 1,
          nextTopics,
        );
        $formGroup.after($nextSelect);
        $nextSelect.find('select').on('change', updateDropDowns);
      } else {
        $submitBtn.removeAttr('disabled');
      }
    }

    function getNextSelect(topicNumber, topics) {
      const topicName = `topic${topicNumber}`;
      const newGroup = $(
        '<div class="govuk-form-group">' +
          '  <label class="govuk-label" for="' +
          topicName +
          '">' +
          '    Topic Level ' +
          topicNumber +
          '  </label>' +
          '  <select class="govuk-select govuk-!-width-two-thirds" id="' +
          topicName +
          '" name="' +
          topicName +
          '">' +
          '  </select>' +
          '</div>',
      );
      const $newSelect = newGroup.find('select');

      $newSelect.append(
        $('<option>', {
          value: '',
          text: 'Choose',
          disabled: 'true',
          selected: 'true',
          hidden: 'true',
        }),
      );
      topics.forEach((topic) => {
        $newSelect.append(
          $('<option>', {
            value: topic,
            text: topicsDisplayMap[topic],
          }),
        );
      });

      return newGroup;
    }
    function getTopicsForNextDropdown(
      prevTopics,
      topicsObject = topics,
    ): string[] | null {
      const [nextTopic, ...rest] = prevTopics;
      const nextItems = Object.keys(topicsObject[nextTopic]);
      if (nextItems.length === 0) {
        return null;
      }
      if (rest.length === 0) {
        return nextItems;
      }
      return getTopicsForNextDropdown(rest, topicsObject[nextTopic]);
    }
  });
}
