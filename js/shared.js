(function () {

  // ── Cursor
  var dot  = document.getElementById('cDot');
  var ring = document.getElementById('cRing');
  if (dot && ring) {
    var mx=0,my=0,rx=0,ry=0;
    document.addEventListener('mousemove', function(e){ mx=e.clientX; my=e.clientY; });
    document.addEventListener('mouseover', function(e){
      if (e.target.closest('a,button')) ring.classList.add('hover');
      else ring.classList.remove('hover');
    });
    (function animC(){
      dot.style.left  = mx+'px'; dot.style.top  = my+'px';
      rx += (mx-rx)*.12; ry += (my-ry)*.12;
      ring.style.left = rx+'px'; ring.style.top = ry+'px';
      requestAnimationFrame(animC);
    })();
  }

  // ── Nav stuck + scroll bar
  var nav  = document.getElementById('mainNav');
  var sbar = document.getElementById('sBar');
  window.addEventListener('scroll', function(){
    if (nav)  nav.classList.toggle('stuck', window.scrollY > 30);
    if (sbar) {
      var pct = window.scrollY / (document.body.scrollHeight - window.innerHeight) * 100;
      sbar.style.width = pct + '%';
    }
  }, { passive: true });

  // ── Mobile Hamburger Menu
  var hamburger = document.getElementById('navHamburger');
  var drawer    = document.getElementById('navDrawer');
  if (hamburger && drawer) {
    hamburger.addEventListener('click', function(){
      var isOpen = hamburger.classList.toggle('open');
      if (isOpen) {
        drawer.classList.add('visible');
        setTimeout(function(){ drawer.classList.add('open'); }, 10);
      } else {
        drawer.classList.remove('open');
        setTimeout(function(){ drawer.classList.remove('visible'); }, 350);
      }
    });
    // Close on link click
    drawer.querySelectorAll('a').forEach(function(link){
      link.addEventListener('click', function(){
        hamburger.classList.remove('open');
        drawer.classList.remove('open');
        setTimeout(function(){ drawer.classList.remove('visible'); }, 350);
      });
    });
    // Close on outside click
    document.addEventListener('click', function(e){
      if (!hamburger.contains(e.target) && !drawer.contains(e.target)) {
        hamburger.classList.remove('open');
        drawer.classList.remove('open');
        setTimeout(function(){ drawer.classList.remove('visible'); }, 350);
      }
    });
  }

  // ── Particles
  var canvas = document.getElementById('particles');
  if (canvas) {
    var ctx = canvas.getContext('2d');
    var W, H, pts = [];
    function resize(){ W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; }
    resize();
    window.addEventListener('resize', resize, {passive:true});
    function Pt(){
      this.x = Math.random()*W; this.y = Math.random()*H;
      this.vx = (Math.random()-.5)*.28; this.vy = -Math.random()*.22 - .05;
      this.r  = Math.random()*1.3+.3; this.a = Math.random()*.4+.07;
      this.life=0; this.max=Math.random()*280+140;
    }
    Pt.prototype.step=function(){
      this.x+=this.vx; this.y+=this.vy; this.life++;
      if(this.life>this.max||this.y<-5){ var p=new Pt(); p.y=H+2; Object.assign(this,p); }
    };
    for(var i=0;i<70;i++) pts.push(new Pt());
    (function draw(){
      ctx.clearRect(0,0,W,H);
      pts.forEach(function(p){
        p.step();
        var a = p.a*(1-(p.life/p.max)*.7);
        ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
        ctx.fillStyle='rgba(10,132,255,'+a+')'; ctx.fill();
      });
      requestAnimationFrame(draw);
    })();
  }

  // ── Scroll reveal (IntersectionObserver)
  var els = document.querySelectorAll('[data-reveal]');
  if ('IntersectionObserver' in window && els.length) {
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(e){
        if(e.isIntersecting){
          var d = parseInt(e.target.dataset.delay||0);
          setTimeout(function(){ e.target.classList.add('revealed'); }, d);
          io.unobserve(e.target);
        }
      });
    }, {threshold:.08});
    els.forEach(function(el){ io.observe(el); });
  } else {
    els.forEach(function(el){ el.classList.add('revealed'); });
  }

  // ── Bento card & np-card spotlight on mousemove
  document.querySelectorAll('.bento-card, .np-card').forEach(function(card){
    card.addEventListener('mousemove', function(e){
      var r = card.getBoundingClientRect();
      card.style.setProperty('--mx', ((e.clientX-r.left)/r.width*100)+'%');
      card.style.setProperty('--my', ((e.clientY-r.top)/r.height*100)+'%');
    });
  });

  // ── Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(function(a){
    a.addEventListener('click', function(e){
      var target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        var navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 60;
        var top = target.getBoundingClientRect().top + window.scrollY - navH - 20;
        window.scrollTo({ top: top, behavior: 'smooth' });
      }
    });
  });

})();
