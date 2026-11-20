import { mkdir, readFile, writeFile, rename } from 'node:fs/promises';
import path from 'node:path';
import type { ContactInput } from '../routes/contact';
const directory = path.resolve(process.cwd(), '.data'); const file = path.join(directory, 'contacts.json');
interface DemoContact extends ContactInput { id: number; createdAt: string }
let queue: Promise<void> = Promise.resolve();
export function saveDemoContact(input: ContactInput): Promise<number> {
  const operation = queue.then(async () => {
    await mkdir(directory, { recursive: true }); let records: DemoContact[] = [];
    try { records = JSON.parse(await readFile(file, 'utf8')) as DemoContact[]; } catch (error) { if (!(typeof error === 'object' && error !== null && 'code' in error && error.code === 'ENOENT')) throw error; }
    const id = (records.at(-1)?.id ?? 0) + 1; records.push({ ...input, id, createdAt: new Date().toISOString() });
    await writeFile(`${file}.tmp`, JSON.stringify(records, null, 2), { mode: 0o600 }); await rename(`${file}.tmp`, file); return id;
  }); queue = operation.then(() => {}, () => {}); return operation;
}
