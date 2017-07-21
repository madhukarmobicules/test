"use strict";

let Handlebars = require('handlebars');
let path = require('path');
let fs = require('fs');
let wkhtmltopdf = require('wkhtmltopdf');
let http = require('http');
let basePath = path.join(__dirname, '../lib/html');
class Renderer {
  _getTemplate(view) {
    let pdfPath = path.join(basePath, view);
    let indexHtml = fs.readFileSync(pdfPath).toString();

    return Handlebars.compile(indexHtml);
  }
  renderAndSave(template, reportName, data) {
    let horizontalView = data.horizontalView;

    data.viewsPath = basePath;
    var view = this._getTemplate(template)(data);
    return wkhtmltopdf(view, {
      orientation: horizontalView ? 'Landscape' : 'Portrait',
      pageSize: 'letter',
      T: '10mm',
      B: '10mm',
      // footerLeft: footer,
      // footerFontSize: 8
    });
  }
}

let RenderMaster = Renderer;

module.exports = RenderMaster;
