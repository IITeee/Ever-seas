(function () {
  "use strict";

  var canvas = document.getElementById("ocean");
  if (!canvas || !canvas.getContext) return;

  var ctx = canvas.getContext("2d", { alpha: false });
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var width = 0;
  var height = 0;
  var dpr = 1;
  var frameId = 0;
  var running = true;

  function resize() {
    var rect = canvas.getBoundingClientRect();
    dpr = Math.min(window.devicePixelRatio || 1, 1.75);
    width = Math.max(1, rect.width);
    height = Math.max(1, rect.height);
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function waveY(x, time, base, scale) {
    return (
      base +
      Math.sin(x * 0.0075 + time * 0.55) * 16 * scale +
      Math.sin(x * 0.016 - time * 0.8) * 8 * scale +
      Math.sin(x * 0.031 + time * 1.15) * 3.5 * scale
    );
  }

  function fillWave(time, base, scale, color, phase) {
    ctx.beginPath();
    ctx.moveTo(0, height);
    var step = width > 900 ? 6 : 8;
    for (var x = 0; x <= width; x += step) {
      ctx.lineTo(x, waveY(x + phase, time, base, scale));
    }
    ctx.lineTo(width, height);
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.fill();
  }

  function strokeCrest(time, base, scale, phase, color, widthPx) {
    ctx.beginPath();
    var step = 5;
    for (var x = 0; x <= width; x += step) {
      var y = waveY(x + phase, time, base, scale);
      if (x === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.strokeStyle = color;
    ctx.lineWidth = widthPx;
    ctx.stroke();
  }

  function drawIsland(x, baseY, radius, color, peak) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.ellipse(x, baseY, radius, radius * 0.42, 0, 0, Math.PI * 2);
    ctx.fill();
    if (peak) {
      ctx.beginPath();
      ctx.moveTo(x - radius * 0.28, baseY - radius * 0.05);
      ctx.lineTo(x + radius * 0.02, baseY - radius * 0.72);
      ctx.lineTo(x + radius * 0.34, baseY);
      ctx.closePath();
      ctx.fill();
    }
  }

  function drawBoat(x, y, scale) {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(scale, scale);
    ctx.fillStyle = "rgba(8, 20, 32, 0.28)";
    ctx.beginPath();
    ctx.ellipse(0, 12, 34, 5, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#8b5a2b";
    ctx.beginPath();
    ctx.moveTo(-30, 0);
    ctx.lineTo(32, 0);
    ctx.quadraticCurveTo(22, 14, 0, 14);
    ctx.quadraticCurveTo(-20, 14, -30, 0);
    ctx.fill();
    ctx.fillStyle = "#6e4522";
    ctx.fillRect(-8, -2, 16, 5);
    ctx.strokeStyle = "#f3ecdf";
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.moveTo(2, 10);
    ctx.lineTo(2, -34);
    ctx.stroke();
    ctx.fillStyle = "#f7f1e6";
    ctx.beginPath();
    ctx.moveTo(3, -32);
    ctx.lineTo(22, -6);
    ctx.lineTo(3, -4);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = "#d7ecf8";
    ctx.globalAlpha = 0.85;
    ctx.beginPath();
    ctx.moveTo(1, -30);
    ctx.lineTo(-14, -8);
    ctx.lineTo(1, -6);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  function draw(time) {
    var sky = ctx.createLinearGradient(0, 0, 0, height);
    sky.addColorStop(0, "#07111c");
    sky.addColorStop(0.28, "#10283d");
    sky.addColorStop(0.48, "#1c5678");
    sky.addColorStop(0.62, "#c57a45");
    sky.addColorStop(0.7, "#f0d7a0");
    sky.addColorStop(0.76, "#1a6d99");
    sky.addColorStop(1, "#061824");
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, width, height);

    var sunX = width < 720 ? width * 0.9 : width * 0.76;
    var sunY = height * 0.6;
    var glow = ctx.createRadialGradient(sunX, sunY, 4, sunX, sunY, Math.max(width, height) * 0.28);
    glow.addColorStop(0, "rgba(255, 236, 196, 0.95)");
    glow.addColorStop(0.18, "rgba(255, 196, 120, 0.45)");
    glow.addColorStop(0.45, "rgba(255, 160, 90, 0.12)");
    glow.addColorStop(1, "rgba(255, 160, 90, 0)");
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(sunX, sunY, Math.max(width, height) * 0.28, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#fff4d2";
    ctx.beginPath();
    ctx.arc(sunX, sunY, Math.max(18, width * 0.018), 0, Math.PI * 2);
    ctx.fill();

    var horizon = height * 0.66;
    drawIsland(width * 0.18, horizon + 6, Math.min(70, width * 0.05), "#245066", true);
    drawIsland(width * 0.3, horizon + 16, Math.min(110, width * 0.075), "#1a3f54", false);
    drawIsland(width * 0.46, horizon + 4, Math.min(46, width * 0.032), "#2c5d52", true);

    fillWave(time, horizon + 8, 0.55, "#1f7eae", 40);
    strokeCrest(time, horizon + 8, 0.55, 40, "rgba(255, 248, 230, 0.45)", 1.4);
    fillWave(time, horizon + height * 0.06, 0.8, "#14608a", 10);
    strokeCrest(time, horizon + height * 0.06, 0.8, 10, "rgba(232, 246, 255, 0.28)", 1.2);
    fillWave(time, horizon + height * 0.14, 1, "#0c4468", 80);

    var boatX = Math.min(width * 0.22, 340);
    var boatY = waveY(boatX, time, horizon + height * 0.14, 1) - 8;
    if (boatY < height - 20) drawBoat(boatX, boatY, Math.max(0.85, Math.min(1.35, width / 1100)));

    fillWave(time, horizon + height * 0.24, 1.15, "#08283f", 140);
    strokeCrest(time, horizon + height * 0.24, 1.15, 140, "rgba(214, 236, 248, 0.16)", 1.5);

    ctx.save();
    ctx.beginPath();
    ctx.rect(0, horizon + 4, width, height);
    ctx.clip();
    var reflection = ctx.createLinearGradient(0, horizon, 0, horizon + height * 0.22);
    reflection.addColorStop(0, "rgba(255, 244, 210, 0.5)");
    reflection.addColorStop(1, "rgba(255, 244, 210, 0)");
    ctx.fillStyle = reflection;
    ctx.beginPath();
    ctx.ellipse(sunX, horizon + height * 0.07, Math.max(7, width * 0.006), height * 0.09, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  function tick(now) {
    draw(now * 0.001);
    if (running && !reduceMotion) frameId = window.requestAnimationFrame(tick);
  }

  resize();
  if (reduceMotion) draw(1.4);
  else frameId = window.requestAnimationFrame(tick);

  window.addEventListener("resize", function () {
    resize();
    if (reduceMotion) draw(1.4);
  });

  document.addEventListener("visibilitychange", function () {
    if (document.hidden) {
      running = false;
      if (frameId) window.cancelAnimationFrame(frameId);
      return;
    }
    running = true;
    if (!reduceMotion) frameId = window.requestAnimationFrame(tick);
  });
})();
