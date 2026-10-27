// Mini-PostgREST : exécute le MÊME SQL que Supabase (INSERT ... ON CONFLICT),
// pour que les tests du navigateur se heurtent aux vraies contraintes.
const http = require('http'); const { Client } = require('pg');
const c = new Client({ host: '/var/tmp', port: 55432, user: 'postgres', database: 'postgres' });
const ready = c.connect();
const J = (res, code, obj) => { res.writeHead(code, {'Content-Type':'application/json',
  'Access-Control-Allow-Origin':'*','Access-Control-Allow-Headers':'*','Access-Control-Allow-Methods':'*'});
  res.end(JSON.stringify(obj)); };
http.createServer(async (req, res) => {
  if (req.method === 'OPTIONS') return J(res, 200, {});
  let body=''; for await (const ch of req) body += ch;
  let q; try { q = JSON.parse(body||'{}'); } catch { return J(res,400,{error:{message:'bad json'}}); }
  await ready;
  try {
    if (q.op === 'select') {
      const r = q.uid
        ? await c.query(`select * from ${q.table} where user_id = $1`, [q.uid])
        : await c.query(`select * from ${q.table}`);
      return J(res, 200, { data: r.rows, error: null });
    }
    if (q.op === 'upsert') {
      const rows = q.rows; if (!rows.length) return J(res,200,{data:null,error:null});
      const cols = [...new Set(rows.flatMap(Object.keys))];
      const conflict = q.onConflict.split(',').map(s=>s.trim());
      const upd = cols.filter(k => !conflict.includes(k));
      const vals=[]; const tuples = rows.map(r =>
        '(' + cols.map(k => { vals.push(r[k] === undefined ? null : r[k]); return '$'+vals.length; }).join(',') + ')');
      // RLS : sur ON CONFLICT DO UPDATE, PostgreSQL vérifie la clause USING de
      // la politique sur la ligne EXISTANTE. Si elle appartient à un autre
      // compte, la mise à jour est refusée — c'est l'erreur qu'a vue hks.
      if (!conflict.includes('user_id') && cols.includes('user_id')) {
        for (const r of rows) {
          const wh = conflict.map((k,i)=>`${k}=$${i+1}`).join(' and ');
          const ex = await c.query(`select user_id from ${q.table} where ${wh} limit 1`,
                                   conflict.map(k=>r[k]));
          if (ex.rows.length && ex.rows[0].user_id !== r.user_id)
            return J(res, 403, { code:'42501', error: { code:'42501', message:
              `new row violates row-level security policy (USING expression) for table "${q.table}"` } });
        }
      }
      const sql = `insert into ${q.table} (${cols.join(',')}) values ${tuples.join(',')}
                   on conflict (${conflict.join(',')}) do update set ${
                     (upd.length?upd:cols).map(k=>`${k}=excluded.${k}`).join(',')}`;
      await c.query(sql, vals);
      return J(res, 200, { data: null, error: null });
    }
    if (q.op === 'delete') {
      const ks = Object.keys(q.match);
      const sql = `delete from ${q.table} where ` + ks.map((k,i)=>`${k}=$${i+1}`).join(' and ');
      await c.query(sql, ks.map(k=>q.match[k]));
      return J(res, 200, { data: null, error: null });
    }
    J(res, 400, { error: { message: 'unknown op' } });
  } catch (e) { J(res, 400, { error: { message: e.message, code: e.code, details: e.detail } }); }
}).listen(8799, () => console.log('mini-postgrest sur 8799'));
