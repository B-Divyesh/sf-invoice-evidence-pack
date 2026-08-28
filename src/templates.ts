import type { PacketTemplate } from './types';

export const BUILT_IN_TEMPLATES: PacketTemplate[] = [
  {
    id: 'cross-border-filing',
    name: 'Cross-border filing review',
    description: 'A jurisdiction-neutral starting point for accountant or filing preparation.',
    seeds: [
      { label: 'Issued invoice', description: 'The final invoice sent to the client.', required: true },
      { label: 'Scope or engagement record', description: 'Contract, purchase order, or written scope.', required: true },
      { label: 'Work delivery proof', description: 'Acceptance email, delivery receipt, or completion record.', required: true },
      { label: 'Payment receipt', description: 'Bank advice, processor receipt, or remittance record.', required: true },
      { label: 'Conversion or bank rate note', description: 'Rate source used when reporting in another currency.', required: false },
      { label: 'Withholding evidence', description: 'Certificate or client statement if tax was withheld.', required: false },
    ],
  },
  {
    id: 'client-review',
    name: 'Client payment review',
    description: 'Evidence for a client accounts-payable or procurement review.',
    seeds: [
      { label: 'Issued invoice', description: 'The exact invoice under review.', required: true },
      { label: 'Purchase order or contract', description: 'The agreed commercial authorization.', required: true },
      { label: 'Delivery or acceptance proof', description: 'Evidence that the work or goods were accepted.', required: true },
      { label: 'Timesheet or activity report', description: 'Supporting detail when the engagement is time-based.', required: false },
      { label: 'Correspondence note', description: 'Relevant approval or exception conversation.', required: false },
    ],
  },
  {
    id: 'payment-trail',
    name: 'Payment trail',
    description: 'A compact chain from engagement through settlement.',
    seeds: [
      { label: 'Engagement record', description: 'Contract, statement of work, or accepted quote.', required: true },
      { label: 'Issued invoice', description: 'The final invoice.', required: true },
      { label: 'Payment advice', description: 'Client remittance advice or processor receipt.', required: true },
      { label: 'Bank credit record', description: 'Statement extract showing the settled funds.', required: true },
      { label: 'Fee breakdown', description: 'Processor or correspondent-bank fee record.', required: false },
    ],
  },
];

