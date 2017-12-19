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

import Cookies from './cookies';
import Config from './config';

function setup() {
  const previewToken = Cookies.getPreviewToken();
  const experimentToken = Cookies.getExperimentToken();

  fetch(`${Config.baseURL}/app/authenticated/v2`, {
    credentials: 'include',
  }).then(response => {
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.indexOf('application/json') !== -1) {
      response.json().then(json => {
        if (json.userId) {
          document.querySelectorAll('.wio-link').forEach(el => {
            el.parentNode.removeChild(el);
          });

          document.querySelectorAll('[data-wio-id]').forEach(el => {
            const documentId = el.dataset.wioId;
            const url = (() => {
              if (previewToken) {
                return `${Config.baseURL}/app/documents/${documentId}/preview/${encodeURIComponent(previewToken)}`;
              } else if (experimentToken) {
                const value = experimentToken.split(' ');
                const experimentId = value[0];
                const variationId = value[1];
                return `${Config.baseURL}/app/documents/${documentId}/experiments/${encodeURIComponent(experimentId)}/variations/${encodeURIComponent(variationId)}`;
              }
              return `${Config.baseURL}/app/documents/${documentId}/ref`;
            })();

            const button = (() => {
              const btn = document.createElement('a');
              btn.className = 'wio-link';
              btn.setAttribute('target', Config.editorTab);
              btn.setAttribute('href', url);

              btn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M30,7L25,2 5,22 3,29 10,27ZM21,6L26,11ZM5,22L10,27Z"/></svg>';

              return btn;
            })();

            el.insertBefore(button, el.firstChild);
          });
        }
      });
    }
  }).catch(() => {});
}

export default {
  setup,
};
