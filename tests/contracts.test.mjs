import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
test('six projects have local artwork and matching seed slugs', () => {
  const projects = JSON.parse(fs.readFileSync('server/src/db/projects.json','utf8'));
  assert.equal(projects.length,6); assert.equal(new Set(projects.map(p=>p.slug)).size,6);
  for(const p of projects){assert.ok(fs.existsSync(path.join('public',p.thumbnail)));assert.ok(p.tech.length>0);assert.ok(fs.readFileSync('server/db/seed.sql','utf8').includes(p.slug));}
});
test('requested SQL copies match',()=>{for(const name of ['schema.sql','seed.sql'])assert.equal(fs.readFileSync(`server/db/${name}`,'utf8'),fs.readFileSync(`server/src/db/${name}`,'utf8'));});
test('five testimonials have local avatars',()=>{const items=JSON.parse(fs.readFileSync('server/src/db/testimonials.json','utf8'));assert.equal(items.length,5);for(const item of items)assert.ok(fs.existsSync(path.join('public',item.avatar)));});
test('source contains no explicit any or unfinished comments',()=>{const walk=dir=>fs.readdirSync(dir,{withFileTypes:true}).flatMap(item=>item.isDirectory()?walk(path.join(dir,item.name)):[path.join(dir,item.name)]);for(const file of [...walk('src'),...walk('server/src')].filter(file=>/\.tsx?$/.test(file)))assert.doesNotMatch(fs.readFileSync(file,'utf8'),/:\s*any\b|as\s+any\b|\/\/\s*TODO\b/,file);});
