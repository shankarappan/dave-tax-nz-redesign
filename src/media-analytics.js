// Install once, outside React effects. Never include enquiry text, email addresses or query strings.
export function installMediaAnalytics(measurementId) {
  if (window.__clientMediaAnalytics) return;
  window.__clientMediaAnalytics = true;
  const emit = (name, fields = {}) => {
    if (typeof window.gtag === 'function') window.gtag('event', name, {
      ...(measurementId ? { send_to: measurementId } : {}),
      page_path: location.pathname, ...fields,
    });
  };
  document.addEventListener('click', event => {
    const a = event.target.closest?.('a');
    if (!a) return;
    const url = new URL(a.href, location.href);
    const destination = ['davetaxnz.nz','mplaw.nz'].includes(url.hostname) ? url.hostname : undefined;
    let name = a.dataset.event;
    if (!name && url.protocol === 'tel:') name = 'call_click';
    if (!name && url.protocol === 'mailto:') name = 'email_click';
    if (!name && /(^|\.)wa\.me$|whatsapp\.com$/.test(url.hostname)) name = 'whatsapp_click';
    if (!name && destination && destination !== location.hostname) name = 'cross_site_click';
    if (!name && url.hostname === 'players.brightcove.net') name = 'three_news_click';
    if (name) emit(name, destination ? { destination_site: destination } : {});
  });
  // Native video events use the existing owner-controlled analytics stream.
  const nativeStarts = new WeakSet();
  const nativeMilestones = new WeakMap();
  const nativeFields = video => {
    const source = video.currentSrc || video.querySelector('source')?.src || video.src;
    return { video_id: new URL(source, location.href).pathname, video_provider: 'html5' };
  };
  document.addEventListener('play', event => {
    const video = event.target;
    if (video.tagName !== 'VIDEO' || nativeStarts.has(video)) return;
    nativeStarts.add(video);
    emit('media_video_start', nativeFields(video));
  }, true);
  document.addEventListener('timeupdate', event => {
    const video = event.target;
    if (video.tagName !== 'VIDEO' || !Number.isFinite(video.duration) || video.duration <= 0) return;
    const marks = nativeMilestones.get(video) || new Set();
    nativeMilestones.set(video, marks);
    [25, 50, 75].forEach(mark => {
      if (video.currentTime / video.duration * 100 >= mark && !marks.has(mark)) {
        marks.add(mark);
        emit('media_video_progress', { ...nativeFields(video), video_percent: mark });
      }
    });
  }, true);
  document.addEventListener('ended', event => {
    if (event.target.tagName === 'VIDEO') emit('media_video_complete', nativeFields(event.target));
  }, true);

  const attach = () => {
    if (!window.YT?.Player) return;
    document.querySelectorAll('iframe[src*="youtube-nocookie.com/embed/"]').forEach(iframe => {
      if (iframe.dataset.analyticsReady) return;
      iframe.dataset.analyticsReady = 'true';
      const videoId = new URL(iframe.src).pathname.split('/').pop();
      let started = false, timer;
      const milestones = new Set();
      new window.YT.Player(iframe, { events: {
        onStateChange(event) {
          clearInterval(timer);
          if (event.data === 1) {
            if (!started) { emit('media_video_start', { video_id: videoId, video_provider: 'youtube' }); started = true; }
            timer = setInterval(() => {
              const duration = event.target.getDuration();
              const percentage = duration ? event.target.getCurrentTime() / duration * 100 : 0;
              [25,50,75].forEach(mark => {
                if (percentage >= mark && !milestones.has(mark)) {
                  milestones.add(mark); emit('media_video_progress', { video_id: videoId, video_percent: mark });
                }
              });
            }, 1000);
          } else if (event.data === 0) emit('media_video_complete', { video_id: videoId });
        },
      }});
    });
  };
  const observer = new MutationObserver(() => {
    if (!document.querySelector('iframe[src*="youtube-nocookie.com/embed/"]')) return;
    if (window.YT?.Player) { attach(); return; }
    if (document.querySelector('script[data-media-youtube-api]')) return;
    const previous = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => { previous?.(); attach(); };
    const script = document.createElement('script');
    script.src = 'https://www.youtube.com/iframe_api';
    script.dataset.mediaYoutubeApi = 'true';
    document.head.append(script);
  });
  observer.observe(document.getElementById('root'), { childList: true, subtree: true });
}
