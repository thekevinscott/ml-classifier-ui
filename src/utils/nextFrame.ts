const nextFrame = () => new Promise(resolve => {
  window.requestAnimationFrame(() => resolve());
});
export default nextFrame;
