import './styles.css';
import type { EvidenceItem, Packet, PacketTemplate } from './types';
import { BUILT_IN_TEMPLATES } from './templates';
import { listCustomTemplates, listPackets, removePacket, replaceAllData, savePacket, saveTemplate } from './storage';
import { createBackup, download, exportPdf, exportZip, parseBackup } from './exports';
import { captureReturnedLicense, checkoutUrl, hasOptimisticLicense, storeLicense, verifyLicense } from './license';
import { displayBytes, escapeHtml, localDate, nowIso, progressFor, sha256, shortHash } from './utils';

const app = document.querySelector<HTMLDivElement>('#app') as HTMLDivElement;
if (!app) throw new Error('App mount was not found.');

let packets: Packet[] = [];
let customTemplates: PacketTemplate[] = [];
let selectedId = '';
let loading = true;
let storageError = '';
let notice = '';
let licensed = false;
let online = navigator.onLine;
let updateWorker: ServiceWorker | undefined;

function icon(name: 'plus' | 'leaf' | 'file' | 'download' | 'lock' | 'trash' | 'sun' | 'menu'): string {
  const paths = {
    plus: '<path d="M12 5v14M5 12h14"/>',
    leaf: '<path d="M5 20c1-9 6-14 15-15 0 9-5 14-15 15Z"/><path d="m7 18 10-10"/>',
    file: '<path d="M6 3h8l4 4v14H6Z"/><path d="M14 3v5h5M9 13h6M9 17h6"/>',
    download: '<path d="M12 3v12m0 0 5-5m-5 5-5-5M5 21h14"/>',
    lock: '<rect x="5" y="10" width="14" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/>',
    trash: '<path d="M4 7h16M9 3h6l1 4H8l1-4Zm-2 4 1 14h8l1-14M10 11v6M14 11v6"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5 19 19M19 5l-1.5 1.5M6.5 17.5 5 19"/>',
    menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
  };
  return `<svg class="icon" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${paths[name]}</svg>`;
}

function header(): string {
  return `<header class="site-header">
    <a class="brand" href="/" aria-label="Invoice Packet home"><img src="/icons/mark.svg" width="38" height="38" alt=""><span>Invoice Packet</span></a>
    <nav aria-label="Primary">
      <a href="/">Packets</a><a href="/privacy/">Privacy</a><a href="/terms/">Terms</a>
    </nav>
    <div class="header-tools">
      <span class="network ${online ? '' : 'offline'}" role="status"><span></span>${online ? 'Local first' : 'Offline'}</span>
      <button class="icon-button" data-action="theme" aria-label="Switch color theme">${icon('sun')}</button>
    </div>
  </header>`;
}

function footer(): string {
  return `<footer><div><strong>Invoice Packet</strong><p>Evidence, collected. Files never leave your device unless you export them.</p></div><div class="footer-links"><a href="/privacy/">Privacy</a><a href="/terms/">Terms</a><a href="https://github.com/B-Divyesh/sf-invoice-evidence-pack" target="_blank" rel="noreferrer">Source</a></div><p class="provenance">Botanical artwork generated for this product with the factory image model.</p></footer>`;
}

function legalPage(kind: 'privacy' | 'terms'): string {
  const privacy = `<p class="eyebrow">Privacy note · effective 28 August 2026</p><h1>Private by construction.</h1>
    <p class="lede">Invoice Packet is a local-first tool. Your invoices, evidence files, notes, and packet records stay in your browser's IndexedDB until you delete them or export them.</p>
    <h2>What stays on your device</h2><p>Packet details, attachments, file hashes, custom templates, settings, and license tokens are stored locally. We do not operate document storage or analytics for this app.</p>
    <h2>When data leaves</h2><p>Only two deliberate actions can send data elsewhere: following the checkout link, or verifying a license token with the Sociobot billing API. Verification sends the license token—not packet contents or filenames. Exported files go only to the location you choose.</p>
    <h2>Your controls</h2><p>Use “Back up all data” before clearing browser storage or changing devices. Deleting a packet removes its local record and files. Clearing site data removes everything, including the saved license token.</p>
    <h2>Payments</h2><p>Sociobot/Dodo is the merchant of record. Its checkout privacy terms apply to payment information; this app never sees card details.</p>`;
  const terms = `<p class="eyebrow">Terms · effective 28 August 2026</p><h1>A careful tool, not an adviser.</h1>
    <p class="lede">Invoice Packet helps organize evidence. It does not provide legal, tax, accounting, foreign-exchange, or filing advice, and it does not submit anything to an authority.</p>
    <h2>Your responsibility</h2><p>You decide which checklist applies, verify packet contents, keep backups, use suitable passwords, and obtain professional advice for your jurisdiction. A “complete” label means only that every item you marked required has a file.</p>
    <h2>One-time license</h2><p>The $19 one-time unlock enables reusable custom templates and encrypted ZIP exports for this product. Core packet building, hashing, JSON backup, plain ZIP, and PDF manifests remain free. Sociobot/Dodo is the merchant of record and handles payment and refunds. A refund or charge reversal revokes the license.</p>
    <h2>Software and availability</h2><p>The software is provided “as is,” without warranties. Browser storage can be cleared by device policy or user action, so keep independent backups. License verification may be temporarily unavailable offline; a recent valid verdict continues optimistically.</p>
    <h2>Acceptable use</h2><p>Do not use the service or billing endpoint unlawfully, attempt to defeat license checks, or package malicious files for others.</p>`;
  return `${header()}<main id="main" class="legal"><article>${kind === 'privacy' ? privacy : terms}<p><a class="text-link" href="/">Return to your packets</a></p></article></main>${footer()}`;
}

function allTemplates(): PacketTemplate[] {
  return [...BUILT_IN_TEMPLATES, ...customTemplates];
}

function templateOptions(): string {
  return allTemplates().map((template) => `<option value="${escapeHtml(template.id)}">${escapeHtml(template.name)}${template.custom ? ' · My template' : ''}</option>`).join('');
}

function dialogs(): string {
  return `<dialog id="new-packet-dialog" aria-labelledby="new-packet-title"><form method="dialog" id="new-packet-form">
    <div class="dialog-head"><div><p class="eyebrow">New specimen</p><h2 id="new-packet-title">Start an evidence packet</h2></div><button class="icon-button" type="button" data-close-dialog aria-label="Close dialog">×</button></div>
    <label>Packet name <span>Required</span><input name="title" required maxlength="100" placeholder="Acme · INV-042" autocomplete="off"></label>
    <div class="form-pair"><label>Invoice number<input name="invoiceNumber" maxlength="80" autocomplete="off"></label><label>Invoice date<input name="invoiceDate" type="date"></label></div>
    <label>Client or counterparty<input name="client" maxlength="100" autocomplete="organization"></label>
    <div class="form-pair"><label>Jurisdiction or review context<input name="jurisdiction" maxlength="100" placeholder="India · GST review"></label><label>Currency<input name="currency" maxlength="12" placeholder="USD"></label></div>
    <label>Starting checklist<select name="templateId">${templateOptions()}</select></label>
    <p class="fine-print">You can change every checklist item. Templates are organizational starting points, not jurisdiction or tax advice.</p>
    <div class="dialog-actions"><button class="button secondary" type="button" data-close-dialog>Cancel</button><button class="button primary" type="submit">Create packet</button></div>
  </form></dialog>
  <dialog id="add-item-dialog" aria-labelledby="add-item-title"><form method="dialog" id="add-item-form">
    <div class="dialog-head"><div><p class="eyebrow">Checklist</p><h2 id="add-item-title">Add evidence item</h2></div><button class="icon-button" type="button" data-close-dialog aria-label="Close dialog">×</button></div>
    <label>Item name <span>Required</span><input name="label" required maxlength="100"></label>
    <label>What should this prove?<textarea name="description" rows="3" maxlength="240"></textarea></label>
    <label class="check-label"><input name="required" type="checkbox" checked> Required for this packet</label>
    <div class="dialog-actions"><button class="button secondary" type="button" data-close-dialog>Cancel</button><button class="button primary" type="submit">Add item</button></div>
  </form></dialog>
  <dialog id="encrypt-dialog" aria-labelledby="encrypt-title"><form method="dialog" id="encrypt-form">
    <div class="dialog-head"><div><p class="eyebrow">AES-256 protection</p><h2 id="encrypt-title">Set an export password</h2></div><button class="icon-button" type="button" data-close-dialog aria-label="Close dialog">×</button></div>
    <p>Use a password you can share separately. It cannot be recovered by Invoice Packet.</p>
    <label>Password <span>At least 10 characters</span><input name="password" type="password" minlength="10" required autocomplete="new-password"></label>
    <label>Confirm password<input name="confirmPassword" type="password" minlength="10" required autocomplete="new-password"></label>
    <p class="form-error" id="password-error" aria-live="polite"></p>
    <div class="dialog-actions"><button class="button secondary" type="button" data-close-dialog>Cancel</button><button class="button primary" type="submit">Export encrypted ZIP</button></div>
  </form></dialog>
  <dialog id="license-dialog" aria-labelledby="license-title"><form method="dialog" id="license-form">
    <div class="dialog-head"><div><p class="eyebrow">Field kit upgrade</p><h2 id="license-title">Own the complete toolkit</h2></div><button class="icon-button" type="button" data-close-dialog aria-label="Close dialog">×</button></div>
    <p><strong>$19, one time.</strong> Unlock AES-256 encrypted ZIP exports and reusable custom checklist templates. No subscription or document upload.</p>
    <a class="button primary full" href="${checkoutUrl}">Buy the one-time unlock</a>
    <div class="rule-label"><span>Restore purchase</span></div>
    <label>License token<input name="license" required autocomplete="off" spellcheck="false"></label>
    <p class="form-error" id="license-error" aria-live="polite"></p>
    <button class="button secondary full" type="submit">Verify and restore</button>
    <p class="fine-print">Sociobot/Dodo is the merchant of record. Refunds are handled there and revoke the license. <a href="/privacy/">Privacy</a> · <a href="/terms/">Terms</a></p>
  </form></dialog>
  <input type="file" id="backup-input" accept="application/json,.json" hidden>`;
}

function emptyState(): string {
  return `<section class="hero">
    <div class="hero-copy"><p class="eyebrow">A private field kit for invoice evidence</p><h2>Gather the whole story.<br><em>Once.</em></h2>
      <p>Collect the invoice, work proof, payment trail, and accountant context around one business event. See what is missing, hash every file, then bind a review-ready packet—without uploading a thing.</p>
      <div class="hero-actions"><button class="button primary" data-action="new">${icon('plus')} Start your first packet</button><span>No account · Works offline</span></div>
    </div>
    <figure class="hero-art"><picture><source srcset="/assets/hero-field-guide-768.webp 768w, /assets/hero-field-guide-1536.webp 1536w" type="image/webp"><img src="/assets/hero-field-guide-768.jpg" width="768" height="512" alt="An open botanical field folio with a blank document, evidence tags, fern specimens, and a magnifying glass" fetchpriority="high" decoding="async"></picture><figcaption><span>Plate 01</span> One invoice, every supporting trace.</figcaption></figure>
  </section>
  <section class="method" aria-labelledby="method-title"><div><p class="eyebrow">The collecting method</p><h2 id="method-title">A packet your reviewer can follow.</h2></div><ol><li><span>01</span><div><h3>Choose a field list</h3><p>Start from a filing, client-review, or payment-trail checklist. Adapt it to the request you actually received.</p></div></li><li><span>02</span><div><h3>Pin every trace</h3><p>Files stay in this browser. Each attachment receives a SHA-256 fingerprint for later verification.</p></div></li><li><span>03</span><div><h3>Bind and hand over</h3><p>Export the evidence and manifest as ZIP, or produce a compact PDF index for your accountant.</p></div></li></ol></section>`;
}

function packetList(): string {
  return `<aside class="packet-nav" aria-label="Saved packets"><div class="aside-title"><div><p class="eyebrow">Field cabinet</p><h2>Your packets</h2></div><button class="icon-button bordered" data-action="new" aria-label="Create packet">${icon('plus')}</button></div>
    <div class="packet-list">${packets.map((packet) => {
      const progress = progressFor(packet);
      return `<button class="packet-tab ${packet.id === selectedId ? 'active' : ''}" data-action="select" data-id="${escapeHtml(packet.id)}" aria-current="${packet.id === selectedId ? 'true' : 'false'}"><span><strong>${escapeHtml(packet.title)}</strong><small>${escapeHtml(packet.invoiceNumber || 'No invoice number')} · ${progress.percent}% complete</small></span><span class="specimen-no">${String(packets.indexOf(packet) + 1).padStart(2, '0')}</span></button>`;
    }).join('')}</div>
    <div class="data-tools"><p>Your cabinet is stored only in this browser.</p><button class="text-button" data-action="backup">${icon('download')} Back up all data</button><button class="text-button" data-action="import">${icon('file')} Import backup</button></div>
  </aside>`;
}

function evidenceRow(item: EvidenceItem, index: number): string {
  return `<li class="evidence ${item.file ? 'collected' : item.required ? 'missing' : ''}">
    <div class="evidence-number">${String(index + 1).padStart(2, '0')}</div>
    <div class="evidence-body"><div class="evidence-heading"><div><h3>${escapeHtml(item.label)}</h3><p>${escapeHtml(item.description || 'No description added.')}</p></div><span class="status-mark">${item.file ? '✓ Collected' : item.required ? '! Required' : 'Optional'}</span></div>
    ${item.file ? `<div class="file-slip">${icon('file')}<div><strong>${escapeHtml(item.fileName || 'Evidence file')}</strong><span>${displayBytes(item.fileSize)} · SHA-256 <code title="${item.sha256}">${shortHash(item.sha256)}</code></span></div><label class="mini-button">Replace<input type="file" data-item="${escapeHtml(item.id)}"></label><button class="mini-button danger" data-action="remove-file" data-item="${escapeHtml(item.id)}">Remove</button></div>` : `<div class="collect-slot"><label class="button secondary">${icon('plus')} Add evidence<input type="file" data-item="${escapeHtml(item.id)}"></label><span>Any file · 100 MB maximum</span></div>`}
    <div class="item-controls"><label class="check-label compact"><input type="checkbox" data-item-required="${escapeHtml(item.id)}" ${item.required ? 'checked' : ''}> Required</label><button class="text-button danger" data-action="remove-item" data-item="${escapeHtml(item.id)}">${icon('trash')} Remove item</button></div></div>
  </li>`;
}

function editor(packet: Packet): string {
  const progress = progressFor(packet);
  return `<article class="packet-editor">
    <div class="packet-top"><div><p class="eyebrow">Specimen ${String(packets.findIndex((row) => row.id === packet.id) + 1).padStart(2, '0')} · updated ${localDate(packet.updatedAt)}</p><h2>${escapeHtml(packet.title)}</h2></div><button class="icon-button bordered danger" data-action="delete" aria-label="Delete ${escapeHtml(packet.title)}">${icon('trash')}</button></div>
    <section class="progress-sheet" aria-label="Packet completion"><div class="progress-copy"><span class="progress-number">${progress.percent}<small>%</small></span><div><strong>${progress.missing.length ? `${progress.missing.length} required ${progress.missing.length === 1 ? 'item' : 'items'} missing` : 'Ready for first review'}</strong><span>${progress.complete} of ${progress.required} required items collected</span></div></div><div class="progress-track" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${progress.percent}" aria-label="Required evidence collected"><span style="width:${progress.percent}%"></span></div></section>
    <section class="worksheet" aria-labelledby="details-title"><div class="section-heading"><div><p class="section-no">I · Field label</p><h2 id="details-title">Identify the business event</h2></div><p>Keep this factual. It appears in the exported manifest.</p></div>
      <div class="details-grid"><label>Packet name<input data-field="title" maxlength="100" value="${escapeHtml(packet.title)}" required></label><label>Invoice number<input data-field="invoiceNumber" maxlength="80" value="${escapeHtml(packet.invoiceNumber)}"></label><label>Client or counterparty<input data-field="client" maxlength="100" value="${escapeHtml(packet.client)}"></label><label>Invoice date<input data-field="invoiceDate" type="date" value="${escapeHtml(packet.invoiceDate)}"></label><label>Jurisdiction / review context<input data-field="jurisdiction" maxlength="100" value="${escapeHtml(packet.jurisdiction)}"></label><label>Currency<input data-field="currency" maxlength="12" value="${escapeHtml(packet.currency)}"></label></div>
    </section>
    <section class="worksheet" aria-labelledby="evidence-title"><div class="section-heading"><div><p class="section-no">II · Evidence specimens</p><h2 id="evidence-title">Collect the supporting trace</h2></div><button class="button secondary" data-action="add-item">${icon('plus')} Add checklist item</button></div>
      <ol class="evidence-list">${packet.items.map(evidenceRow).join('')}</ol>
      ${packet.items.length === 0 ? '<div class="inline-empty"><p>Your checklist is empty.</p><button class="button secondary" data-action="add-item">Add the first item</button></div>' : ''}
      <div class="template-save"><div><strong>Reuse this field list</strong><span>Save its labels and requirements as a new template. Files are never copied.</span></div><button class="button secondary" data-action="save-template">${licensed ? 'Save as template' : `${icon('lock')} Unlock custom templates`}</button></div>
    </section>
    <section class="worksheet" aria-labelledby="notes-title"><div class="section-heading"><div><p class="section-no">III · Margin notes</p><h2 id="notes-title">Leave context for the reviewer</h2></div><p>Explain exceptions, rate sources, or intentional omissions.</p></div><label>Accountant or reviewer notes<textarea data-field="notes" rows="7" maxlength="5000" placeholder="Example: Payment arrived net of a correspondent-bank fee…">${escapeHtml(packet.notes)}</textarea></label></section>
    <section class="bind-sheet" aria-labelledby="export-title"><div class="bind-copy"><p class="section-no">IV · Bind the folio</p><h2 id="export-title">Prepare the handover</h2><p>${progress.missing.length ? `The manifest will clearly flag ${progress.missing.length} missing required ${progress.missing.length === 1 ? 'item' : 'items'}. You can still export a working packet.` : 'Every required item has been collected. The packet is ready for a first review.'}</p><label class="check-label"><input id="redact-filenames" type="checkbox"> Redact original filenames in exports</label></div>
      <div class="export-actions"><button class="button primary" data-action="zip">${icon('download')} Export ZIP packet</button><button class="button secondary" data-action="pdf">Export PDF manifest</button><button class="button secondary" data-action="encrypted">${icon('lock')} ${licensed ? 'Encrypted ZIP' : 'Unlock encrypted ZIP'}</button></div>
    </section>
    <details class="history"><summary>Packet history</summary><ol>${packet.history.map((entry) => `<li><span>${escapeHtml(entry.action)}</span><time datetime="${escapeHtml(entry.at)}">${localDate(entry.at)}</time></li>`).join('')}</ol></details>
  </article>`;
}

function workspace(): string {
  const selected = packets.find((packet) => packet.id === selectedId) ?? packets[0];
  return `<div class="workspace">${packetList()}${selected ? editor(selected) : ''}</div>`;
}

function render(): void {
  const pathname = location.pathname.replace(/\/+$/, '') || '/';
  if (pathname === '/privacy' || pathname === '/terms') {
    app.innerHTML = legalPage(pathname.slice(1) as 'privacy' | 'terms');
    bindGlobalEvents();
    return;
  }
  app.innerHTML = `${header()}<main id="main"><h1 class="visually-hidden">Invoice Packet</h1>
    ${updateWorker ? '<div class="update-note" role="status">A fresh field kit is ready. <button data-action="update-sw">Update now</button></div>' : ''}
    ${loading ? '<div class="loading-state" role="status"><span class="pressed-leaf"></span><p>Opening your field cabinet…</p></div>' : storageError ? `<section class="error-state"><p class="eyebrow">Storage unavailable</p><h2>Your local cabinet could not open.</h2><p>${escapeHtml(storageError)}</p><button class="button secondary" data-action="reload">Reload the app</button></section>` : packets.length ? workspace() : emptyState()}
    <section class="assurance"><p class="eyebrow">Your papers stay yours</p><div><strong>Stored locally</strong><span>No document cloud and no account.</span></div><div><strong>Verifiable</strong><span>SHA-256 fingerprints travel with the manifest.</span></div><div><strong>Portable</strong><span>Plain ZIP, PDF, and full JSON backup are free.</span></div><button class="text-button" data-action="license">${licensed ? 'Complete toolkit unlocked' : 'Encrypted exports · $19 once'}</button></section>
  </main>${footer()}${dialogs()}<div class="toast" role="status" aria-live="polite" aria-atomic="true">${escapeHtml(notice)}</div>`;
  bindGlobalEvents();
}

function currentPacket(): Packet | undefined {
  return packets.find((packet) => packet.id === selectedId);
}

async function persist(packet: Packet, action?: string): Promise<void> {
  const at = nowIso();
  packet.updatedAt = at;
  if (action) packet.history = [{ at, action }, ...packet.history].slice(0, 24);
  await savePacket(packet);
}

function announce(message: string): void {
  notice = message;
  const toast = document.querySelector<HTMLElement>('.toast');
  if (toast) {
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3_500);
  }
}

function openDialog(id: string): void {
  document.querySelector<HTMLDialogElement>(`#${id}`)?.showModal();
}

function incompleteOkay(packet: Packet): boolean {
  const missing = progressFor(packet).missing;
  return !missing.length || window.confirm(`${missing.length} required ${missing.length === 1 ? 'item is' : 'items are'} missing. Export this working packet anyway?`);
}

async function handleAction(button: HTMLElement): Promise<void> {
  const action = button.dataset.action;
  if (action === 'new') openDialog('new-packet-dialog');
  if (action === 'theme') {
    const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.theme = next;
    localStorage.setItem('invoice-packet-theme', next);
  }
  if (action === 'select') { selectedId = button.dataset.id || ''; render(); }
  if (action === 'add-item') openDialog('add-item-dialog');
  if (action === 'license') openDialog('license-dialog');
  if (action === 'reload') location.reload();
  if (action === 'update-sw' && updateWorker) updateWorker.postMessage({ type: 'SKIP_WAITING' });
  const packet = currentPacket();
  if (!packet) return;
  if (action === 'delete' && confirm(`Delete “${packet.title}” and every locally stored attachment? This cannot be undone.`)) {
    await removePacket(packet.id);
    packets = packets.filter((row) => row.id !== packet.id);
    selectedId = packets[0]?.id || '';
    render();
    announce('Packet deleted from this device.');
  }
  if (action === 'remove-file') {
    const item = packet.items.find((row) => row.id === button.dataset.item);
    if (item && confirm(`Remove “${item.fileName}” from this packet? The original file on your device is not affected.`)) {
      delete item.file; delete item.fileName; delete item.fileType; delete item.fileSize; delete item.fileModified; delete item.sha256;
      await persist(packet, `Removed evidence from ${item.label}`); render(); announce('Evidence removed from the packet.');
    }
  }
  if (action === 'remove-item') {
    const item = packet.items.find((row) => row.id === button.dataset.item);
    if (item && confirm(`Remove checklist item “${item.label}”${item.file ? ' and its locally stored evidence' : ''}?`)) {
      packet.items = packet.items.filter((row) => row.id !== item.id);
      await persist(packet, `Removed checklist item: ${item.label}`); render(); announce('Checklist item removed.');
    }
  }
  if (action === 'zip' && incompleteOkay(packet)) {
    button.setAttribute('aria-busy', 'true'); announce('Binding ZIP packet…');
    try { await exportZip(packet, document.querySelector<HTMLInputElement>('#redact-filenames')?.checked ?? false); announce('ZIP packet exported.'); } catch { announce('The ZIP could not be prepared. Try again or export a backup.'); }
    button.removeAttribute('aria-busy');
  }
  if (action === 'pdf' && incompleteOkay(packet)) {
    button.setAttribute('aria-busy', 'true'); announce('Preparing PDF manifest…');
    try { await exportPdf(packet, document.querySelector<HTMLInputElement>('#redact-filenames')?.checked ?? false); announce('PDF manifest exported.'); } catch { announce('The PDF could not be prepared. Try the ZIP manifest instead.'); }
    button.removeAttribute('aria-busy');
  }
  if (action === 'encrypted') licensed ? openDialog('encrypt-dialog') : openDialog('license-dialog');
  if (action === 'save-template') {
    if (!licensed) openDialog('license-dialog');
    else {
      const name = prompt('Name this reusable checklist:', `${packet.title} checklist`)?.trim();
      if (name) {
        const template: PacketTemplate = { id: crypto.randomUUID(), name, description: 'A checklist saved from one of your packets.', custom: true, seeds: packet.items.map(({ label, description, required }) => ({ label, description, required })) };
        await saveTemplate(template); customTemplates.push(template); render(); announce('Custom template saved on this device.');
      }
    }
  }
  if (action === 'backup') {
    announce('Preparing your complete local backup…');
    try {
      const data = await createBackup(packets, customTemplates);
      download(new Blob([JSON.stringify(data)], { type: 'application/json' }), `invoice-packet-backup-${new Date().toISOString().slice(0, 10)}.json`);
      announce('Backup exported. Keep it somewhere safe.');
    } catch { announce('The backup could not be prepared. Check available memory and try again.'); }
  }
  if (action === 'import') document.querySelector<HTMLInputElement>('#backup-input')?.click();
}

function bindGlobalEvents(): void {
  document.querySelectorAll<HTMLElement>('[data-action]').forEach((element) => element.addEventListener('click', () => void handleAction(element)));
  document.querySelectorAll<HTMLButtonElement>('[data-close-dialog]').forEach((button) => button.addEventListener('click', () => button.closest('dialog')?.close()));
  document.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>('[data-field]').forEach((input) => input.addEventListener('change', async () => {
    const packet = currentPacket(); const field = input.dataset.field as keyof Packet | undefined;
    if (!packet || !field || typeof packet[field] !== 'string') return;
    (packet[field] as string) = input.value;
    if (field === 'title' && !input.value.trim()) { input.value = packet.title = 'Untitled packet'; }
    await persist(packet, field === 'notes' ? 'Updated reviewer notes' : 'Updated packet details');
    render(); announce('Changes saved locally.');
  }));
  document.querySelectorAll<HTMLInputElement>('input[type="file"][data-item]').forEach((input) => input.addEventListener('change', async () => {
    const packet = currentPacket(); const item = packet?.items.find((row) => row.id === input.dataset.item); const file = input.files?.[0];
    if (!packet || !item || !file) return;
    if (file.size > 100 * 1024 * 1024) { announce('That file is over the 100 MB per-file limit. Choose a smaller file.'); input.value = ''; return; }
    announce(`Fingerprinting ${file.name}…`);
    try {
      const hash = await sha256(file);
      Object.assign(item, { file, fileName: file.name, fileType: file.type || 'application/octet-stream', fileSize: file.size, fileModified: file.lastModified, sha256: hash });
      await persist(packet, `Collected evidence: ${item.label}`); render(); announce('Evidence stored locally and fingerprinted.');
    } catch { announce('The file could not be read. Choose it again or try another file.'); }
  }));
  document.querySelectorAll<HTMLInputElement>('[data-item-required]').forEach((input) => input.addEventListener('change', async () => {
    const packet = currentPacket(); const item = packet?.items.find((row) => row.id === input.dataset.itemRequired);
    if (!packet || !item) return;
    item.required = input.checked; await persist(packet, `Marked ${item.label} ${item.required ? 'required' : 'optional'}`); render(); announce('Requirement updated.');
  }));
  bindForms();
}

function bindForms(): void {
  document.querySelector<HTMLFormElement>('#new-packet-form')?.addEventListener('submit', async (event) => {
    event.preventDefault(); const form = event.currentTarget as HTMLFormElement; if (!form.reportValidity()) return;
    const data = new FormData(form); const template = allTemplates().find((row) => row.id === data.get('templateId')) ?? BUILT_IN_TEMPLATES[0]; const at = nowIso();
    const packet: Packet = {
      id: crypto.randomUUID(), title: String(data.get('title')).trim(), invoiceNumber: String(data.get('invoiceNumber')).trim(), client: String(data.get('client')).trim(), invoiceDate: String(data.get('invoiceDate')), jurisdiction: String(data.get('jurisdiction')).trim(), currency: String(data.get('currency')).trim().toUpperCase(), templateId: template.id, notes: '',
      items: template.seeds.map((seed) => ({ ...seed, id: crypto.randomUUID() })), createdAt: at, updatedAt: at, history: [{ at, action: `Created from ${template.name}` }],
    };
    await savePacket(packet); packets.unshift(packet); selectedId = packet.id; (form.closest('dialog') as HTMLDialogElement).close(); form.reset(); render(); announce('Packet created and saved locally.');
  });
  document.querySelector<HTMLFormElement>('#add-item-form')?.addEventListener('submit', async (event) => {
    event.preventDefault(); const form = event.currentTarget as HTMLFormElement; if (!form.reportValidity()) return; const packet = currentPacket(); if (!packet) return; const data = new FormData(form);
    packet.items.push({ id: crypto.randomUUID(), label: String(data.get('label')).trim(), description: String(data.get('description')).trim(), required: data.get('required') === 'on' });
    await persist(packet, `Added checklist item: ${String(data.get('label')).trim()}`); (form.closest('dialog') as HTMLDialogElement).close(); form.reset(); render(); announce('Checklist item added.');
  });
  document.querySelector<HTMLFormElement>('#encrypt-form')?.addEventListener('submit', async (event) => {
    event.preventDefault(); const form = event.currentTarget as HTMLFormElement; if (!form.reportValidity()) return; const data = new FormData(form); const password = String(data.get('password')); const confirmPassword = String(data.get('confirmPassword')); const error = form.querySelector<HTMLElement>('#password-error');
    if (password !== confirmPassword) { if (error) error.textContent = 'The passwords do not match. Re-enter both values.'; return; }
    const packet = currentPacket(); if (!packet || !incompleteOkay(packet)) return; const submit = form.querySelector<HTMLButtonElement>('[type="submit"]'); submit?.setAttribute('aria-busy', 'true'); announce('Encrypting and binding your packet…');
    try { await exportZip(packet, document.querySelector<HTMLInputElement>('#redact-filenames')?.checked ?? false, password); (form.closest('dialog') as HTMLDialogElement).close(); form.reset(); announce('Encrypted ZIP exported.'); } catch { if (error) error.textContent = 'The encrypted ZIP could not be prepared. Check available memory and try again.'; }
    submit?.removeAttribute('aria-busy');
  });
  document.querySelector<HTMLFormElement>('#license-form')?.addEventListener('submit', async (event) => {
    event.preventDefault(); const form = event.currentTarget as HTMLFormElement; if (!form.reportValidity()) return; const token = String(new FormData(form).get('license')).trim(); const error = form.querySelector<HTMLElement>('#license-error'); storeLicense(token);
    try { const result = await verifyLicense(true); if (!result.valid) { if (error) error.textContent = `That license is not active (${result.reason || 'invalid'}). Check the token and try again.`; return; } licensed = true; (form.closest('dialog') as HTMLDialogElement).close(); render(); announce('Complete toolkit unlocked on this device.'); } catch (cause) { if (error) error.textContent = cause instanceof Error ? cause.message : 'The license could not be checked.'; }
  });
  document.querySelector<HTMLInputElement>('#backup-input')?.addEventListener('change', async (event) => {
    const input = event.currentTarget as HTMLInputElement; const file = input.files?.[0]; if (!file) return;
    if (!confirm('Importing replaces every packet and custom template currently in this browser. Continue?')) { input.value = ''; return; }
    try { const restored = parseBackup(await file.text()); await replaceAllData(restored.packets, restored.templates); packets = restored.packets; customTemplates = restored.templates; selectedId = packets[0]?.id || ''; render(); announce('Backup restored on this device.'); } catch (cause) { announce(cause instanceof Error ? cause.message : 'The backup could not be imported.'); }
  });
}

async function registerServiceWorker(): Promise<void> {
  if (!('serviceWorker' in navigator) || import.meta.env.DEV) return;
  try {
    const registration = await navigator.serviceWorker.register('/sw.js');
    if (registration.waiting) { updateWorker = registration.waiting; render(); }
    registration.addEventListener('updatefound', () => {
      const worker = registration.installing;
      worker?.addEventListener('statechange', () => { if (worker.state === 'installed' && navigator.serviceWorker.controller) { updateWorker = worker; render(); } });
    });
    navigator.serviceWorker.addEventListener('controllerchange', () => location.reload());
  } catch { announce('Offline installation is unavailable, but your local packets still work.'); }
}

async function initialize(): Promise<void> {
  const savedTheme = localStorage.getItem('invoice-packet-theme');
  if (savedTheme === 'dark' || savedTheme === 'light') document.documentElement.dataset.theme = savedTheme;
  captureReturnedLicense(); licensed = hasOptimisticLicense();
  render();
  window.addEventListener('online', () => { online = true; render(); });
  window.addEventListener('offline', () => { online = false; render(); });
  try {
    [packets, customTemplates] = await Promise.all([listPackets(), listCustomTemplates()]);
    selectedId = packets[0]?.id || '';
  } catch (cause) { storageError = cause instanceof Error ? cause.message : 'This browser did not provide persistent local storage.'; }
  loading = false; render(); void registerServiceWorker();
  if (licensed && navigator.onLine) {
    try { const result = await verifyLicense(); if (!result.valid) { licensed = false; render(); announce('This license is no longer active. Free tools remain available.'); } } catch { /* cached offline access remains */ }
  }
}

void initialize();
