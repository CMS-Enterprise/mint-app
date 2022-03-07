import React, { useRef } from 'react';
import axios from 'axios';
import { Base64 } from 'js-base64';
import escape from 'lodash';

import { downloadBlob } from 'utils/downloadFile';

import downloadSVG from './download.svg';

type PDFExportProps = {
  filename: string;
  title: string;
  children: React.ReactNode;
  label?: string;
};

function generatePDF(filename: string, content: string) {
  axios
    .request({
      url: `${process.env.REACT_APP_API_ADDRESS}/pdf/generate`,
      responseType: 'blob',
      method: 'POST',
      data: {
        html: Base64.encode(content),
        filename: 'input.html'
      }
    })
    .then(response => {
      const blob = new Blob([response.data], { type: 'application/pdf' });
      downloadBlob(filename, blob);
    })
    .catch(e => {
      // TODO add error handling: display a modal if things fail?
      console.error(e); // eslint-disable-line
    });
}

const downloadRefAsPDF = (
  title: string,
  filename: string,
  ref: React.RefObject<HTMLDivElement>
): void => {
  // Collect any stylesheets that are linked to. These are used in production.
  const { origin } = document.location;
  const stylesheetRequests = Array.prototype.slice
    .apply(document.styleSheets)
    .filter(
      // don't load google fonts stylesheets
      stylesheet => stylesheet.href && stylesheet.href.startsWith(origin)
    )
    .map(stylesheet => axios.get(stylesheet.href));

  // Also grab any inline styles, used predominantly in development.
  const styleBlocks = Array.prototype.slice
    .apply(document.querySelectorAll('style'))
    .map(node => node.innerText);

  // Combine external and inline styles
  Promise.all(stylesheetRequests)
    .then(stylesheets => {
      stylesheets.forEach(response => styleBlocks.push(response.data));

      const markupToRender = `<html lang="en">
        <head>
          <title>${escape(title)}</title>
          <style>
            ${styleBlocks.join('\n\n')}
          </style>
        </head>
        <body>
          <h1>
            ${escape(title)}
          </h1>
          ${ref && ref.current && ref.current.outerHTML}
        </body>
      </html>`;

      generatePDF(filename, markupToRender);
    })
    .catch(e => {
      console.error(e); // eslint-disable-line
      // TODO add error handling: display a modal if things fail?
    });
};

// PDFExport adds a "Download PDF" button to the screen. When this button is clicked,
// the HTML content of child elements is sent to the server and converted
// to PDF format.
const PDFExport = ({ title, filename, children, label }: PDFExportProps) => {
  const divEl = useRef<HTMLDivElement>(null);

  return (
    <div className="easi-pdf-export" ref={divEl}>
      {children}

      <div className="easi-pdf-export__controls">
        <button
          className="usa-button usa-button--unstyled easi-no-print"
          type="button"
          onClick={() => downloadRefAsPDF(title, filename, divEl)}
        >
          <img
            src={downloadSVG}
            alt=""
            aria-hidden="true"
            className="margin-right-1"
          />
          {label || 'Download PDF'}
        </button>
      </div>
    </div>
  );
};

export default PDFExport;
