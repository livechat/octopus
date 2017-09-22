import flowchart from 'flowchart.js';

export default (md, options) => {
  const cachedFlowchart = {};
  const getLine = (state, line) => {
    var pos = state.bMarks[line] + state.blkIndent,
        max = state.eMarks[line];

    return state.src.substr(pos, max - pos);
  }

  md.block.ruler.before('code', 'flowchart', (state, startLine, endLine) => {
    if (getLine(state, startLine) === '[flowchart]') {
      let startPgn = startLine + 1;
      let nextLine = startPgn;
      while (nextLine < endLine) {
        if (getLine(state, nextLine) === '[/flowchart]') {
          state.tokens.push({
            type: 'flowchart',
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

  md.renderer.rules.flowchart = (tokens, idx) => {
    const content = tokens[idx].content;
    const id = `flowchart-${Math.random()}`;
    let error = '';
    let parsedFlowchart = '';

    try {
      parsedFlowchart = flowchart.parse(content);
      cachedFlowchart[idx] = parsedFlowchart;
    } catch (e) {
      error = `<p class="syntax-error">⚠️ Syntax error - diagram not rendered</p>`;
      parsedFlowchart = cachedFlowchart[idx] || '';
    }

    // is there a way to invoke this in a callback?
    // didn't find a way...
    setTimeout(() => {
      try {
        parsedFlowchart.drawSVG(id);
      } catch (e) {}
    }, 0);

    return `<div class="markdown-diagram" id="${id}">${error}</div>`;
  };
};
