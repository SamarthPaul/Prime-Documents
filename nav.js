/* PRIME Rural — Shared site navigation bar */
(function() {
  var pages = [
    { href: 'index.html', label: 'Home' },
    { href: 'brd.html', label: 'Living BRD' },
    { href: 'plan.html', label: 'Project Plan' },
    { href: 'status.html', label: 'Status Summary' },
    { href: 'wireframes.html', label: 'Wireframes' }
  ];

  var current = location.pathname.split('/').pop() || 'index.html';

  var nav = document.createElement('nav');
  nav.className = 'site-nav';
  nav.setAttribute('id', 'siteNav');

  var brand = document.createElement('a');
  brand.className = 'site-nav-brand';
  brand.href = 'index.html';
  brand.textContent = 'PRIME Rural';
  nav.appendChild(brand);

  var ul = document.createElement('ul');
  ul.className = 'site-nav-links';
  ul.id = 'siteNavLinks';

  for (var i = 0; i < pages.length; i++) {
    var li = document.createElement('li');
    var a = document.createElement('a');
    a.href = pages[i].href;
    a.textContent = pages[i].label;
    if (current === pages[i].href) a.className = 'active';
    li.appendChild(a);
    ul.appendChild(li);
  }
  nav.appendChild(ul);

  var btn = document.createElement('button');
  btn.className = 'site-nav-hamburger';
  btn.setAttribute('aria-label', 'Toggle menu');
  btn.innerHTML = '&#9776;';
  btn.onclick = function() { ul.classList.toggle('open'); };
  nav.appendChild(btn);

  // Insert as first child of body
  document.body.insertBefore(nav, document.body.firstChild);
})();
