const form=document.querySelector('#bookingForm');
const panels=[...document.querySelectorAll('.panel')];
const steps=[...document.querySelectorAll('.step')];
const prev=document.querySelector('#prev');
const next=document.querySelector('#next');
const submit=document.querySelector('#submit');
const error=document.querySelector('#error');
let current=0;

document.querySelector('[name="fecha"]').min=new Date().toISOString().split('T')[0];

function show(index){
  current=index;
  panels.forEach((p,i)=>p.classList.toggle('active',i===index));
  steps.forEach((s,i)=>{s.classList.toggle('active',i===index);s.classList.toggle('done',i<index)});
  prev.style.display=index?'inline-block':'none';
  next.style.display=index===panels.length-1?'none':'inline-block';
  submit.style.display=index===panels.length-1?'inline-block':'none';
  error.textContent='';window.scrollTo({top:0,behavior:'smooth'});
}

function validPanel(){
  const fields=[...panels[current].querySelectorAll('input,select,textarea')];
  const bad=fields.find(el=>!el.checkValidity());
  if(bad){bad.reportValidity();error.textContent='Revisa los campos obligatorios para continuar.';return false}
  return true;
}

next.addEventListener('click',()=>{if(validPanel())show(current+1)});
prev.addEventListener('click',()=>show(current-1));
steps.forEach((s,i)=>s.addEventListener('click',()=>{if(i<current||validPanel())show(i)}));

function fileLabel(inputId,labelId){
  const input=document.querySelector(`[name="${inputId}"]`);
  input.addEventListener('change',()=>document.querySelector(`#${labelId}`).textContent=input.files.length?([...input.files].map(f=>f.name).join(', ')):'Ningún archivo seleccionado');
}
fileLabel('referencias','referenceName');fileLabel('comprobante','receiptName');

form.addEventListener('submit',e=>{
  e.preventDefault();if(!validPanel())return;
  const data=new FormData(form);
  const date=new Date(`${data.get('fecha')}T12:00:00`).toLocaleDateString('es-MX',{day:'numeric',month:'long',year:'numeric'});
  document.querySelector('#summary').innerHTML=`<div><span>Cliente</span><strong>${escapeHtml(data.get('nombre'))}</strong></div><div><span>Fecha</span><strong>${date}</strong></div><div><span>Hora</span><strong>${data.get('hora')}</strong></div><div><span>Duración</span><strong>${escapeHtml(data.get('duracion'))}</strong></div><div><span>Estilo</span><strong>${escapeHtml(data.get('estilo'))}</strong></div>`;
  form.hidden=true;document.querySelector('.steps').hidden=true;document.querySelector('#success').hidden=false;
});
function escapeHtml(value){const el=document.createElement('div');el.textContent=value??'';return el.innerHTML}
document.querySelector('#newBooking').addEventListener('click',()=>{form.reset();form.hidden=false;document.querySelector('.steps').hidden=false;document.querySelector('#success').hidden=true;show(0)});
show(0);
