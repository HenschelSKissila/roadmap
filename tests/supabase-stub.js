/* Client Supabase de test : mêmes appels, mais vers un vrai PostgreSQL. */
/* Compte courant. `stub.uid` permet aux tests de simuler un second compte
   sur le même appareil — la situation qui déclenche l'erreur RLS. */
const UID0 = "22222222-2222-4222-8222-222222222222";
const USER = { id: localStorage.getItem('stub.uid') || UID0, email: "test@example.com" };
const API  = "http://localhost:8799";
const post = (b) => fetch(API, { method:'POST', body: JSON.stringify(b) }).then(r=>r.json())
                    .catch(e => ({ data:null, error:{ message:'network: '+e.message } }));
let session = JSON.parse(localStorage.getItem('stub.session')||'null');
if (session) session.user = USER;          // le test peut avoir changé de compte
const setS = v => { session=v; v?localStorage.setItem('stub.session',JSON.stringify(v))
                                :localStorage.removeItem('stub.session'); };
let cb=null;
function qb(table){
  const st={table, _rows:null};
  const thenable = (resolve,reject)=> post({op:'select',table,uid:USER.id}).then(resolve,reject);
  const o={
    select:()=>o, order:()=>o, limit:()=>o, eq:()=>o,
    maybeSingle:()=>post({op:'select',table,uid:USER.id}).then(r=>({data:(r.data&&r.data[0])||null,error:r.error})),
    upsert:(rows,opts)=>post({op:'upsert',table,rows:Array.isArray(rows)?rows:[rows],
                              onConflict:(opts&&opts.onConflict)||'id'}),
    delete:()=>({ match:(m)=>post({op:'delete',table,match:m}) }),
    then:(a,b)=>thenable(a,b)
  };
  return o;
}
window.supabase={createClient:()=>({
  auth:{
    getSession: async()=>({data:{session}}),
    onAuthStateChange:(f)=>{cb=f;return{data:{subscription:{unsubscribe(){}}}}},
    signInWithPassword: async({email,password})=>{
      const a=JSON.parse(localStorage.getItem('stub.acct')||'null');
      if(!a||a.email!==email||a.password!==password) return {data:{},error:{message:'Invalid login credentials'}};
      setS({user:USER}); cb&&cb('SIGNED_IN',session); return {data:{session},error:null};
    },
    signUp: async({email,password})=>{
      localStorage.setItem('stub.acct',JSON.stringify({email,password}));
      setS({user:USER}); cb&&cb('SIGNED_IN',session); return {data:{session,user:USER},error:null};
    },
    signOut: async()=>{setS(null);return{}}
  },
  from:(t)=>qb(t),
  channel:()=>{const ch={on:()=>ch,subscribe:()=>ch};return ch;}
})};
