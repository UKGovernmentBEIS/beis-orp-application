#!/usr/bin/env node

// Use to generate 5 level topics object from csv
// The output will be written to 'src/server/document/utils/topics.ts'

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { parse } from "csv-parse";
import { compose, filter, groupBy, map, path as rPath, remove } from "ramda";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const OUTPUT_ROUTE = 'src/server/document/utils';
const TOPICS_OUTPUT = `${OUTPUT_ROUTE}/topics.ts`;
let output = [['', '', '', '', '']];

let mappings = [];

let unmapped = [];

let questions = [];

function doIt() {
  fs.createReadStream(
    path.resolve(__dirname, './orp_taxonomies/topic_id_mapping.csv'),
  )
    .pipe(parse({ delimiter: ',' }))
    .on('data', (csvrow) => {
      if(csvrow[2] !== 'path_id') {
        mappings.push({ id: csvrow[2], text: csvrow[1] });
      }
    })
    .on('end', () => {
      fs.writeFileSync(
        `${OUTPUT_ROUTE}/topics-display-mapping.ts`,
        `export const topicsDisplayMap = ${JSON.stringify(
          mappings.reduce((map, { id, text }) => ({ ...map, [id]: text }), {}),
          null,
        )}`,
        'utf-8',
      );
      generateTopicsJson();
    });
}

function generateTopicsJson() {
  fs.createReadStream(
    path.resolve(__dirname, './orp_taxonomies/taxonomies_transformed.csv'),
  )
    .pipe(parse({ delimiter: ',' }))
    .on('data', (csvrow) => {
      if (!csvrow.length || csvrow[0] === 'Taxonomy') return;

      const fullRow = [];

      csvrow.forEach((level, index) => {
        if (level) {
          const matchingMapping = mappings.filter(({ text }) => text === level);
          if (matchingMapping.length === 0) {
            unmapped.push(level);
            return fullRow.push(level);
          }

          if (matchingMapping.length === 1) {
            return fullRow.push(matchingMapping[0].id);
          }

          const deepMatch = matchingMapping.filter(({ id }) => {
            const path = id.slice(0, id.lastIndexOf('/'));
            return path === fullRow.at(-1);
          });

          if (deepMatch.length === 1) {
            return fullRow.push(deepMatch[0].id);
          }

          // MANUAL OVERRIDES FOR NON-STANDARD EXAMPLES
          if (
            fullRow.at(-1) === '/money/personal-tax/inheritance-tax' &&
            level === 'Reliefs'
          ) {
            return fullRow.push(
              '/money/personal-tax/personal-tax-inheritance-tax/reliefs',
            );
          }

          if (
            fullRow.at(-1) === '/money/personal-tax/inheritance-tax' &&
            level === 'Paying HMRC'
          ) {
            return fullRow.push(
              '/money/personal-tax/personal-tax-inheritance-tax/paying-hmrc',
            );
          }
          // END MANUAL OVERRIDES

          questions.push({
            message: `Update map for, ${fullRow.at(-1)} -> ${level}`,
            choices: matchingMapping.map(({ id }) => id),
          });
        }

        const rowItemsRemaining = csvrow.slice(index + 1, 5);
        if (rowItemsRemaining.find((item) => item)) {
          fullRow.push(output.at(-1).at(index));
        }
      });

      output.push(fullRow);
    })
    .on('end', () => {
      if (unmapped.length) {
        console.error('UNMAPPED:', unmapped);
        throw new Error('Unmapped taxonomies');
      }

      if (questions.length) {
        console.log(
          `--------MANUAL MAPPING REQUIRED FOR ${questions.length} ITEMS IN ${TOPICS_OUTPUT}----------- `,
        );
        questions.forEach(({ message, choices }) => {
          console.log(`${message}`);
          console.log(`OPTIONS: `);
          console.log(choices);
        });
      }

      const groupLevel = compose(
        map(filter((row) => row.length)),
        map(map(remove(0, 1))),
        groupBy((row) => row[0].trim()),
        map(filter((a) => a)),
      );

      const grouped = compose(
        map(map(map(map(groupLevel)))),
        map(map(map(groupLevel))),
        map(map(groupLevel)),
        map(groupLevel),
        groupLevel,
        remove(0, 2),
      )(output);

      fs.writeFileSync(
        `${OUTPUT_ROUTE}/topics.ts`,
        `export const topics = ${JSON.stringify(grouped, null)}`,
        'utf-8',
      );

      generateLeafMap(output, grouped)
    });
}

function generateLeafMap(listOfPaths, fullTopicsObject) {
  const map = listOfPaths.reduce((accum, list) => {
    const itemsAfterPath = rPath(list, fullTopicsObject)
    const isEndLeaf = itemsAfterPath && Object.keys(itemsAfterPath).length === 0
    if(!isEndLeaf) return accum

    return {
      ...accum,
      [list.at(-1)]: list
    }
  }, {})

  fs.writeFileSync(
    `${OUTPUT_ROUTE}/topics-leaf-map.ts`,
    `export const topicsLeafMap = ${JSON.stringify(map, null)}`,
    'utf-8',
  );
}

doIt();
