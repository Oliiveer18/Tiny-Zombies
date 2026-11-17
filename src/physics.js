// Física de objetos en el plano (sin THREE ni DOM): círculos y cajas orientadas, rozamiento, choques, dormir,
// impulso de bala y de granada. Paso fijo a 60 Hz, orden por índice: sin Math.random ni relojes (norma 3). Diseño: RESPUESTAS_FABLE/005 §1.
// Orientación = vector unidad u=(cx,cz) del eje +x del objeto; w = giro de u en el plano (de x hacia z).
const H=1/60,GF=10,GV=22,MAXA=24,AMAX=1.7453292519943295,SIN_MAX=0.984807753012208; // AMAX = 100°; cos/sin de 100° como constantes (la simulación no llama a sin/cos)
const COSMAX=-0.17364817766693033; // GF: gravedad para el rozamiento; GV: gravedad del salto (la de Tiny)
export function createPhysics(mats,objs){
  const bodies=[],P={kBala:10,gBala:3.6,topeBala:6,topeW:8,topeGranada:12,fGranada:400,ultimo:null}; // fGranada: fuerza de la granada (400 = 16·25); ultimo: clase del último objeto golpeado (para las barras de ?debug) // kBala: factor de juego (el impulso real es diminuto); 💡 ajustable
  let acc=0,active=0,tickN=0;const hinges=[];
  const sq=Math.sqrt;
  function mk(id,key,x,z,rot,o,statico){
    const m=mats[o.mat]||{mu:.6,e:.2,transf:1},circ=o.forma==='circulo';
    const mass=statico?Infinity:o.masa,hx=circ?o.r:o.hx,hz=circ?o.r:o.hz;
    const I=statico?Infinity:(circ?mass*hx*hx/2:mass*(4*hx*hx+4*hz*hz)/12);
    const b={id,key,circ,hx,hz,rad:sq(hx*hx+hz*hz),x,z,cx:Math.cos(rot),cz:-Math.sin(rot),vx:0,vz:0,w:0,y:0,vy:0,m:mass,invM:statico?0:1/mass,invI:statico?0:1/I,
      vuelca:o.vuelca||0,tumbado:false,m0:mass,I0:I,mu:o.mu!==undefined?o.mu:m.mu,mu0:o.mu!==undefined?o.mu:m.mu,e:m.e,transf:m.transf,statico:!!statico,asleep:!!statico,still:0,dirty:false,prop:null};
    bodies.push(b);return b;}
  const norm=b=>{const l=sq(b.cx*b.cx+b.cz*b.cz)||1;b.cx/=l;b.cz/=l;};
  // ---- detección de contacto: devuelve {nx,nz,pen,px,pz} con la normal de A hacia B, o null
  function circCirc(A,B){const dx=B.x-A.x,dz=B.z-A.z,d=sq(dx*dx+dz*dz),s=A.hx+B.hx;if(d>=s)return null;
    const nx=d>1e-6?dx/d:1,nz=d>1e-6?dz/d:0;return {nx,nz,pen:s-d,px:A.x+nx*(A.hx-(s-d)/2),pz:A.z+nz*(A.hx-(s-d)/2)};}
  function circBox(C,X){ // normal de C (círculo) hacia X (caja)
    const rx=C.x-X.x,rz=C.z-X.z,ux=X.cx,uz=X.cz,vx=-X.cz,vz=X.cx,lx=rx*ux+rz*uz,lz=rx*vx+rz*vz;
    const qx=Math.max(-X.hx,Math.min(X.hx,lx)),qz=Math.max(-X.hz,Math.min(X.hz,lz)),dx=lx-qx,dz=lz-qz,d2=dx*dx+dz*dz,r=C.hx;
    if(d2>=r*r)return null;let nlx,nlz,pen;
    if(d2>1e-10){const d=sq(d2);nlx=dx/d;nlz=dz/d;pen=r-d;}
    else{const px=X.hx-Math.abs(lx),pz=X.hz-Math.abs(lz);if(px<pz){nlx=lx<0?-1:1;nlz=0;pen=px+r;}else{nlx=0;nlz=lz<0?-1:1;pen=pz+r;}}
    const wx=ux*nlx+vx*nlz,wz=uz*nlx+vz*nlz; // de la caja hacia el círculo
    return {nx:-wx,nz:-wz,pen,px:X.x+ux*qx+vx*qz,pz:X.z+uz*qx+vz*qz};}
  function boxBox(A,B){
    const dx=B.x-A.x,dz=B.z-A.z;let best=1e9,bnx=0,bnz=0,bra=0;
    const axes=[[A.cx,A.cz],[-A.cz,A.cx],[B.cx,B.cz],[-B.cz,B.cx]];
    for(const [ax,az] of axes){
      const ra=A.hx*Math.abs(ax*A.cx+az*A.cz)+A.hz*Math.abs(ax*-A.cz+az*A.cx),rb=B.hx*Math.abs(ax*B.cx+az*B.cz)+B.hz*Math.abs(ax*-B.cz+az*B.cx);
      let dd=dx*ax+dz*az;const ov=ra+rb-Math.abs(dd);if(ov<=0)return null;
      if(ov<best){best=ov;const s=dd<0?-1:1;bnx=ax*s;bnz=az*s;bra=ra;}}
    return {nx:bnx,nz:bnz,pen:best,px:A.x+bnx*(bra-best/2),pz:A.z+bnz*(bra-best/2)};}
  function contact(A,B){
    if(A.circ&&B.circ)return circCirc(A,B);
    if(A.circ)return circBox(A,B);
    if(B.circ){const c=circBox(B,A);return c&&{nx:-c.nx,nz:-c.nz,pen:c.pen,px:c.px,pz:c.pz};}
    return boxBox(A,B);}
  function resolve(A,B,c){
    let iA=A.statico||A.asleep?0:A.invM,iB=B.statico||B.asleep?0:B.invM;
    const rAx=c.px-A.x,rAz=c.pz-A.z,rBx=c.px-B.x,rBz=c.pz-B.z;
    const vAx=A.vx-A.w*rAz,vAz=A.vz+A.w*rAx,vBx=B.vx-B.w*rBz,vBz=B.vz+B.w*rBx,rvx=vBx-vAx,rvz=vBz-vAz,vn=rvx*c.nx+rvz*c.nz;
    if(vn<-.3){if(A.asleep&&!A.statico){A.asleep=false;A.still=0;iA=A.invM;}if(B.asleep&&!B.statico){B.asleep=false;B.still=0;iB=B.invM;}}
    const sum=iA+iB;if(!sum)return;
    const corr=Math.max(c.pen-.005,0)*.8/sum; // separar sin hundirse
    A.x-=c.nx*corr*iA;A.z-=c.nz*corr*iA;B.x+=c.nx*corr*iB;B.z+=c.nz*corr*iB;
    if(vn>=0)return;
    const e=vn>-.5?0:Math.min(A.e,B.e),cA=rAx*c.nz-rAz*c.nx,cB=rBx*c.nz-rBz*c.nx,iIA=A.statico||A.asleep?0:A.invI,iIB=B.statico||B.asleep?0:B.invI;
    const den=sum+cA*cA*iIA+cB*cB*iIB,j=-(1+e)*vn/den,jx=c.nx*j,jz=c.nz*j;
    A.vx-=jx*iA;A.vz-=jz*iA;A.w-=(rAx*jz-rAz*jx)*iIA;B.vx+=jx*iB;B.vz+=jz*iB;B.w+=(rBx*jz-rBz*jx)*iIB;
    // rozamiento en el contacto
    const tx=-c.nz,tz=c.nx,vt=rvx*tx+rvz*tz,tA=rAx*tz-rAz*tx,tB=rBx*tz-rBz*tx,dT=sum+tA*tA*iIA+tB*tB*iIB;
    let jt=-vt/dT;const mu=sq(A.mu*B.mu),mx=mu*j;if(jt>mx)jt=mx;else if(jt<-mx)jt=-mx;
    const fx=tx*jt,fz=tz*jt;A.vx-=fx*iA;A.vz-=fz*iA;A.w-=(rAx*fz-rAz*fx)*iIA;B.vx+=fx*iB;B.vz+=fz*iB;B.w+=(rBx*fz-rBz*fx)*iIB;
  }
  // ---- reja con bisagra (PAQ-02): un grado de libertad. Ángulo a (0 = cerrada, AMAX = abierta), velocidad w; la orientación se guarda como vector (ca,sa), sin sin/cos.
  const dirH=h=>[h.d0x*h.ca,h.d0z*h.ca-h.sa]; // dirección de la hoja desde el pivote; las hojas se abren hacia −z
  function placeH(h){const d=dirH(h);h.dx=d[0];h.dz=d[1];const b=h.body;b.x=h.px+d[0]*h.largo/2;b.z=h.pz+d[1]*h.largo/2;b.cx=d[0];b.cz=d[1];}
  function stepH(h){if(h.roto)return;if(h.candado){h.w=0;return;}if(!h.w)return;
    h.a+=h.w*H;const c=h.ca-h.sa*h.w*H,s=h.sa+h.ca*h.w*H,l=sq(c*c+s*s);h.ca=c/l;h.sa=s/l;
    if(h.a<0){h.a=0;h.ca=1;h.sa=0;if(h.w<0)h.w*=-.2;}else if(h.a>AMAX){h.a=AMAX;h.ca=COSMAX;h.sa=SIN_MAX;if(h.w>0)h.w*=-.2;}
    h.w*=.96;if(Math.abs(h.w)<.005)h.w=0;placeH(h);}
  function sub(){
    active=0;tickN++;for(const h of hinges)stepH(h);
    for(const b of bodies){if(b.statico||b.asleep)continue;active++;b.dirty=true;
      if(b.y>0||b.vy>0){b.vy-=GV*H;b.y+=b.vy*H;if(b.y<=0){b.y=0;if(Math.abs(b.vy)>2.5){b.vy*=-.35;b.vx*=.6;b.vz*=.6;b.w*=.6;}else b.vy=0;}}
      b.x+=b.vx*H;b.z+=b.vz*H;
      if(b.w){b.cx-=b.cz*b.w*H;b.cz+=b.cx*b.w*H;norm(b);}
      if(b.y<=0){const sp=sq(b.vx*b.vx+b.vz*b.vz),dec=b.mu*GF*H;if(sp<=dec){b.vx=0;b.vz=0;}else{const k=(sp-dec)/sp;b.vx*=k;b.vz*=k;}
        const dw=b.mu*GF*H/b.rad;if(Math.abs(b.w)<=dw)b.w=0;else b.w-=dw*Math.sign(b.w);}}
    for(let pass=0;pass<2;pass++)
      for(let i=0;i<bodies.length;i++){const A=bodies[i];if(A.statico||A.asleep||A.y>.3)continue;
        for(let j=0;j<bodies.length;j++){if(j===i)continue;const B=bodies[j];
          if(!B.statico&&!B.asleep&&j<i)continue; // pareja activa-activa: una sola vez
          if(B.y>.3)continue;const dx=B.x-A.x,dz=B.z-A.z,rr=A.rad+B.rad;if(dx*dx+dz*dz>rr*rr)continue;
          const c=contact(A,B);if(c)resolve(A,B,c);}}
    for(const b of bodies){if(b.statico||b.asleep)continue;
      if(b.y===0&&b.vx*b.vx+b.vz*b.vz<.0025&&Math.abs(b.w)<.1){if(++b.still>=30){b.asleep=true;b.vx=b.vz=b.w=0;}}else b.still=0;}
    if(active>MAXA){const act=bodies.filter(b=>!b.statico&&!b.asleep).sort((a,b)=>(a.vx*a.vx+a.vz*a.vz)-(b.vx*b.vx+b.vz*b.vz)||a.id.localeCompare(b.id));
      for(let k=0;k<act.length-MAXA;k++){const b=act[k];b.asleep=true;b.vx=b.vz=b.w=0;}}
  }
  const nearH=(h,x,z)=>{const a=Math.max(0,Math.min(h.largo,(x-h.px)*h.dx+(z-h.pz)*h.dz)),qx=h.px+h.dx*a,qz=h.pz+h.dz*a;return {along:a,dist:sq((x-qx)*(x-qx)+(z-qz)*(z-qz)),qx,qz};};
  const impH=(h,jx,jz,d)=>{if(h.roto||h.candado)return;const tx=-h.d0x*h.sa,tz=-h.d0z*h.sa-h.ca;h.w+=(jx*tx+jz*tz)*d/h.I;}; // w += J·d/I, J perpendicular a la hoja (en el sentido de abrir)
  return {bodies,params:P,hinges,tick:()=>tickN,
    addHinge(def){const o=objs[def.clase];if(!o)return null;const L=def.largo,px=def.pivote[0],pz=def.pivote[1];
      const h={id:def.id,clase:def.clase,px,pz,largo:L,d0x:px>0?-1:1,d0z:0,ca:1,sa:0,a:0,w:0,dx:0,dz:0,vida:o.vida,candado:!!def.candado,cand:def.candado||null,roto:false,I:o.masa*L*L/3,obs:[],body:null};
      h.body=mk('h_'+def.id,def.clase,px,pz,0,{mat:o.mat,forma:'caja',hx:L/2,hz:o.hz,masa:o.masa},true);h.body.hinge=h;placeH(h);hinges.push(h);return h;},
    hingeNear:nearH,hingeImpulse:impH,
    hingeHit(h,dx,dz,hx,hz){const n=nearH(h,hx,hz);impH(h,dx*P.gBala*P.kBala,dz*P.gBala*P.kBala,Math.max(n.along,.2));}, // bala: 3,6·kBala·1 a la distancia del impacto
    hingeState(){return hinges.map(h=>({id:h.id,a:h.a,w:h.w,vida:h.vida,candado:h.candado}));},
    impulse(b,dx,dz,J){if(!b||b.statico)return;b.asleep=false;b.still=0;b.vx+=dx*J*b.invM;b.vz+=dz*J*b.invM;}, // empujón en el centro (sin giro), p. ej. «Usar»: 60 kg·m/s
    claseInfo(key){const bs=bodies.filter(b=>b.key===key&&!b.statico);if(!bs.length)return null;const b=bs[0];return {n:bs.length,k:b.m/b.m0,mu:b.mu};},
    setMasa(key,k){for(const b of bodies)if(b.key===key&&!b.statico){b.m=b.m0*k;b.invM=1/b.m;b.invI=1/(b.I0*k);}},
    setMu(key,mu){for(const b of bodies)if(b.key===key&&!b.statico)b.mu=mu;},
    addProp(p){const o=objs[p.key];if(!o)return null;const b=mk(p.id,p.key,p.x,p.z,p.rot,o,!!o.fijo);b.prop=p;p.body=b;return b;},
    remove(b){const i=bodies.indexOf(b);if(i>=0)bodies.splice(i,1);},
    addBox(id,x,z,hx,hz,rot){return mk(id,'muro',x,z,rot,{mat:'hormigon',forma:'caja',hx,hz,masa:1},true);},
    step(dt){acc+=dt;let n=0;while(acc>=H&&n<2){sub();acc-=H;n++;}if(acc>H)acc=H;return n;}, // máximo 2 pasos por cuadro: si el móvil va lento, la física se atrasa
    hit(b,dx,dz,hx,hz){ // impulso de una bala en (hx,hz) con dirección unidad (dx,dz)
      if(!b||b.statico)return;P.ultimo=b.key;const J=P.gBala*P.kBala*b.transf,dv=Math.min(J*b.invM,P.topeBala),Je=dv*b.m;
      b.asleep=false;b.still=0;b.vx+=dx*dv;b.vz+=dz*dv;if(b.vuelca&&Je>b.vuelca&&!b.tumbado){b.tumbado=true;b.mu*=.4;} // vuelco: un impulso fuerte lo acuesta y rueda más
      const rx=hx-b.x,rz=hz-b.z,dw=(rx*dz-rz*dx)*Je*b.invI;b.w=Math.max(-P.topeW,Math.min(P.topeW,b.w+dw));},
    blast(x,z,R,J0){for(const b of bodies){if(b.statico)continue;const dx=b.x-x,dz=b.z-z,d=sq(dx*dx+dz*dz);if(d>=R)continue;
      const J=J0*(1-d/R),dv=Math.min(J*b.invM,P.topeGranada),ux=d>1e-6?dx/d:1,uz=d>1e-6?dz/d:0;
      if(b.vuelca&&J>b.vuelca&&!b.tumbado){b.tumbado=true;b.mu*=.4;}b.asleep=false;b.still=0;b.vx+=ux*dv;b.vz+=uz*dv;b.vy=Math.min(8,.5*dv);if(b.vy>0&&b.y===0)b.y=.001;
      b.w=Math.max(-10,Math.min(10,b.w+(ux*b.cz-uz*b.cx)*dv*1.5));}},
    state(){return bodies.filter(b=>!b.statico).map(b=>[b.id,+b.x.toFixed(5),+b.z.toFixed(5),+b.cx.toFixed(5),+b.cz.toFixed(5),b.asleep?1:0].join(',')).join(';')+hinges.map(h=>';H:'+h.id+','+h.a.toFixed(5)+','+h.w.toFixed(5)).join('');}};
}
