import Viz from 'viz.js';
import './diagram.css';

export default (md, options) => {
  const cachedHtml = {};
  const getLine = (state, line) => {
    var pos = state.bMarks[line] + state.blkIndent,
        max = state.eMarks[line];

    return state.src.substr(pos, max - pos);
  }

  md.block.ruler.before('code', 'diagram', (state, startLine, endLine) => {
    if (getLine(state, startLine) === '[diagram]') {
      let startPgn = startLine + 1;
      let nextLine = startPgn;
      while (nextLine < endLine) {
        if (getLine(state, nextLine) === '[/diagram]') {
          state.tokens.push({
            type: 'diagram',
            content: state.getLines(startPgn, nextLine, state.blkIndent, true),
            block: true,
            lines: [ startLine, nextLine ],
            level: state.level
          });
          state.line = nextLine + 1;
          return true;
        }
        nextLine ++;
      }
    }
  });

  md.renderer.rules.diagram = (tokens, idx) => {
    const content = tokens[idx].content;

    let html = '';
    try {
      html = Viz(content);
      html = html.replace(/<a /g, '<a onclick="window.navigateTo(event, event.currentTarget.getAttribute(\'xlink:href\'))"');
      cachedHtml[idx] = html;
    } catch (e) {
      html = cachedHtml[idx];
    }

    return `<div class="markdown-diagram">${html}</div>`;
  };
};
