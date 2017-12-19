/**
 * The following licence and copyright applies to the SVG icon contained in this
 * source file, which is from https://github.com/danklammer/bytesize-icons
 *
 * The MIT License (MIT)
 *
 * Copyright (c) 2016 Dan Klammer
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

import coookies from './coookies';

let previewToken = null;
let experimentToken = null;
let baseURL = null;
let target = null;
let authed = null;

// Tidy up edit links and "added" flags
function removeLinks() {
  document.querySelectorAll('[data-wio-added]').forEach((el) => {
    el.removeChild(el.querySelector('.wio-link'));
    delete el.dataset.wioAdded;
  });
}

// Add edit links wherever we haven't already
function addLinks() {
  document.querySelectorAll('[data-wio-id]:not([data-wio-added])').forEach((el) => {
    const documentId = el.dataset.wioId;
    const url = (() => {
      if (previewToken) {
        return `${baseURL}/app/documents/${documentId}/preview/${encodeURIComponent(previewToken)}`;
      } else if (experimentToken) {
        const value = experimentToken.split(' ');
        const experimentId = value[0];
        const variationId = value[1];
        return `${baseURL}/app/documents/${documentId}/experiments/${encodeURIComponent(experimentId)}/variations/${encodeURIComponent(variationId)}`;
      }
      return `${baseURL}/app/documents/${documentId}/ref`;
    })();

    const button = (() => {
      const btn = document.createElement('a');
      btn.className = 'wio-link';
      btn.setAttribute('target', target);
      btn.setAttribute('href', url);

      btn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M30,7L25,2 5,22 3,29 10,27ZM21,6L26,11ZM5,22L10,27Z"/></svg>';

      return btn;
    })();

    el.insertBefore(button, el.firstChild);

    // Flag that we have added a link here
    el.dataset.wioAdded = true;
  });
}

// Check auth status and add or remove edit links
function setup(endpoint) {
  if (baseURL) {
    // Have set up in the past; clear any existing links
    removeLinks();
  }

  previewToken = coookies.getPreviewToken();
  experimentToken = coookies.getExperimentToken();
  const matches = endpoint.match(new RegExp('(https?://([^/]*))'));
  if (!matches) {
    baseURL = null;
    target = null;
    return;
  }
  baseURL = matches[1].replace(/\.cdn\.prismic\.io/, '.prismic.io');
  target = matches[2].replace(/\.cdn\.prismic\.io/, '.prismic.io');

  fetch(`${baseURL}/app/authenticated/v2`, {
    credentials: 'include',
  }).then((response) => {
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.indexOf('application/json') !== -1) {
      response.json().then((json) => {
        if (json.userId) {
          authed = true;
          addLinks();
        } else {
          authed = false;
          removeLinks();
        }
      });
    } else {
      authed = false;
    }
  }).catch(() => {
    authed = false;
  });
}

// If authed, add edit links to any appropriate new DOM nodes
function update() {
  if (!authed) return;
  addLinks();
}

export default {
  setup,
  update,
};
