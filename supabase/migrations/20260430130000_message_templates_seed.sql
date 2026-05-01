-- Dragun · message templates seed (FR + EN)
-- Renders use Mustache-style {{var}} tokens. cadence.ts buildVars() supplies:
--   org.display_name, org.signature
--   debtor.full_name, debtor.first_name
--   case.amount_display, case.description, case.paylink_url

insert into public.message_templates (id, locale, channel, subject, body) values

-- ─────────────────────────── email-day-0 ───────────────────────────
('email-day-0', 'fr', 'email',
  'Petit rappel — votre paiement reste à régler',
  E'Bonjour {{debtor.first_name}},\n\nPetit rappel : votre {{case.description}} chez {{org.display_name}} ({{case.amount_display}}) n''a pas encore été prélevée. Une carte expire parfois sans prévenir.\n\nMettez-la à jour en un clic : {{case.paylink_url}}\n\nMerci,\n{{org.signature}}'
),
('email-day-0', 'en', 'email',
  'Quick reminder — your payment is still due',
  E'Hi {{debtor.first_name}},\n\nQuick heads-up — your {{case.description}} at {{org.display_name}} ({{case.amount_display}}) hasn''t gone through yet. Sometimes a card just expires.\n\nUpdate in one tap: {{case.paylink_url}}\n\nThanks,\n{{org.signature}}'
),

-- ─────────────────────────── email-day-3 ───────────────────────────
('email-day-3', 'fr', 'email',
  'Petit suivi — toujours ouvert',
  E'Bonjour {{debtor.first_name}},\n\nPetit mot au cas où le dernier message vous aurait échappé. Même lien plus bas — aucuns frais de retard, sans tracas.\n\n{{case.paylink_url}}\n\n— {{org.signature}}'
),
('email-day-3', 'en', 'email',
  'Quick follow-up — still open',
  E'Hi {{debtor.first_name}},\n\nQuick note in case the last one slipped past. Same link below — no late fee, no drama.\n\n{{case.paylink_url}}\n\n— {{org.signature}}'
),

-- ─────────────────────────── email-day-7 ───────────────────────────
('email-day-7', 'fr', 'email',
  'Rappel courtois — {{case.description}}',
  E'{{debtor.first_name}} — soyons brefs. {{case.description}} ({{case.amount_display}}) doit être réglée cette semaine pour que votre accès reste actif.\n\nUn seul clic : {{case.paylink_url}}\n\n{{org.signature}}'
),
('email-day-7', 'en', 'email',
  'Gentle reminder — {{case.description}}',
  E'{{debtor.first_name}} — keeping it short. {{case.description}} ({{case.amount_display}}) just needs clearing this week so your access stays on. One tap below.\n\n{{case.paylink_url}}\n\n{{org.signature}}'
),

-- ─────────────────────────── sms-day-5 ───────────────────────────
('sms-day-5', 'fr', 'sms', null,
  E'{{org.display_name}} : Bonjour {{debtor.first_name}}, votre {{case.description}} ({{case.amount_display}}) reste due. Payez en un clic → {{case.paylink_url}} · Répondez STOP pour vous désinscrire.'
),
('sms-day-5', 'en', 'sms', null,
  E'{{org.display_name}}: Hi {{debtor.first_name}}, your {{case.description}} ({{case.amount_display}}) is still open. Pay in one tap → {{case.paylink_url}} · Reply STOP to opt out.'
),

-- ─────────────────────────── sms-day-10 ───────────────────────────
('sms-day-10', 'fr', 'sms', null,
  E'{{org.display_name}} : {{case.amount_display}} toujours en attente. On peut régler ça en douceur — {{case.paylink_url}}'
),
('sms-day-10', 'en', 'sms', null,
  E'{{org.display_name}}: {{case.amount_display}} still pending. Happy to sort it gently — {{case.paylink_url}}'
),

-- ─────────────────────────── call-day-12 ───────────────────────────
('call-day-12', 'fr', 'call', null,
  E'Bonjour {{debtor.first_name}}, ici l''agent Dragun pour {{org.display_name}}. Petit suivi — il semble que {{case.description}} de {{case.amount_display}} soit encore ouverte. Nous allons vous renvoyer le lien de paiement par texto. Merci, et bonne journée.'
),
('call-day-12', 'en', 'call', null,
  E'Hello {{debtor.first_name}}, this is the Dragun agent for {{org.display_name}}. Quick follow-up — it looks like {{case.description}} of {{case.amount_display}} is still open. We''ll send the pay link to you by text. Thank you, and have a great day.'
),

-- ─────────────────────────── sms-day-12 (after call) ───────────────────────────
('sms-day-12', 'fr', 'sms', null,
  E'{{org.display_name}} : suite à notre appel — {{case.paylink_url}} · {{case.amount_display}} · expire dans 24 h.'
),
('sms-day-12', 'en', 'sms', null,
  E'{{org.display_name}}: per our call — {{case.paylink_url}} · {{case.amount_display}} · expires in 24h.'
)

on conflict (id, locale) do update set
  channel = excluded.channel,
  subject = excluded.subject,
  body    = excluded.body;
