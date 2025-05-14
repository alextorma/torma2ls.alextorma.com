import { cardCreation } from './bookmarklets/cardCreation.js'
import { ffFlip } from './bookmarklets/ffFlip.js'
import { upsellUpdate } from './bookmarklets/upsellUpdate.js'

const getIIFE = code => code.toString().slice(code.toString().indexOf('\n') + 1, code.toString().lastIndexOf('\n')).trim();
const minify = (code, mangle) => Babel.transform(code, {
  comments: false,
  compact: true,
  minified: true,
  sourceMaps: false
}).code;
const prefix = code => `javascript:void ${code}`;
const urlencode = code => code.replace(new RegExp(['%', '"', '<', '>', '#', '@', ' ', '\\&', '\\?'].join('|'), 'g'), encodeURIComponent);
const bookmarklet = (code) => {
  let result = minify(getIIFE(code), false);
  if ('' === result
    .replace(/^"use strict";/, '')
    .replace(/^void function\(\){}\(\);$/, ''))
    return null;
  return urlencode(prefix(result));
};

export const bookmarkletsFuncs = {
  createCards: {
    func: getIIFE(cardCreation),
    bmark: bookmarklet(cardCreation),
  },
  flipFF: {
    func: getIIFE(ffFlip),
    bmark: bookmarklet(ffFlip),
  },
  updateUpsell: {
    func: getIIFE(upsellUpdate),
    bmark: bookmarklet(upsellUpdate)
  }
};