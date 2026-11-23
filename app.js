(() => {
  'use strict';
  const cfg = window.GEM_CONFIG;
  const $ = (selector, root = document) => root.querySelector(selector);
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const motionAllowed = () => cfg.presentation?.animations !== false && !reducedMotion.matches;
  const openingEligible = () => cfg.opening?.enabled !== false && motionAllowed();
  const openingAutoRequested = document.documentElement.dataset.opening === 'pending' && openingEligible() && cfg.opening?.autoplay !== false;
  let openingActive = false;
  if (!openingAutoRequested) { clearTimeout(window.gemOpeningFallback); delete document.documentElement.dataset.opening; }
  const runningAnimations = new Set();
  document.documentElement.dataset.motion = motionAllowed() ? 'on' : 'off';
  function motion(node, keyframes, options = {}) {
    if (!node || !motionAllowed() || !node.animate) return;
    node.getAnimations().forEach(animation => animation.cancel());
    const animation = node.animate(keyframes, { duration: 350, easing: 'cubic-bezier(.22,.75,.25,1)', fill: 'both', ...options });
    runningAnimations.add(animation);
    animation.finished.then(() => { runningAnimations.delete(animation); animation.cancel(); }, () => runningAnimations.delete(animation));
    return animation;
  }
  function onceVisible(node, callback) {
    const observer = new IntersectionObserver(entries => {
      if (!entries.some(entry => entry.isIntersecting)) return;
      observer.disconnect(); callback();
    }, { threshold: .18 });
    observer.observe(node);
  }
  const total = result => result.auto + result.manual;
  const trialCount = cfg.evaluation.automaticTrials + cfg.evaluation.manualTrials;
  function element(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }
  // One vector asset supplies the favicon, brand mark, and skill gems.
  // Facets are a visual identity device, not scientific measurements.
  function gemMark(tone = 'jade') {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 120 112'); svg.setAttribute('aria-hidden', 'true'); svg.setAttribute('focusable', 'false');
    svg.classList.add('gem-mark'); svg.dataset.tone = tone;
    for (const part of ['gem-outline', ...Array.from({ length: 8 }, (_, i) => `facet-${i}`), 'cut-lines']) {
      const use = document.createElementNS('http://www.w3.org/2000/svg', 'use');
      use.setAttribute('href', `${cfg.identity.gemAsset}#${part}`);
      use.setAttribute('class', part.startsWith('facet-') ? 'gem-facet' : part);
      svg.append(use);
    }
    return svg;
  }
  function assembleGem(svg, animate = motion) {
    const offsets = [[-9, -8], [-3, -13], [3, -13], [9, -8], [0, -10], [-10, 6], [0, 12], [10, 6]];
    svg?.querySelectorAll('.gem-facet').forEach((facet, i) => animate(facet,
      [{ opacity: 0, transform: `translate(${offsets[i][0]}px, ${offsets[i][1]}px)` }, { opacity: 1, transform: 'none' }],
      { duration: 620, delay: i * 45 }));
  }
  const skillTone = index => cfg.identity.skillTones[index % cfg.identity.skillTones.length] || 'jade';
  document.querySelectorAll('[data-gem]').forEach(node => node.append(gemMark()));
  document.querySelector('link[rel="icon"]').href = cfg.identity.gemAsset;
  function readPath(path) { return path.split('.').reduce((value, key) => value?.[key], cfg); }
  document.querySelectorAll('[data-copy]').forEach(node => { node.textContent = readPath(node.dataset.copy) ?? ''; });
  document.querySelectorAll('[data-media]').forEach(node => { node.src = cfg.media[node.dataset.media]; });
  document.title = `${cfg.paper.acronym} — ${cfg.paper.title}`;
  $('.paper-acronym').replaceChildren(...Array.from(cfg.paper.acronym, letter => element('span', 'logo-letter', letter)));
  $('#authors').classList.toggle('is-pending', cfg.paper.authorsPending);
  cfg.paper.authors.forEach((author, index) => {
    if (index) $('#authors').append(document.createTextNode(', '));
    const name = element(author.url ? 'a' : 'span', '', author.name);
    if (author.url) name.href = author.url;
    $('#authors').append(name);
    if (author.affiliation) $('#authors').append(element('sup', '', author.affiliation));
  });
  $('#affiliations').textContent = cfg.paper.affiliations.join(' · ');

  const resourceLabels = { paper: 'Paper', arxiv: 'arXiv', code: 'Code', supplementary: 'Supplementary' };
  function resource(key, hero = false) {
    const link = element('a', hero ? 'resource-button' : 'resource-item');
    const url = cfg.paper.links[key];
    if (url) { link.href = url; }
    else { link.setAttribute('aria-disabled', 'true'); link.setAttribute('role', 'link'); link.title = `${resourceLabels[key]} link to be added with the public release`; }
    if (hero) {
      const icon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      icon.setAttribute('viewBox', '0 0 20 20'); icon.setAttribute('aria-hidden', 'true');
      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path.setAttribute('d', key === 'code' ? 'm6 5-4 5 4 5m8-10 4 5-4 5M12 3 8 17' : 'M5 2h7l4 4v12H5ZM12 2v5h4M8 11h5M8 14h5');
      icon.append(path); link.append(icon, document.createTextNode(resourceLabels[key]));
      if (!url) link.append(element('small', '', 'Soon'));
    } else {
      link.append(document.createTextNode(resourceLabels[key]), element('span', '', url ? 'Open resource ↗' : 'Coming soon'));
    }
    return link;
  }
  ['paper', 'arxiv', 'code'].forEach(key => $('#hero-resources').append(resource(key, true)));
  Object.keys(resourceLabels).forEach(key => $('#resource-list').append(resource(key)));

  // Both bars depict reported aggregate rates. Motion changes their presentation, never their values.
  $('#hero-success-rate').textContent = `${cfg.results.gem.rate.toFixed(1)}%`;
  for (const key of ['gem', 'base']) {
    const result = cfg.results[key];
    const row = element('div', `hero-bar ${key === 'base' ? 'baseline' : ''}`);
    const heading = element('div', 'hero-bar-heading');
    heading.append(element('span', '', key === 'gem' ? 'GEM' : 'Base Agent'), element('strong', '', `${result.rate.toFixed(1)}%`));
    const track = element('div', 'hero-bar-track'); track.setAttribute('aria-hidden', 'true');
    const fill = element('span', 'hero-bar-fill'); fill.style.width = `${result.rate}%`;
    track.append(fill); row.append(heading, track); $('#hero-chart').append(row);
  }
  const scale = element('div', 'chart-scale'); scale.setAttribute('aria-hidden', 'true');
  ['0%', '50%', '100%'].forEach(value => scale.append(element('span', '', value)));
  $('#hero-chart').append(scale);
  onceVisible($('.hero-heading'), () => {
    document.fonts.ready.then(() => {
      if (openingAutoRequested || openingActive) return;
      assembleGem($('.hero-gem .gem-mark'));
      document.querySelectorAll('.logo-letter').forEach((letter, index) => motion(letter,
        [{ opacity: 0 }, { opacity: 1 }],
        { duration: 500, delay: 100 + index * 65 }));
      motion($('.paper-title'), [{ opacity: 0, transform: 'translateY(8px)' }, { opacity: 1, transform: 'none' }], { duration: 550, delay: 140 });
      motion($('.hero-evidence'), [{ opacity: 0 }, { opacity: 1 }], { duration: 500, delay: 150 });
      document.querySelectorAll('.hero-bar-fill').forEach((fill, index) => motion(fill,
        [{ transform: 'scaleX(0)' }, { transform: 'scaleX(1)' }], { duration: 950, delay: 250 + index * 120 }));
    });
  });

  function showMediaError(container) {
    if (container.querySelector('.media-error')) return;
    const message = element('div', 'media-error');
    message.setAttribute('role', 'status');
    message.append(element('p', '', 'This video is currently unavailable. Please try again later.'));
    container.append(message);
  }
  const pauseOffscreen = new IntersectionObserver(entries => {
    entries.forEach(entry => { if (!entry.isIntersecting) entry.target.pause(); });
  }, { threshold: 0 });
  function videoPlayer(media, label, { autoplay = false, preload = 'none' } = {}) {
    const container = element('div', 'player');
    container.style.height = '100%';
    if (!media.video) {
      const placeholder = element('div', 'media-placeholder');
      if (media.image || media.poster) { const img = element('img'); img.src = media.image || media.poster; img.alt = label; placeholder.append(img); }
      placeholder.append(element('strong', '', 'Video to be added'));
      container.append(placeholder); return container;
    }
    const video = element('video');
    video.controls = true; video.muted = true; video.defaultMuted = true; video.loop = true; video.playsInline = true;
    video.preload = preload; video.poster = media.poster || ''; video.src = media.video;
    video.setAttribute('aria-label', label);
    video.append(document.createTextNode('Your browser does not support HTML video.'));
    video.addEventListener('play', () => document.querySelectorAll('video').forEach(other => { if (other !== video) other.pause(); }));
    video.addEventListener('error', () => showMediaError(container));
    container.append(video); pauseOffscreen.observe(video);
    if (autoplay && !reducedMotion.matches && !navigator.connection?.saveData) {
      video.autoplay = true;
      video.play().catch(() => {});
    }
    return container;
  }
  $('#hero-media').append(videoPlayer(cfg.media.hero, `${cfg.copy.heroCaption}. ${cfg.copy.heroDetail}`, { autoplay: cfg.media.hero.autoplay && !openingAutoRequested, preload: 'metadata' }));
  reducedMotion.addEventListener('change', event => {
    document.documentElement.dataset.motion = motionAllowed() ? 'on' : 'off';
    if (event.matches) {
      runningAnimations.forEach(animation => animation.cancel());
      document.querySelectorAll('video').forEach(v => v.pause());
    }
  });
  // Figure 3 is the paper's own artwork, annotated with independent animation layers.
  const framework = $('#framework');
  const frameworkSteps = cfg.framework.steps;
  const stepDuration = Math.max(1000, cfg.framework.stepDuration || 6500);
  const compactFramework = window.matchMedia('(max-width: 700px)');
  const frameworkAnimations = new Set();
  let frameworkSvg = null;
  let frameworkStep = 0;
  let frameworkMode = 'overview';
  let frameworkPlaying = false;
  let frameworkComplete = false;
  let frameworkTimer = null;
  let frameworkStarted = 0;
  let frameworkRemaining = stepDuration;
  let frameworkHasTimeline = false;
  let frameworkFailed = false;
  let frameworkVisible = false;
  let frameworkAutoplayPending = cfg.framework.autoplay !== false;
  let frameworkAutoResume = false;

  function cancelFrameworkAutoplay() {
    frameworkAutoplayPending = false; frameworkAutoResume = false;
  }
  // A manual choice takes precedence, including while the SVG is still loading.
  framework.addEventListener('click', cancelFrameworkAutoplay, { capture: true });
  framework.addEventListener('keydown', event => {
    if (['Enter', ' ', 'ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) cancelFrameworkAutoplay();
  }, { capture: true });

  function resetFrameworkTimeline() {
    clearTimeout(frameworkTimer); frameworkTimer = null;
    frameworkAnimations.forEach(animation => animation.cancel());
    frameworkAnimations.clear(); frameworkHasTimeline = false;
  }
  function frameworkAnimation(node, frames, options) {
    if (!node || !motionAllowed()) return;
    const animation = node.animate(frames, { duration: 500, easing: 'cubic-bezier(.22,.75,.25,1)', fill: 'both', ...options });
    frameworkAnimations.add(animation); runningAnimations.add(animation);
    animation.finished.then(() => runningAnimations.delete(animation), () => runningAnimations.delete(animation));
    return animation;
  }
  function positionFrameworkView() {
    const stage = frameworkSteps[frameworkStep];
    const focused = frameworkMode === 'focus';
    if (frameworkSvg) frameworkSvg.setAttribute('viewBox', (compactFramework.matches && focused ? stage.viewBox : cfg.framework.viewBox).join(' '));
    const [x,y,w,h] = stage.viewBox;
    $('#framework-viewport').style.setProperty('--panel-aspect', String(h/w));
    const [, ,fullWidth, fullHeight] = cfg.framework.viewBox;
    const focus = $('#framework-map-focus');
    Object.assign(focus.style, { left: `${x/fullWidth*100}%`, top: `${y/fullHeight*100}%`, width: `${w/fullWidth*100}%`, height: `${h/fullHeight*100}%` });
    $('#framework-map').hidden = !compactFramework.matches || !focused || !frameworkSvg;
    $('#framework-hotspots').hidden = compactFramework.matches && focused;
  }
  function updateFrameworkControls() {
    framework.dataset.playing = String(frameworkPlaying);
    framework.dataset.mode = frameworkMode;
    framework.dataset.step = String(frameworkStep);
    const play = $('#framework-play');
    play.hidden = !motionAllowed() || frameworkFailed;
    play.disabled = !frameworkSvg;
    $('span', play).textContent = !frameworkSvg ? 'Loading animation…' : frameworkPlaying ? 'Pause' : frameworkComplete ? 'Replay animation' : frameworkHasTimeline ? 'Resume' : 'Play animation';
    $('path', play).setAttribute('d', frameworkPlaying ? 'M4 3h3v10H4ZM9 3h3v10H9Z' : 'm5 3 7 5-7 5Z');
    $('#framework-prev').disabled = frameworkMode === 'overview' || frameworkStep === 0;
    $('#framework-next').disabled = frameworkMode === 'focus' && frameworkStep === frameworkSteps.length - 1;
    $('#framework-overview').setAttribute('aria-pressed', String(frameworkMode === 'overview'));
  }
  function renderFrameworkStep() {
    const focused = frameworkMode === 'focus';
    const stage = frameworkSteps[frameworkStep];
    const copy = focused ? stage : cfg.framework.overview;
    $('#framework-detail-title').textContent = copy.title;
    $('#framework-detail-body').textContent = copy.body;
    $('#framework-deeper').href = `#method-${focused ? stage.detailTarget : 'exploration'}`;
    $('#framework-status').textContent = focused ? `Step ${frameworkStep + 1} of ${frameworkSteps.length}: ${stage.title}.` : 'Complete original framework figure.';
    $('#framework-steps').querySelectorAll('button').forEach((button,index) => {
      button.setAttribute('aria-pressed', String(focused && index === frameworkStep));
      $('.framework-step-progress span', button).style.transform = `scaleX(${focused && index < frameworkStep ? 1 : 0})`;
    });
    $('#framework-hotspots').querySelectorAll('button').forEach((button,index) => {
      button.setAttribute('aria-pressed', String(focused && index === frameworkStep));
    });
    frameworkSvg?.querySelectorAll('[data-panel]').forEach(panel => panel.dataset.current = String(panel.dataset.panel === stage.id));
    frameworkSvg?.querySelectorAll('[data-connector]').forEach(connector => connector.dataset.current = String(stage.connectors.includes(connector.dataset.connector)));
    positionFrameworkView(); updateFrameworkControls();
  }
  function animateFrameworkArtwork() {
    const stage = frameworkSteps[frameworkStep];
    const speed = Math.min(1, stepDuration / 5000);
    const panel = frameworkSvg.querySelector(`[data-panel="${stage.id}"]`);
    panel.querySelectorAll('[data-motion]').forEach(layer => {
      const options = { delay: (Number(layer.dataset.at) + 300) * speed, duration: Number(layer.dataset.duration) * speed };
      if (layer.dataset.motion === 'draw') {
        layer.querySelectorAll('path').forEach(path => {
          const length = path.getTotalLength();
          frameworkAnimation(path, [{ strokeDasharray: `${length}`, strokeDashoffset: `${length}` }, { strokeDasharray: `${length}`, strokeDashoffset: '0' }], { ...options, easing: 'linear' });
        });
      } else {
        const frames = layer.dataset.motion === 'nudge'
          ? [{ opacity: 0, transform: 'translateX(-5px)' }, { opacity: 1, transform: 'none' }]
          : [{ opacity: 0 }, { opacity: 1 }];
        frameworkAnimation(layer, frames, options);
      }
    });
    stage.connectors.forEach(id => {
      const connector = frameworkSvg.querySelector(`[data-connector="${id}"]`);
      frameworkAnimation(connector, [{ opacity: .1 }, { opacity: 1 }], { duration: 600 * speed });
      connector.querySelectorAll('path[fill="none"]').forEach(path => {
        const length = path.getTotalLength();
        frameworkAnimation(path, [{ strokeDasharray: `${length}`, strokeDashoffset: `${length}` }, { strokeDasharray: `${length}`, strokeDashoffset: '0' }], { duration: 800 * speed, easing: 'linear' });
      });
    });
    const fill = $(`[data-step="${frameworkStep}"] .framework-step-progress span`, $('#framework-steps'));
    frameworkAnimation(fill, [{ transform: 'scaleX(0)' }, { transform: 'scaleX(1)' }], { duration: stepDuration, easing: 'linear' });
    frameworkHasTimeline = true;
  }
  function pauseFramework() {
    if (frameworkPlaying) frameworkRemaining = Math.max(0, frameworkRemaining - (performance.now() - frameworkStarted));
    frameworkPlaying = false; clearTimeout(frameworkTimer); frameworkTimer = null;
    frameworkAnimations.forEach(animation => { if (animation.playState === 'running') animation.pause(); });
    updateFrameworkControls();
  }
  function scheduleFrameworkStep() {
    frameworkStarted = performance.now();
    frameworkTimer = setTimeout(() => {
      resetFrameworkTimeline();
      if (frameworkStep === frameworkSteps.length - 1) {
        frameworkAutoResume = false;
        frameworkPlaying = false; frameworkComplete = true; frameworkMode = 'overview';
        renderFrameworkStep();
        $('#framework-status').textContent = 'Animation complete. Showing the original framework in full.';
        return;
      }
      frameworkStep++; frameworkRemaining = stepDuration;
      renderFrameworkStep(); animateFrameworkArtwork(); scheduleFrameworkStep();
    }, frameworkRemaining);
  }
  function selectFrameworkStep(index) {
    pauseFramework(); resetFrameworkTimeline();
    frameworkStep = index; frameworkRemaining = stepDuration; frameworkComplete = false; frameworkMode = 'focus';
    renderFrameworkStep();
  }
  function showFrameworkOverview() {
    pauseFramework(); resetFrameworkTimeline();
    frameworkMode = 'overview'; frameworkRemaining = stepDuration; frameworkComplete = false;
    renderFrameworkStep();
  }
  frameworkSteps.forEach((stage,index) => {
    const item = element('li'); const button = element('button');
    button.type = 'button'; button.dataset.step = String(index); button.setAttribute('aria-controls', 'framework-viewport framework-detail');
    const number = element('span', 'framework-step-number', String(index+1).padStart(2,'0')); number.setAttribute('aria-hidden','true');
    const progress = element('span', 'framework-step-progress'); progress.setAttribute('aria-hidden','true'); progress.append(element('span'));
    button.append(number, element('span', 'framework-step-label', stage.label), progress);
    button.addEventListener('click', () => selectFrameworkStep(index)); item.append(button); $('#framework-steps').append(item);
    const hotspot = element('button', 'framework-hotspot'); hotspot.type = 'button';
    hotspot.dataset.panel = stage.id; hotspot.setAttribute('aria-label', `View stage ${index+1}: ${stage.title}`);
    hotspot.setAttribute('aria-controls','framework-detail');
    const [x,y,w,h] = stage.viewBox; const [,,fullWidth,fullHeight] = cfg.framework.viewBox;
    Object.assign(hotspot.style, { left:`${x/fullWidth*100}%`, top:`${y/fullHeight*100}%`, width:`${w/fullWidth*100}%`, height:`${h/fullHeight*100}%` });
    hotspot.addEventListener('click', () => selectFrameworkStep(index)); $('#framework-hotspots').append(hotspot);
  });
  function playFramework() {
    if (frameworkPlaying || !frameworkSvg || !motionAllowed() || document.hidden) return;
    if (frameworkMode === 'overview') { frameworkStep = 0; frameworkRemaining = stepDuration; frameworkComplete = false; frameworkMode = 'focus'; renderFrameworkStep(); }
    frameworkPlaying = true;
    if (!frameworkHasTimeline) animateFrameworkArtwork();
    else frameworkAnimations.forEach(animation => { if (animation.playState === 'paused') animation.play(); });
    updateFrameworkControls(); scheduleFrameworkStep();
  }
  function maybeAutoplayFramework() {
    if ((!frameworkAutoplayPending && !frameworkAutoResume) || !frameworkVisible || !frameworkSvg || frameworkFailed || frameworkPlaying) return;
    if (!motionAllowed() || document.hidden || openingActive || document.documentElement.hasAttribute('data-opening') || $('#figure-dialog').open) return;
    frameworkAutoplayPending = false; frameworkAutoResume = true;
    playFramework();
  }
  $('#framework-play').addEventListener('click', () => {
    if (frameworkPlaying) pauseFramework();
    else playFramework();
  });
  $('#framework-prev').addEventListener('click', () => selectFrameworkStep(Math.max(0, frameworkStep-1)));
  $('#framework-next').addEventListener('click', () => selectFrameworkStep(frameworkMode === 'overview' ? 0 : Math.min(frameworkSteps.length-1, frameworkStep+1)));
  $('#framework-overview').addEventListener('click', showFrameworkOverview);
  $('#framework-map').addEventListener('click', showFrameworkOverview);
  $('#framework-steps').addEventListener('keydown', event => {
    if (!['ArrowLeft','ArrowRight','Home','End'].includes(event.key)) return;
    const buttons = [...$('#framework-steps').querySelectorAll('button')]; const current = buttons.indexOf(document.activeElement);
    if (current < 0) return; event.preventDefault();
    const index = event.key === 'Home' ? 0 : event.key === 'End' ? buttons.length-1 : (current + (event.key === 'ArrowRight' ? 1 : -1) + buttons.length) % buttons.length;
    buttons[index].focus(); selectFrameworkStep(index);
  });
  const loadFramework = new IntersectionObserver(async entries => {
    if (!entries.some(entry => entry.isIntersecting)) return;
    loadFramework.disconnect();
    try {
      const response = await fetch(cfg.media.methodAnimated);
      if (!response.ok) throw new Error('Framework asset unavailable');
      const doc = new DOMParser().parseFromString(await response.text(), 'image/svg+xml');
      if (doc.querySelector('parsererror') || doc.documentElement.localName !== 'svg') throw new Error('Invalid framework SVG');
      if (!frameworkSteps.every(stage => doc.querySelector(`[data-panel="${stage.id}"]`))) throw new Error('Missing figure layers');
      frameworkSvg = document.importNode(doc.documentElement, true);
      $('#framework-vector').append(frameworkSvg); framework.dataset.ready = 'true';
      renderFrameworkStep();
      maybeAutoplayFramework();
    } catch {
      frameworkSvg = null; frameworkFailed = true;
      framework.dataset.ready = 'false'; renderFrameworkStep();
      $('#framework-status').textContent = 'Animation unavailable. The original figure and stage explanations remain available.';
    }
  }, { rootMargin: '400px' });
  loadFramework.observe(framework);
  new IntersectionObserver(entries => {
    const entry = entries[entries.length - 1];
    frameworkVisible = entry.isIntersecting && entry.intersectionRatio >= .25;
    if (!entry.isIntersecting) pauseFramework();
    else maybeAutoplayFramework();
  }, { threshold: [0, .25], rootMargin: '-80px 0px 0px 0px' }).observe($('#framework-viewport'));
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) pauseFramework();
    else maybeAutoplayFramework();
  });
  window.addEventListener('pagehide', () => { cancelFrameworkAutoplay(); pauseFramework(); });
  compactFramework.addEventListener('change', positionFrameworkView);
  reducedMotion.addEventListener('change', () => {
    if (!motionAllowed()) { cancelFrameworkAutoplay(); pauseFramework(); resetFrameworkTimeline(); frameworkRemaining = stepDuration; }
    renderFrameworkStep();
  });
  renderFrameworkStep();
  // The opening illustration becomes the real hero mark and title; no duplicate title screen.
  const opening = $('#opening');
  const openingCfg = cfg.opening;
  const openingDuration = Math.max(4000, Number(openingCfg.duration) || 8200);
  const openingScene = $('#gem-mining-scene');
  const openingToggle = $('#opening-toggle');
  const openingReplay = $('#intro-replay');
  const openingFlight = $('#opening-flight');
  const svgNode = (tag, attributes = {}) => {
    const node = document.createElementNS('http://www.w3.org/2000/svg', tag);
    Object.entries(attributes).forEach(([key, value]) => node.setAttribute(key, value));
    return node;
  };
  openingFlight.append(gemMark());
  const openingGem = svgNode('g', { class: 'mined-gem' });
  const minedGemMark = gemMark();
  minedGemMark.setAttribute('x', '-60'); minedGemMark.setAttribute('y', '-56');
  minedGemMark.setAttribute('width', '120'); minedGemMark.setAttribute('height', '112');
  openingGem.append(minedGemMark); $('#mining-gems').append(openingGem);
  const openingChips = Array.from({ length: 18 }, (_, i) => {
    const chip = svgNode('path', { d: 'm-4-3 8 1-3 7Z', fill: ['#8da6b0','#b6c9ce','#5d7e8d'][i%3] });
    $('#mining-debris').append(chip); return chip;
  });
  const orePieces = [...$('#mining-ore').children];
  const pieceOffsets = [[-132,-28],[-82,-68],[65,-80],[145,-24],[-144,24],[-45,40],[96,35],[44,30]];
  const clamp = value => Math.max(0, Math.min(1, value));
  const progress = (time, start, end) => clamp((time-start)/(end-start));
  const easeOut = value => 1-Math.pow(1-value,3);
  const easeInOut = value => value*value*(3-2*value);
  const mix = (from,to,t) => from+(to-from)*t;
  const openingNodes = {
    veins: $('#mining-veins'), veinPaths: [...$('#mining-veins').children], pick: $('#mining-pickaxe'),
    impact: $('#mining-impact'), ground: $('#mining-ground'), backdrop: $('#opening-backdrop'),
    stage: $('#opening-stage'), caption: $('#opening-caption'), phase: $('#opening-phase'),
    status: $('#opening-status'), progress: $('#opening-progress'), heroGem: $('.hero-gem'),
    title: $('.paper-title'), letters: [...document.querySelectorAll('.logo-letter')]
  };
  const revealNodes = [...document.querySelectorAll('.site-header,.hero-summary,.intro-replay,.hero-evidence,.hero-meta,.hero-demo,.hero>.insight,#abstract,#method,#skills,#experiments,#resources,body>.footer')];
  const backgroundNodes = [...document.querySelectorAll('body>.site-header,body>main,body>.footer,body>.skip-link')];
  const controlledNodes = [openingNodes.heroGem, openingNodes.title, ...openingNodes.letters, ...revealNodes];
  const originalStyles = new Map();
  const originalInert = new Map();
  let openingElapsed = 0, openingLast = 0, openingFrame = 0, openingPlaying = false;
  let openingPhase = -1, openingGeometry = null, suspendedOpening = false;

  function measureOpening() {
    if (!openingActive) return;
    openingScene.setAttribute('viewBox', innerWidth <= 700 ? '100 0 560 350' : '0 0 760 350');
    const matrix = openingScene.getScreenCTM();
    if (!matrix) return;
    const origin = new DOMPoint(320,84).matrixTransform(matrix);
    const target = openingNodes.heroGem.getBoundingClientRect();
    openingGeometry = { x: origin.x, y: origin.y, width: Math.hypot(matrix.a,matrix.b)*120, target };
  }
  function updateOpeningControls() {
    opening.dataset.state = openingActive ? openingPlaying ? 'playing' : 'paused' : 'complete';
    $('span',openingToggle).textContent = openingPlaying ? openingCfg.controls.pause : openingCfg.controls.resume;
    $('path',openingToggle).setAttribute('d',openingPlaying ? 'M4 3h3v10H4ZM9 3h3v10H9Z' : 'm5 3 7 5-7 5Z');
  }
  function renderOpening() {
    const t = openingElapsed/openingDuration*8200;
    opening.dataset.elapsed = String(Math.round(openingElapsed));
    const phase = t<1700 ? 0 : t<4100 ? 1 : t<5450 ? 2 : 3;
    if (phase !== openingPhase) {
      openingPhase = phase; opening.dataset.phase = String(phase);
      openingNodes.phase.textContent = openingCfg.phases[phase];
      openingNodes.status.textContent = openingCfg.phases[phase];
    }
    const split = easeOut(progress(t,2850,3950));
    orePieces.forEach((node,i) => {
      const [dx,dy] = pieceOffsets[i];
      node.setAttribute('transform',`translate(${dx*split} ${dy*split+split*split*15}) rotate(${(i%2?-1:1)*split*10} 375 180)`);
      node.style.opacity = String(1-progress(t,3150,4100));
    });
    openingNodes.veins.style.opacity = String(progress(t,850,1050)*(1-progress(t,2750,3300)));
    openingNodes.veinPaths.forEach((node,i) => {
      node.style.strokeDasharray = '250'; node.style.strokeDashoffset = String(250*(1-progress(t,850+i*360,1400+i*400)));
    });
    let angle = 18, impact = 0;
    for (const hit of [900,1800,2700]) {
      const d=t-hit;
      if (d>=-650 && d<-180) angle=mix(18,42,easeInOut((d+650)/470));
      else if (d>=-180 && d<0) angle=mix(42,-3,Math.pow((d+180)/180,2));
      else if (d>=0 && d<250) angle=mix(-3,18,easeOut(d/250));
      if (d>=0 && d<230) impact=Math.max(impact,1-d/230);
    }
    const toolExit=easeInOut(progress(t,2900,3400));
    openingNodes.pick.setAttribute('transform',`translate(${toolExit*55} ${-toolExit*55}) rotate(${angle+toolExit*20} 574 155)`);
    openingNodes.pick.style.opacity=String(1-toolExit); openingNodes.impact.style.opacity=String(impact);
    openingChips.forEach((chip,i) => {
      const hit=[900,1800,2700][Math.floor(i/6)], flight=progress(t,hit,hit+740), direction=(i%6-2.5)*32;
      chip.setAttribute('transform',`translate(${452+direction*flight} ${123-85*Math.sin(flight*Math.PI)+flight*54}) rotate(${flight*(i%2?-190:190)})`);
      chip.style.opacity=String(t>=hit && flight<1 ? (1-flight)*.95 : 0);
    });
    // One gemstone springs out, then settles at the exact origin of the title flight.
    const pop=progress(t,3150,4200), settle=easeInOut(progress(t,4200,4650));
    const gemY=pop<1 ? mix(200,120,easeOut(pop))-Math.sin(pop*Math.PI)*45 : mix(120,140,settle);
    const gemScale=mix(.55,1,easeOut(pop));
    openingGem.setAttribute('transform',`translate(380 ${gemY}) scale(${gemScale}) rotate(${-9*Math.sin(pop*Math.PI)})`);
    openingGem.style.opacity=String(progress(t,2850,3150)*(t<5200 ? 1 : 0));
    openingNodes.ground.style.opacity=String(1-progress(t,3500,4800));
    openingNodes.stage.style.opacity=String(progress(t,0,300)*(1-progress(t,5200,5550)));
    openingNodes.caption.style.opacity=String(1-progress(t,5000,5600));
    openingNodes.backdrop.style.opacity=String(1-easeInOut(progress(t,5550,6550)));
    if (openingGeometry) {
      const {x,y,width,target}=openingGeometry;
      const travel=easeInOut(progress(t,5350,6650));
      const size=mix(width,target.width,travel);
      const left=mix(x,target.left,travel);
      const top=mix(y,target.top,travel)-Math.sin(travel*Math.PI)*Math.min(45,innerHeight*.06);
      openingFlight.style.width=`${size}px`;
      openingFlight.style.transform=`translate3d(${left}px,${top}px,0)`;
      openingFlight.style.opacity=String(t>=5200 && t<6650 ? 1 : 0);
    }
    openingNodes.heroGem.style.opacity=String(t>=6650 ? 1 : 0);
    openingNodes.letters.forEach((node,i) => {
      const reveal=easeOut(progress(t,6600+i*90,7050+i*90));
      node.style.opacity=String(reveal); node.style.transform=`translateX(${(1-reveal)*-12}px)`;
    });
    const titleReveal=easeOut(progress(t,6950,7550));
    openingNodes.title.style.opacity=String(titleReveal); openingNodes.title.style.transform=`translateY(${(1-titleReveal)*10}px)`;
    const contentReveal=easeOut(progress(t,7500,8150));
    revealNodes.forEach(node => { node.style.opacity=String(contentReveal); node.style.transform=`translateY(${(1-contentReveal)*12}px)`; });
    openingNodes.progress.style.transform=`scaleX(${t/8200})`;
  }
  function maybePlayHero() {
    const video=$('#hero-media video');
    if (!video || !cfg.media.hero.autoplay || !motionAllowed() || navigator.connection?.saveData || document.hidden) return;
    const rect=video.getBoundingClientRect();
    if (rect.bottom>0 && rect.top<innerHeight) { video.autoplay=true; video.play().catch(()=>{}); }
  }
  function finishOpening({ focus=true, autoplay=true }={}) {
    const wasActive=openingActive;
    openingActive=false; openingPlaying=false; suspendedOpening=false;
    cancelAnimationFrame(openingFrame); openingFrame=0; clearTimeout(window.gemOpeningFallback);
    opening.hidden=true;
    delete document.documentElement.dataset.opening;
    originalStyles.forEach((style,node) => { if (style===null) node.removeAttribute('style'); else node.setAttribute('style',style); });
    originalStyles.clear();
    originalInert.forEach((inert,node) => node.inert=inert); originalInert.clear();
    updateOpeningControls();
    openingReplay.hidden=!openingEligible();
    if (wasActive && focus) $('#paper-title').focus({preventScroll:true});
    if (wasActive && autoplay) maybePlayHero();
    maybeAutoplayFramework();
  }
  function pauseOpening() {
    if (!openingActive || !openingPlaying) return;
    openingPlaying=false; cancelAnimationFrame(openingFrame); openingFrame=0; updateOpeningControls();
  }
  function tickOpening(now) {
    if (!openingActive || !openingPlaying) return;
    try {
      openingElapsed=Math.min(openingDuration,openingElapsed+Math.min(100,Math.max(0,now-openingLast)));
      openingLast=now; renderOpening();
      if (openingElapsed>=openingDuration) { finishOpening(); return; }
      openingFrame=requestAnimationFrame(tickOpening);
    } catch (error) { finishOpening(); console.warn('Opening illustration ended early.',error); }
  }
  function resumeOpening() {
    if (!openingActive || document.hidden || !openingEligible()) return;
    openingPlaying=true; openingLast=performance.now(); updateOpeningControls();
    openingFrame=requestAnimationFrame(tickOpening);
  }
  function startOpening() {
    if (!openingEligible() || openingActive) return;
    try {
      openingActive=true; openingElapsed=0; openingPhase=-1;
      pauseFramework();
      document.querySelectorAll('video').forEach(video=>video.pause());
      controlledNodes.forEach(node => {
        node.getAnimations({subtree:true}).forEach(animation=>animation.cancel());
        originalStyles.set(node,node.getAttribute('style'));
      });
      backgroundNodes.forEach(node=>{ originalInert.set(node,node.inert); node.inert=true; });
      window.scrollTo({top:0,left:0,behavior:'instant'});
      document.documentElement.dataset.opening='active';
      opening.hidden=false; measureOpening(); renderOpening();
      $('#opening-skip').focus({preventScroll:true}); clearTimeout(window.gemOpeningFallback);
      if (document.hidden) { suspendedOpening=true; updateOpeningControls(); }
      else resumeOpening();
    } catch (error) { finishOpening(); console.warn('Opening illustration unavailable.',error); }
  }
  openingToggle.addEventListener('click',()=>{
    suspendedOpening=false;
    if (openingPlaying) pauseOpening(); else resumeOpening();
  });
  $('#opening-skip').addEventListener('click',()=>finishOpening());
  openingReplay.addEventListener('click',startOpening);
  opening.addEventListener('keydown',event=>{
    if (event.key==='Escape') { event.preventDefault(); finishOpening(); }
    if (event.key==='Tab') {
      const first=openingToggle,last=$('#opening-skip');
      if (event.shiftKey && document.activeElement===first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement===last) { event.preventDefault(); first.focus(); }
    }
  });
  window.addEventListener('resize',()=>{ if (openingActive) { measureOpening(); renderOpening(); } });
  document.fonts.ready.then(()=>{ if (openingActive) { measureOpening(); renderOpening(); } });
  document.addEventListener('visibilitychange',()=>{
    if (document.hidden) { suspendedOpening=openingPlaying; pauseOpening(); }
    else if (suspendedOpening) { suspendedOpening=false; resumeOpening(); }
  });
  window.addEventListener('hashchange',()=>{
    if (!openingActive) return;
    finishOpening({focus:false,autoplay:false});
    const target=document.getElementById(location.hash.slice(1));
    if (target) requestAnimationFrame(()=>target.scrollIntoView({behavior:'instant'}));
  });
  window.addEventListener('pagehide',()=>finishOpening({focus:false,autoplay:false}));
  window.addEventListener('error',()=>{ if (openingActive) finishOpening({focus:false,autoplay:false}); });
  reducedMotion.addEventListener('change',()=>{
    if (!openingEligible()) finishOpening({autoplay:false});
    openingReplay.hidden=!openingEligible();
  });
  openingReplay.hidden=!openingEligible();
  cfg.media.skills.forEach((skill, index) => {
    const article = element('article', 'skill-item');
    article.dataset.skill = String(index);
    const frame = element('div', 'video-frame');
    article.append(frame);
    if (skill.video) {
      frame.append(videoPlayer(skill, `${skill.name}: real robot execution, ${skill.speed} times speed`));
      const metadata = element('div', 'clip-meta');
      metadata.append(element('span', '', `${skill.speed}× speed`));
      article.append(metadata);
    } else {
      frame.classList.add('skill-video-empty');
      frame.setAttribute('role', 'img');
      frame.setAttribute('aria-label', `${skill.name}: video to be added`);
    }
    const heading = element('h3'); heading.append(gemMark(skillTone(index)), element('span', '', skill.name));
    article.append(heading, element('p', '', skill.description));
    $('#skills-grid').append(article);
  });

  let currentSkill = 'all';
  const skillOptions = [{ id: 'all', label: 'All skills' }, ...cfg.media.skills.map((skill, index) => ({ id: String(index), label: skill.tabLabel || skill.name }))];
  skillOptions.forEach(option => {
    const button = element('button', 'skill-filter', option.label); button.type = 'button'; button.dataset.skill = option.id;
    button.setAttribute('aria-pressed', String(option.id === 'all')); button.setAttribute('aria-controls', 'skills-grid');
    if (option.id === 'all') button.append(element('span', 'skill-filter-count', String(cfg.media.skills.length)));
    else button.prepend(gemMark(skillTone(Number(option.id))));
    button.addEventListener('click', () => {
      if (currentSkill === option.id) return;
      currentSkill = option.id;
      document.querySelectorAll('.skill-filter').forEach(b => b.setAttribute('aria-pressed', String(b === button)));
      $('#skills-grid').dataset.focused = String(option.id !== 'all');
      document.querySelectorAll('.skill-item').forEach(article => {
        article.hidden = option.id !== 'all' && article.dataset.skill !== option.id;
        if (article.hidden) article.querySelector('video')?.pause();
        else motion(article, [{ opacity: .25, transform: 'translateY(6px)' }, { opacity: 1, transform: 'none' }], { duration: 270 });
      });
      $('#skill-filter-status').textContent = option.id === 'all' ? 'Showing all four skills.' : `Showing ${cfg.media.skills[Number(option.id)].name}.`;
    });
    $('#skill-filters').append(button);
  });

  for (const key of ['gem', 'base']) {
    const result = cfg.results[key];
    const metric = element('div', `metric ${key === 'base' ? 'baseline' : ''}`);
    metric.append(element('strong', '', `${result.rate.toFixed(1)}%`), element('span', 'metric-label', key === 'gem' ? 'GEM' : 'Base Agent'), element('small', '', `${result.successes} / ${result.trials} successful episodes`));
    const track = element('div', 'metric-track'); track.setAttribute('aria-hidden', 'true');
    const fill = element('i'); fill.style.width = `${result.rate}%`; track.append(fill); metric.append(track); $('#metrics').append(metric);
  }
  onceVisible($('#metrics'), () => document.querySelectorAll('.metric-track i').forEach((fill, index) => motion(fill,
    [{ transform: 'scaleX(0)' }, { transform: 'scaleX(1)' }], { duration: 800, delay: index * 120 })));
  let selectedId;
  function selectGarment(garment) {
    if (selectedId === garment.id) return;
    const isChange = selectedId !== undefined;
    selectedId = garment.id;
    document.querySelectorAll('.garment-selector').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.id === selectedId)));
    const oldVideo = $('#garment-media video');
    if (oldVideo) { pauseOffscreen.unobserve(oldVideo); oldVideo.pause(); oldVideo.removeAttribute('src'); oldVideo.load(); }
    $('#garment-media').replaceChildren(videoPlayer(garment, `${garment.id} ${garment.label}, illustrative execution at ${garment.speed} times speed`, { preload: 'metadata' }));
    const info = $('#garment-info'); info.replaceChildren();
    info.append(element('p', 'role', `${garment.id} / ${garment.role}`), element('h3', '', garment.label), element('p', 'viewer-meta', `${garment.size} · ${garment.video ? `${garment.speed}× speed` : 'Execution video pending'}`));
    for (const key of ['gem', 'base']) {
      const row = element('div', `selected-result ${key}`);
      const text = element('span', '', key === 'gem' ? 'GEM' : 'Base Agent');
      text.append(element('small', '', `${garment.results[key].auto}/${cfg.evaluation.automaticTrials} auto · ${garment.results[key].manual}/${cfg.evaluation.manualTrials} manual`));
      row.append(text, element('strong', '', `${total(garment.results[key])}/${trialCount}`)); info.append(row);
    }
    if (isChange) {
      motion($('#garment-media .player'), [{ opacity: .3, transform: 'scale(.99)' }, { opacity: 1, transform: 'none' }], { duration: 260 });
      motion(info, [{ opacity: .3, transform: 'translateX(7px)' }, { opacity: 1, transform: 'none' }], { duration: 270 });
    }
  }
  cfg.media.garments.forEach(garment => {
    const button = element('button', 'garment-selector'); button.type = 'button'; button.dataset.id = garment.id;
    button.setAttribute('aria-controls', 'garment-viewer'); button.setAttribute('aria-pressed', 'false');
    button.setAttribute('aria-label', `${garment.id}, ${garment.label}, ${garment.role}${garment.video ? '' : ', video pending'}`);
    const img = element('img'); img.src = garment.image; img.alt = ''; img.width = 480; img.height = 400; img.loading = 'lazy';
    button.append(img, element('strong', '', garment.id), element('small', '', garment.id === 'G0' ? 'Source' : garment.video ? garment.size : 'Video pending'));
    button.addEventListener('click', () => selectGarment(garment)); $('#garment-selectors').append(button);
    const row = element('tr'); const heading = element('th', '', `${garment.id}${garment.id === 'G0' ? ' (source)' : ''}`); heading.scope = 'row';
    row.append(heading, element('td', '', garment.size));
    for (const key of ['base', 'gem']) { const cell = element('td', '', `${total(garment.results[key])}/${trialCount}`); cell.append(element('small', '', `${garment.results[key].auto} auto + ${garment.results[key].manual} manual`)); row.append(cell); }
    $('#results-rows').append(row);
  });
  selectGarment(cfg.media.garments.find(g => g.id === 'G1') || cfg.media.garments[0]);
  $('#garment-selectors').addEventListener('keydown', event => {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
    const buttons = [...$('#garment-selectors').querySelectorAll('button')]; const index = buttons.indexOf(document.activeElement); if (index < 0) return;
    event.preventDefault();
    const next = event.key === 'Home' ? 0 : event.key === 'End' ? buttons.length - 1 : (index + (event.key === 'ArrowRight' ? 1 : -1) + buttons.length) % buttons.length;
    buttons[next].focus(); buttons[next].click();
  });

  // Figures 4–5 retain the paper's artwork. Interaction reveals its existing panels.
  const details = cfg.methodDetails;
  details.chapters.forEach(chapter => {
    const link = element('a', '', chapter.label); link.href = `#method-${chapter.id}`;
    $('#method-chapters').append(link);
  });
  const exploration = details.exploration;
  let explorationIndex = -1;
  function selectExploration(index, announce = true) {
    explorationIndex = index;
    const step = exploration.steps[index];
    const artwork = $('#exploration-artwork');
    artwork.dataset.focused = String(Boolean(step));
    $('#exploration-mobile-source').srcset = step?.image || cfg.media.exploration;
    $('#exploration-image').alt = compactFramework.matches && step ? step.alt : exploration.alt;
    $('#exploration-reset').setAttribute('aria-pressed', String(!step));
    $('#exploration-steps').querySelectorAll('button').forEach((button, i) => {
      const active = index === i;
      button.setAttribute('aria-expanded', String(active));
      document.getElementById(button.getAttribute('aria-controls')).hidden = !active;
    });
    $('#exploration-hotspots').querySelectorAll('button').forEach((button, i) => button.setAttribute('aria-pressed', String(index === i)));
    $('#exploration-mobile-controls').querySelectorAll('button').forEach((button, i) => button.setAttribute('aria-pressed', String(index === i)));
    $('#exploration-mobile-title').textContent = step?.title || exploration.mobileOverviewTitle;
    $('#exploration-mobile-body').textContent = step?.body || exploration.overview;
    if (announce) $('#exploration-status').textContent = step ? `Figure 4${step.letter}: ${step.title}.` : 'Showing the complete exploration loop.';
  }
  exploration.steps.forEach((step, index) => {
    const item = element('li');
    const button = element('button', 'exploration-step'); button.type = 'button';
    button.id = `exploration-step-${step.id}`; button.setAttribute('aria-controls', `exploration-body-${step.id}`);
    const letter = element('span', 'step-letter', step.letter); letter.setAttribute('aria-hidden', 'true');
    button.append(letter, element('span', '', step.title), element('span', 'step-toggle'));
    const body = element('p', 'exploration-step-body', step.body); body.id = `exploration-body-${step.id}`; body.hidden = true;
    button.addEventListener('click', () => selectExploration(explorationIndex === index ? -1 : index));
    item.append(button, body); $('#exploration-steps').append(item);
    const hotspot = element('button', 'exploration-hotspot'); hotspot.type = 'button';
    hotspot.setAttribute('aria-label', `Figure 4${step.letter}: ${step.title}`);
    hotspot.setAttribute('aria-controls', body.id);
    const [left, top, width, height] = step.bounds;
    Object.assign(hotspot.style, { left: `${left}%`, top: `${top}%`, width: `${width}%`, height: `${height}%` });
    hotspot.addEventListener('click', () => selectExploration(explorationIndex === index ? -1 : index));
    $('#exploration-hotspots').append(hotspot);
    const mobileButton = element('button'); mobileButton.type = 'button';
    mobileButton.setAttribute('aria-controls', 'exploration-artwork exploration-mobile-detail');
    const mobileLetter = element('span', '', step.letter); mobileLetter.setAttribute('aria-hidden', 'true');
    mobileButton.append(mobileLetter, document.createTextNode(step.shortLabel));
    mobileButton.addEventListener('click', () => selectExploration(explorationIndex === index ? -1 : index));
    $('#exploration-mobile-controls').append(mobileButton);
  });
  $('#exploration-reset').addEventListener('click', () => selectExploration(-1));
  compactFramework.addEventListener('change', () => selectExploration(explorationIndex, false));
  selectExploration(-1, false);

  function notationSymbol(field) {
    const symbol = element('span', 'notation-symbol', field.symbol);
    if (field.subscript) symbol.append(element('sub', '', field.subscript));
    return symbol;
  }
  function notationFields(fields, target) {
    fields.forEach(field => {
      const item = element('div'); const term = element('dt'); term.append(notationSymbol(field));
      item.append(term, element('dd', '', field.label)); $(target).append(item);
    });
  }
  notationFields(exploration.recordFields, '#interaction-record');
  notationFields(details.mining.effectFields, '#effect-fields');

  let miningIndex = -1;
  function selectMining(index, announce = true) {
    if (miningIndex === index) return;
    const changed = miningIndex !== -1; miningIndex = index;
    const selected = details.mining.cases[index];
    const panel = $('#mining-case'); panel.dataset.case = selected.id;
    panel.setAttribute('aria-labelledby', `mining-tab-${selected.id}`);
    $('#mining-mobile-source').srcset = selected.actionImage;
    $('#mining-image').src = selected.image;
    $('#mining-image').alt = compactFramework.matches ? selected.actionAlt : selected.alt;
    $('#mining-check-image').src = selected.checkImage;
    $('#mining-check-image').alt = selected.checkAlt;
    for (const key of ['intention', 'effect', 'decision', 'verdict']) $(`#mining-${key}`).textContent = selected[key];
    $('#mining-tabs').querySelectorAll('button').forEach((button, i) => {
      button.setAttribute('aria-selected', String(i === index)); button.tabIndex = i === index ? 0 : -1;
    });
    if (changed) motion($('.mining-figure'), [{ opacity: .35 }, { opacity: 1 }], { duration: 240 });
    if (announce) $('#mining-status').textContent = `Showing Figure 5${selected.letter}: ${selected.label}. ${selected.verdict}.`;
  }
  details.mining.cases.forEach((example, index) => {
    const button = element('button', 'mining-tab'); button.type = 'button';
    button.id = `mining-tab-${example.id}`; button.setAttribute('role', 'tab'); button.setAttribute('aria-controls', 'mining-case');
    const letter = element('span', '', example.letter); letter.setAttribute('aria-hidden', 'true');
    button.append(letter, document.createTextNode(example.label));
    button.addEventListener('click', () => selectMining(index)); $('#mining-tabs').append(button);
  });
  $('#mining-tabs').addEventListener('keydown', event => {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
    const tabs = [...$('#mining-tabs').querySelectorAll('button')];
    const current = tabs.indexOf(document.activeElement); if (current < 0) return;
    event.preventDefault();
    const next = event.key === 'Home' ? 0 : event.key === 'End' ? tabs.length - 1 : (current + (event.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length;
    selectMining(next); tabs[next].focus();
  });
  compactFramework.addEventListener('change', () => {
    const selected = details.mining.cases[miningIndex];
    $('#mining-image').alt = compactFramework.matches ? selected.actionAlt : selected.alt;
  });
  selectMining(0, false);
  details.transfer.fields.forEach(field => {
    const item = element('div', 'skill-definition-field');
    const term = element('dt'); term.append(notationSymbol(field), element('span', '', field.title));
    item.append(term, element('dd', '', field.body)); $('#skill-definition-fields').append(item);
  });
  details.transfer.phases.forEach(phase => {
    const item = element('li'); item.append(element('strong', '', phase.label)); $('#transfer-phases').append(item);
  });

  const figureMetadata = {
    method: { title: 'GEM method overview', caption: cfg.copy.methodCaption },
    skillFigure: { title: 'Discovered skill examples', caption: 'Figure 10. Before and after views from the paper. Blue arrows indicate manipulation directions.' },
    results: { title: 'Source and unseen garment results', caption: cfg.copy.resultsCaption },
    exploration: { title: 'Figure 4 · Diversity-oriented exploration', caption: details.exploration.figureCaption },
    effectMining: { title: 'Figure 5 · Not every surprise is a skill', caption: details.mining.figureCaption }
  };
  const dialog = $('#figure-dialog');
  document.querySelectorAll('[data-figure]').forEach(button => button.addEventListener('click', () => {
    const key = button.dataset.figure; const figure = figureMetadata[key];
    pauseFramework();
    $('#figure-dialog-title').textContent = figure.title; $('#expanded-figure').src = cfg.media[key]; $('#expanded-figure').alt = figure.caption;
    dialog.showModal(); document.body.style.overflow = 'hidden';
    motion(dialog, [{ opacity: 0, transform: 'translateY(10px) scale(.99)' }, { opacity: 1, transform: 'none' }], { duration: 220 });
  }));
  $('#close-figure').addEventListener('click', () => dialog.close());
  dialog.addEventListener('close', () => { document.body.style.overflow = ''; });
  dialog.addEventListener('click', event => { if (event.target === dialog) { const rect = dialog.getBoundingClientRect(); if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close(); } });
  $('#copy-citation').addEventListener('click', async () => {
    let copied = false;
    try { await navigator.clipboard.writeText(cfg.paper.bibtex); copied = true; }
    catch { const selection = window.getSelection(); const range = document.createRange(); range.selectNodeContents($('#bibtex-text')); selection.removeAllRanges(); selection.addRange(range); try { copied = document.execCommand('copy'); } catch {} }
    $('#copy-status').textContent = copied ? 'Citation template copied.' : 'Citation selected. Use your device’s copy command.';
    $('#copy-citation').textContent = copied ? 'Copied' : 'Text selected';
    setTimeout(() => { $('#copy-citation').textContent = 'Copy template'; }, 2200);
  });
  const sections = ['method', 'skills', 'experiments', 'resources'].map(id => document.getElementById(id));
  const navLinks = [...document.querySelectorAll('.header-inner nav a')];
  let scrollFrame = 0;
  function updateNavigation() {
    scrollFrame = 0;
    const available = document.documentElement.scrollHeight - window.innerHeight;
    const progress = available > 0 ? Math.min(1, Math.max(0, window.scrollY / available)) : 0;
    $('#reading-progress').style.transform = `scaleX(${progress})`;
    $('.site-header').dataset.scrolled = String(window.scrollY > 15);
    const threshold = $('.site-header').offsetHeight + 140;
    let active = '';
    sections.forEach(section => { if (section.getBoundingClientRect().top <= threshold) active = `#${section.id}`; });
    if (available > 0 && progress >= .998) active = `#${sections.at(-1).id}`;
    navLinks.forEach(link => { if (link.hash === active) link.setAttribute('aria-current', 'location'); else link.removeAttribute('aria-current'); });
  }
  function scheduleNavigation() { if (!scrollFrame) scrollFrame = requestAnimationFrame(updateNavigation); }
  window.addEventListener('scroll', scheduleNavigation, { passive: true });
  window.addEventListener('resize', scheduleNavigation, { passive: true });
  new ResizeObserver(scheduleNavigation).observe(document.body);
  updateNavigation();
  if (openingAutoRequested) {
    Promise.race([document.fonts.ready, new Promise(resolve => setTimeout(resolve, 1200))]).then(() => {
      if (document.documentElement.dataset.opening !== 'pending') return;
      if (!['', '#top', '#gem-mining', '#opening'].includes(location.hash)) { finishOpening({focus:false,autoplay:false}); return; }
      startOpening();
    });
  }

})();
