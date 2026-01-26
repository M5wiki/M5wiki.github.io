var dialog = require('dialog');
var wifi = require('wifi');
var display = require('display');
var keyboard = require('keyboard');

var tftWidth = display.width();
var tftHeight = display.height();

var request = { body: '' };

/**
 * Draws the window frame and header, clears the display, and shows a "loading..." indicator.
 *
 * The title is centered at the top and will be truncated to 20 characters if longer.
 * A rounded rectangle is drawn as the window border and the display is cleared before drawing.
 *
 * @param {string} title - The window title to display (truncated to 20 characters if longer).
 */
function drawWindow(title) {
  display.fill(0);
  display.drawRoundRect(
    5,
    5,
    tftWidth - 10,
    tftHeight - 10,
    5,
    BRUCE_PRICOLOR
  );
  display.setTextSize(2);
  display.setTextAlign('center', 'top');
  display.drawText(
    title.length > 20 ? title.substring(0, 20) : title,
    tftWidth / 2,
    5
  );
  display.setTextAlign('left', 'top');
  display.drawText('loading...', 20, 40);
}

var textViewer = dialog.createTextViewer(request.body, {
  fontSize: 1,
  startX: 10,
  startY: 25,
  width: tftWidth - 2 * 10,
  height: tftHeight - 25 - 10,
  indentWrappedLines: true,
});

var history = [];

/**
 * Load the given webpage, convert it to plain text, and display it in the window and text viewer.
 *
 * Fetches a text representation of the page for the provided URL, updates the global request body,
 * pushes the URL onto navigation history, and refreshes the on-screen viewer. On fetch error,
 * the request body is set to the string "error\n\n".
 * @param {string} url - The full URL to load (including scheme, e.g. "https://example.com").
 */
function goToPage(url) {
  console.log(url);
  drawWindow(url.substring(url.indexOf('://') + 3));
  textViewer.clear();
  try {
    request = wifi.httpFetch(
      'https://www.w3.org/services/html2txt?url='.concat(
        url,
        '&noinlinerefs=on&endrefs=on'
      ),
      {
        method: 'GET',
      }
    );
  } catch (error) {
    console.log(JSON.stringify(error));
    request.body = 'error\n\n';
  }
  history.push(url);
  textViewer.setText(request.body);
}

/// TODO: Используйте storage.write('browser.js', 'https://newsite.com,\n ', 'append', '// вставьте веб-сайты сюда') для добавления новых веб-сайтов.
/// https://raw.githubusercontent.com/(имя пользователя или организация)/(название репозитории)/(имя ветки)/(файл)
//  Файл может быть либо в формате txt или html.
var websites = [
  'https://raw.githubusercontent.com/Fynex-x/Fynex-x/main/text.html',
  'https://raw.githubusercontent.com/Fynex-x/Fynex-x/main/text.txt',
  // вставляйте сюда сайты
];

/**
 * Show a dialog letting the user pick one of the configured websites, "Cancel", or "Quit".
 *
 * The dialog labels each website by its host (URL without the scheme). If a request is active,
 * a "Cancel" option is included. A "Quit" option is always included.
 * @returns {string} The full URL selected from the websites list, or the string "Cancel", or the string "Quit".
 */
function selectWebsite() {
  drawWindow('Select Website');
  var websitesChoice = {};
  for (var index = 0; index < websites.length; index++) {
    var website = websites[index];
    websitesChoice[website.substring(website.indexOf('://') + 3)] = website;
  }
  if (request.status) {
    websitesChoice['Cancel'] = 'Cancel';
  }
  websitesChoice['Quit'] = 'Quit';
  return dialog.choice(websitesChoice);
}

/**
 * Build a selectable index of non-indented lines from the current text view and prompt the user to pick one.
 * Populates a choice list with each non-empty, non-leading-space line mapped to its line index, adds a "Cancel" option,
 * and shows a dialog for selection.
 * @returns {number} The chosen line index, or -1 if the user selected "Cancel".
 */
function selectSection() {
  var websitesSections = {};
  var getMaxLines = textViewer.getMaxLines();
  for (var index = 0; index < getMaxLines; index++) {
    var textVieverLine = textViewer.getLine(index);
    if (textVieverLine[0] !== ' ' && textVieverLine.length) {
      websitesSections[textVieverLine] = String(index);
    }
  }
  websitesSections['Cancel'] = 'Cancel';
  var choice = dialog.choice(websitesSections);
  return choice === 'Cancel' ? -1 : parseInt(choice, 10);
}

/**
 * Drive the interactive text-browser UI: prompt for a site, load pages, and handle user commands and navigation.
 *
 * Presents a website selector, loads the chosen page, and enters an event loop that responds to keyboard input:
 * - Opens a choice dialog of visible links and actions (Go To Selection, Go Back, Select Website, Cancel, Quit).
 * - Navigates to a selected link, which is extracted from the current page text when a numbered link option is chosen.
 * - Supports jumping to a section, scrolling up/down, going back through history, switching sites, and quitting the application.
 *
 * The function performs UI updates and loads pages via goToPage(url); it returns control only when the user quits.
 */
function main() {
  var _a;
  var url = selectWebsite();
  if (url === 'Quit') {
    return;
  }
  goToPage(url);
  while (true) {
    if (keyboard.getSelPress()) {
      var visibleText = textViewer.getVisibleText();
      var choicesMatch = [];
      choicesMatch.push('Go To Selection');
      choicesMatch.push.apply(
        choicesMatch,
        visibleText.match(/\[\d+\][^\s\[,\]]*/g) || []
      );
      choicesMatch.push('Go Back');
      choicesMatch.push('Select Website');
      choicesMatch.push('Cancel');
      choicesMatch.push('Quit');
      var choice = dialog.choice(choicesMatch);
      if (choice === 'Quit') {
        break;
      }
      if (choice === 'Cancel') {
        drawWindow(url.substring(url.indexOf('://') + 3));
        continue;
      }
      if (choice === 'Go Back') {
        if (history.length > 1) {
          history.pop();
          var newUrl = history.pop();
          if (newUrl) {
            url = newUrl;
            console.log('url:', url);
            goToPage(url);
          }
        }
        drawWindow(url.substring(url.indexOf('://') + 3));
        continue;
      }
      if (choice === 'Go To Selection') {
        var line = selectSection();
        drawWindow(url.substring(url.indexOf('://') + 3));
        if (line === -1) {
          continue;
        }
        console.log('Go to line:', line);
        textViewer.scrollToLine(line);
        continue;
      }
      var chosenUrl = '';
      if (choice === 'Select Website') {
        chosenUrl = selectWebsite();
        if (chosenUrl === 'Cancel') {
          drawWindow(url.substring(url.indexOf('://') + 3));
          continue;
        }
        if (chosenUrl === 'Quit') {
          return;
        }
      } else {
        // Магия TypeScript. Этот синтаксис: choice.match(/\d+/)?.[0] был преобразован в следующее:
        // Необязательная цепочка не поддерживается в bruce js (сейчас)
        var searchTextIndex = request.body.indexOf(
          ' ' +
            ((_a = choice.match(/\d+/)) === null || _a === void 0
              ? void 0
              : _a[0]) +
            '. http'
        );
        var searchedUrl = request.body.substring(
          searchTextIndex,
          request.body.indexOf('\n', searchTextIndex + 1)
        );
        chosenUrl = searchedUrl.substring(searchedUrl.indexOf('.') + 2);
      }
      if (chosenUrl !== '') {
        url = chosenUrl;
        goToPage(chosenUrl);
      }
    }
    if (keyboard.getPrevPress()) {
      textViewer.scrollUp();
    }
    if (keyboard.getNextPress()) {
      textViewer.scrollDown();
    }
    textViewer.draw();
    delay(100);
  }
}
main();