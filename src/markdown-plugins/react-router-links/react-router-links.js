const reactRouterLinks = (md) => {
  const originalRenderer = md.renderer.rules.link_open;
  const regexp = {
    href: /href="([^"]*)"/
  };

  md.renderer.rules.link_open = function() {
    let originalResult = originalRenderer.apply(null, arguments);

    const hrefMatches = originalResult.match(regexp.href);
    if (hrefMatches) {
      let href = hrefMatches[1];
      href = href.replace(window.location.origin, '');

      const pathnameRegexp = new RegExp('^' + window.location.pathname + '$')
      if (pathnameRegexp.test(href)) {
        originalResult = originalResult.replace(/ href="/, ' class="active" href="');
      }
    }

    return originalResult.replace(regexp.href, 'href="$1" onclick="window.navigateTo(event, event.currentTarget.getAttribute(\'href\'))"'
    );
  };
};

module.exports = reactRouterLinks;
