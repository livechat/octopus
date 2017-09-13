// This plugin replaces "gs://(...)" image paths to its conterpart
// loaded from firebase storage API
const googleStorageImages = (md) => {
  const originalImgRenderer = md.renderer.rules.image;
  md.renderer.rules.image = function() {
    let originalResult = originalImgRenderer.apply(null, arguments);
    return loadGoogleStorageImage(originalResult);
  };

  const originalHtmlTagRenderer = md.renderer.rules.htmltag;
  md.renderer.rules.htmltag = function() {
    let originalResult = originalHtmlTagRenderer.apply(null, arguments);
    if (/^<img /.test(originalResult)) {
      return loadGoogleStorageImage(originalResult);
    } else {
      return originalResult;
    }
  }
};

const loadGoogleStorageImage = (s) => {
  return s.replace(/src="([^"]*)"/, (s, src) => {
    if (/^gs:/.test(src)) {
      s += ' onerror="firebase.storage().refFromURL(this.src).getDownloadURL().then((url) => this.src = url)"';
    }
    return s;
  });
}

module.exports = googleStorageImages;
