(function(){
  var nav = document.getElementById('nav');
  var hero = document.querySelector('.hero');
  var navToggle = document.getElementById('navToggle');
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var NAV_H = 90;

  function closeMenu(){
    nav.classList.remove('menu-open');
    navToggle.setAttribute('aria-expanded','false');
  }
  navToggle.addEventListener('click', function(){
    var open = nav.classList.toggle('menu-open');
    navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  });

  var progressBar = document.getElementById('scrollProgress');
  function onScroll(){
    var y = window.scrollY || window.pageYOffset;
    nav.classList.toggle('solid', y > 60);
    var heroBottom = hero.getBoundingClientRect().bottom;
    nav.classList.toggle('on-photo', heroBottom > 80);
    var docH = document.documentElement.scrollHeight - window.innerHeight;
    var frac = docH > 0 ? Math.min(1, Math.max(0, y / docH)) : 0;
    progressBar.style.transform = 'scaleX(' + frac + ')';
  }

  var lenis = null;
  if(!reduce && window.Lenis){
    lenis = new Lenis({ duration: 1.05, smoothWheel: true });
    lenis.on('scroll', onScroll);
    function raf(time){ lenis.raf(time); requestAnimationFrame(raf); }
    requestAnimationFrame(raf);
  } else {
    window.addEventListener('scroll', onScroll, {passive:true});
  }
  onScroll();

  if(!reduce && window.gsap && window.ScrollTrigger){
    gsap.registerPlugin(ScrollTrigger);
    if(lenis){ lenis.on('scroll', ScrollTrigger.update); gsap.ticker.add(t=>lenis.raf(t*1000)); gsap.ticker.lagSmoothing(0); }

    document.querySelectorAll('.gsap-reveal').forEach(function(el){
      gsap.to(el, {
        opacity:1, y:0, duration:0.9, ease:'power2.out',
        scrollTrigger:{ trigger:el, start:'top 88%' }
      });
    });

    document.querySelectorAll('[data-parallax]').forEach(function(img){
      gsap.to(img, {
        yPercent:-12, ease:'none',
        scrollTrigger:{ trigger: img.closest('.parallax-wrap') || img, start:'top bottom', end:'bottom top', scrub:true }
      });
    });

    gsap.set('.hero-title .word', { yPercent:120, opacity:0 });
    var heroTl = gsap.timeline({ delay:0.15 });
    heroTl
      .to('[data-in="1"]', { opacity:1, duration:0.7, ease:'power2.out' })
      .to('.hero-title [data-in="2"]', { yPercent:0, opacity:1, duration:0.85, ease:'power3.out', stagger:0.06 }, '-=0.35')
      .to('.hero-title [data-in="3"]', { yPercent:0, opacity:1, duration:0.85, ease:'power3.out', stagger:0.06 }, '-=0.6')
      .to('[data-in="4"]', { opacity:1, duration:0.7, ease:'power2.out' }, '-=0.35')
      .to('[data-in="5"]', { opacity:1, duration:0.7, ease:'power2.out' }, '-=0.4');

    if(window.matchMedia('(hover:hover)').matches){
      document.querySelectorAll('.product-trigger').forEach(function(card){
        var frame = card.querySelector('.arch-frame');
        if(!frame) return;
        card.addEventListener('mousemove', function(e){
          var r = card.getBoundingClientRect();
          var px = (e.clientX - r.left) / r.width - 0.5;
          var py = (e.clientY - r.top) / r.height - 0.5;
          card.classList.add('tilting');
          gsap.to(frame, { rotateY: px * 10, rotateX: py * -10, y:-4, duration:0.4, ease:'power2.out', overwrite:true });
        });
        card.addEventListener('mouseleave', function(){
          gsap.to(frame, { rotateY:0, rotateX:0, y:0, duration:0.5, ease:'power2.out', overwrite:true,
            onComplete:function(){ card.classList.remove('tilting'); } });
        });
      });
    }
  } else {
    document.documentElement.classList.add('no-js-anim');
    document.querySelectorAll('.gsap-reveal').forEach(function(el){ el.style.opacity=1; el.style.transform='none'; });
    document.querySelectorAll('.hero-in').forEach(function(el){ el.style.opacity=1; });
  }

  document.querySelectorAll('a[href^="#"]').forEach(function(link){
    link.addEventListener('click', function(e){
      var id = link.getAttribute('href');
      var target = id.length > 1 ? document.querySelector(id) : document.body;
      if(!target) return;
      e.preventDefault();
      closeMenu();
      if(lenis){
        lenis.scrollTo(target, { offset: -NAV_H, duration: 1.1 });
      } else {
        var top = target.getBoundingClientRect().top + window.pageYOffset - NAV_H;
        window.scrollTo({ top: top, behavior: reduce ? 'auto' : 'smooth' });
      }
    });
  });

  var PRODUCTS = {
    "root-revive-oil": {
      kicker: "Hair Oil", name: "Root Revive Oil",
      desc: "A hair oil blended with coconut, curry leaves, black seeds, and other traditional ingredients — meant for regular scalp and hair nourishment.",
      ingredients: "Coconut oil, curry leaf, black seed, and other traditional ingredients.",
      usage: "Warm a small amount between your palms and massage gently into the scalp. Leave in as long as you like, then wash out as usual.",
      price: "Price to be announced"
    },
    "root-rebirth-hair-pack": {
      kicker: "Hair Powder Pack", name: "Root Rebirth Hair Pack",
      desc: "A powder-based hair pack made from a mix of amla, shikakai, ashwagandha, and similar traditional powders — mixed with water or curd before application.",
      ingredients: "Amla, shikakai, ashwagandha, and similar traditional powders.",
      usage: "Mix with water or curd to a smooth paste. Apply from root to tip, leave until it dries, then rinse thoroughly.",
      price: "Price to be announced"
    },
    "ujaas-glow-soap": {
      kicker: "Soap", name: "Ujaas Glow Soap",
      desc: "A brightening soap positioned to even out skin tone with gentle, gradual use.",
      ingredients: "Full ingredient list to be shared once packaging is finalized.",
      usage: "Lather onto damp skin, massage gently, and rinse. Suitable for daily use.",
      price: "Price to be announced"
    },
    "dhoop-raksha-soap": {
      kicker: "Soap", name: "Dhoop Raksha Soap",
      desc: "“Dhoop” means sun, “Raksha” means protection — a soap positioned to reduce visible tan from sun exposure.",
      ingredients: "Full ingredient list to be shared once packaging is finalized.",
      usage: "Lather onto damp skin after sun exposure and rinse thoroughly. Use daily for best results.",
      price: "Price to be announced"
    },
    "poshan-soap": {
      kicker: "Soap", name: "Poshan Soap",
      desc: "“Poshan” means nourishment — an everyday, gentle, moisturising soap for daily use.",
      ingredients: "Full ingredient list to be shared once packaging is finalized.",
      usage: "Lather onto damp skin, massage, and rinse. Gentle enough for everyday use.",
      price: "Price to be announced"
    },
    "dulhan-nikhaar-soap": {
      kicker: "Soap", name: "Dulhan Nikhaar Soap",
      desc: "“Dulhan” means bride, “Nikhaar” means glow/radiance — a premium soap positioned for pre-wedding skin prep.",
      ingredients: "Full ingredient list to be shared once packaging is finalized.",
      usage: "Use daily, morning and night, in the weeks leading up to an event.",
      price: "Price to be announced"
    },
    "chehra-nikhaar-ubtan": {
      kicker: "Face Mask Powder", name: "Chehra Nikhaar Ubtan",
      desc: "“Chehra” means face, “Nikhaar” means glow, “Ubtan” is the traditional term for a face/body powder pack — positioned for soft, glowing, and even-toned skin.",
      ingredients: "Full ingredient list to be shared once packaging is finalized.",
      usage: "Mix with water, milk, or rosewater to a paste. Apply to clean skin, leave until semi-dry, then rinse off gently.",
      price: "Price to be announced"
    },
    "maa-ka-doodh-powder": {
      kicker: "Lactation Powder", name: "Maa Ka Doodh Powder",
      desc: "A powder mix formulated to support lactation for new and nursing mothers.",
      ingredients: "Full ingredient list to be shared once packaging is finalized.",
      usage: "Stir into a glass of warm milk and enjoy as part of your daily routine.",
      price: "Price to be announced"
    },
    "maa-fit-drink-mix": {
      kicker: "Weight Management", name: "Maa Fit Drink Mix",
      desc: "A drink mix positioned to support healthy post-pregnancy weight management.",
      ingredients: "Full ingredient list to be shared once packaging is finalized.",
      usage: "Mix with water and drink as part of a balanced daily routine.",
      price: "Price to be announced"
    },
    "maa-santulan-mix": {
      kicker: "Hormonal Health", name: "Maa Santulan Mix",
      desc: "“Santulan” means balance — a mix positioned to support hormonal balance.",
      ingredients: "Full ingredient list to be shared once packaging is finalized.",
      usage: "Prepare as directed and take as part of your daily routine.",
      price: "Price to be announced"
    },
    "maa-poshan-porridge": {
      kicker: "Porridge Mix", name: "Maa Poshan Porridge",
      desc: "A traditional multigrain porridge mix positioned for daily nourishment.",
      ingredients: "Full ingredient list to be shared once packaging is finalized.",
      usage: "Cook with water or milk to a warm porridge, sweetened or seasoned to taste.",
      price: "Price to be announced"
    },
    "maa-shakti-laddu": {
      kicker: "Dry Fruit Laddu", name: "Maa Shakti Laddu",
      desc: "“Shakti” means strength — energy-dense dry fruit laddus for new mothers.",
      ingredients: "Full ingredient list to be shared once packaging is finalized.",
      usage: "Enjoy one or two as a daily snack, as part of a balanced diet.",
      price: "Price to be announced"
    },
    "maa-ka-panjeeri": {
      kicker: "Panjeeri Mix", name: "Maa Ka Panjeeri",
      desc: "The classic postpartum panjeeri mix, prepared as a ready-to-cook blend.",
      ingredients: "Full ingredient list to be shared once packaging is finalized.",
      usage: "Prepare as directed with ghee, following the traditional method, and enjoy warm.",
      price: "Price to be announced"
    },
    "maa-ka-gond-halwa": {
      kicker: "Gond Halwa Mix", name: "Maa Ka Gond Halwa",
      desc: "The traditional gond (edible gum) halwa mix, prepared as a ready-to-cook blend.",
      ingredients: "Full ingredient list to be shared once packaging is finalized.",
      usage: "Prepare as directed with ghee, following the traditional method, and enjoy warm.",
      price: "Price to be announced"
    }
  };

  var pmodal = document.getElementById('pmodal');
  var pmodalBackdrop = document.getElementById('pmodalBackdrop');
  var pmodalClose = document.getElementById('pmodalClose');
  var lastFocused = null;

  function openProduct(pid){
    var p = PRODUCTS[pid];
    if(!p) return;
    document.getElementById('pmodalKicker').textContent = p.kicker;
    document.getElementById('pmodalTitle').textContent = p.name;
    document.getElementById('pmodalDesc').textContent = p.desc;
    document.getElementById('pmodalIngredients').textContent = p.ingredients;
    document.getElementById('pmodalUsage').textContent = p.usage;
    document.getElementById('pmodalPrice').textContent = p.price;
    lastFocused = document.activeElement;
    pmodal.classList.add('open');
    document.body.style.overflow = 'hidden';
    pmodalClose.focus();
  }
  function closeProduct(){
    pmodal.classList.remove('open');
    document.body.style.overflow = '';
    if(lastFocused){ lastFocused.focus(); }
  }

  document.querySelectorAll('.product-trigger').forEach(function(card){
    card.addEventListener('click', function(){ openProduct(card.getAttribute('data-pid')); });
    card.addEventListener('keydown', function(e){
      if(e.key === 'Enter' || e.key === ' '){ e.preventDefault(); openProduct(card.getAttribute('data-pid')); }
    });
  });
  pmodalBackdrop.addEventListener('click', closeProduct);
  pmodalClose.addEventListener('click', closeProduct);
  document.addEventListener('keydown', function(e){
    if(e.key === 'Escape' && pmodal.classList.contains('open')){ closeProduct(); }
  });
})();