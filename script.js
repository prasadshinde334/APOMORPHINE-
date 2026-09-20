const progressBar=document.getElementById('progressBar');
const nav=document.querySelector('.nav');
const revealEls=document.querySelectorAll('.reveal');
const reduceMotion=window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting)e.target.classList.add('visible')}),{threshold:.12});
revealEls.forEach(el=>observer.observe(el));

const sections=[...document.querySelectorAll('main section[id]')];
const navLinks=[...document.querySelectorAll('.nav nav a')];
function updateScrollUI(){
  const h=Math.max(1,document.documentElement.scrollHeight-innerHeight);
  progressBar.style.width=Math.min(100,Math.max(0,scrollY/h*100))+'%';
  nav.classList.toggle('scrolled',scrollY>20);
  let current=sections[0]?.id;
  sections.forEach(s=>{if(scrollY+innerHeight*.34>=s.offsetTop)current=s.id});
  navLinks.forEach(a=>a.classList.toggle('active',a.getAttribute('href')==='#'+current));
}
window.addEventListener('scroll',updateScrollUI,{passive:true});
window.addEventListener('resize',updateScrollUI);updateScrollUI();

// Patient journey: click a moment to change the clinical state.
const cards=[...document.querySelectorAll('.timeline-card')];
let step=0;
const timelineDot=document.getElementById('timelineDot');
const stepNo=document.getElementById('stepNo');
function showStep(i){
  if(!cards.length)return;
  step=(i+cards.length)%cards.length;
  cards.forEach((c,idx)=>c.classList.toggle('active',idx===step));
  if(stepNo)stepNo.textContent=String(step+1).padStart(2,'0');
  if(timelineDot)timelineDot.style.height=(step/(cards.length-1))*100+'%';
}
document.getElementById('next')?.addEventListener('click',()=>showStep(step+1));
document.getElementById('prev')?.addEventListener('click',()=>showStep(step-1));
cards.forEach((c,i)=>c.addEventListener('click',()=>showStep(i)));
if(!reduceMotion) setInterval(()=>showStep(step+1),7500);

// Treatment rows: clinician can select the row being discussed.
const matrixRows=[...document.querySelectorAll('.matrix-row:not(.head)')];
matrixRows.forEach(row=>row.addEventListener('click',()=>{
  matrixRows.forEach(r=>r.classList.remove('selected'));
  row.classList.add('selected');
}));

// Mechanism: click through the three scientific steps.
const mechSteps=[...document.querySelectorAll('.mech-step')];
mechSteps.forEach((el,i)=>el.addEventListener('click',()=>{
  mechSteps.forEach(x=>x.classList.remove('selected'));
  el.classList.add('selected');
  const target=el.querySelector('.circle');
  if(target&&!reduceMotion){target.animate([{transform:'scale(1)'},{transform:'scale(1.14)'},{transform:'scale(1)'}],{duration:500,easing:'ease-out'});}
}));

// Portfolio: keep the same content, but make the three formats selectable.
const portfolio=[...document.querySelectorAll('.portfolio-card')];
portfolio.forEach(card=>card.addEventListener('click',()=>{
  portfolio.forEach(x=>x.classList.remove('selected'));
  card.classList.add('selected');
}));

// 12-month plan: select a phase to make the strategic story easier to present.
const phases=[...document.querySelectorAll('.phase')];
phases.forEach(phase=>phase.addEventListener('click',()=>{
  phases.forEach(x=>x.classList.remove('selected'));
  phase.classList.add('selected');
}));

// Subtle hero parallax; disabled for reduced-motion users.
if(!reduceMotion){
  const hero=document.querySelector('.hero');
  const heroImg=document.querySelector('.hero-image');
  window.addEventListener('scroll',()=>{
    if(!hero||!heroImg)return;
    const y=Math.min(140,Math.max(-20,scrollY*.08));
    if(scrollY<hero.offsetTop+hero.offsetHeight)heroImg.style.transform=`scale(1.025) translateY(${y}px)`;
  },{passive:true});
}

showStep(0);
