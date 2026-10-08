// Shared legacy product URLs use the site's language cookie, as in Django.
document.cookie = 'django_language='+document.documentElement.lang+';path=/;SameSite=Lax';
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  document.querySelectorAll('video').forEach(video => {video.autoplay=false;video.pause();});
  // Register after the source's ready handlers so initialized sliders stop autoplay.
  const stopSliders = () => document.querySelectorAll('.slider').forEach(slider => window.M?.Slider.getInstance(slider)?.pause());
  if (window.jQuery) window.jQuery(stopSliders);
  else document.addEventListener('DOMContentLoaded', stopSliders, {once:true});
}
// Labels and keyboard equivalents do not change the source's visible copy.
document.querySelectorAll('input[id],select[id],textarea[id]').forEach(field => {
  const label = document.querySelector('label[for="' + CSS.escape(field.id) + '"]');
  if (!label && !field.getAttribute('aria-label') && field.type !== 'hidden') {
    const nearby = field.parentElement?.querySelector('label');
    if (nearby) nearby.htmlFor = field.id;
  }
});
document.querySelectorAll('[onclick],a:not([href])').forEach(element => {
  if (!element.matches('a[href],button,input,select,textarea')) {
    element.tabIndex = 0;
    element.setAttribute('role','button');
    element.addEventListener('keydown', event => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault();element.click(); } });
  }
});
