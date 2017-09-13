class Utils {
  getTimestamp() {
    return Math.round(new Date().getTime() / 1000);
  }
}

export default new Utils();
