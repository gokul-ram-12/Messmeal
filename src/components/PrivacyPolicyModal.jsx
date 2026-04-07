import React, { useMemo, useState } from 'react';
import { ExternalLink, Shield } from 'lucide-react';

const DPDP_ACT_URL = 'https://www.meity.gov.in/writereaddata/files/Digital%20Personal%20Data%20Protection%20Act%202023.pdf';
const GDPR_URL = 'https://gdpr-info.eu/';
const CONTACT_EMAIL = 'messmeal.notifications@gmail.com';

export default function PrivacyPolicyModal({ isOpen, onAccept }) {
  const [agreed, setAgreed] = useState(false);

  const currentYear = useMemo(() => new Date().getFullYear(), []);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[500] bg-black/85 backdrop-blur-sm">
      <div className="mx-auto flex h-full w-full max-w-4xl flex-col bg-white text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100">
        <header className="border-b border-zinc-200 px-4 py-4 sm:px-6 dark:border-zinc-800">
          <div className="flex items-start gap-3">
            <div className="rounded-xl bg-[#0057FF]/10 p-2 dark:bg-[#D4F000]/10">
              <Shield className="h-5 w-5 text-[#0057FF] dark:text-[#D4F000]" />
            </div>
            <div>
              <h2 className="text-lg font-bold sm:text-xl">Privacy Policy</h2>
              <p className="text-xs text-zinc-600 dark:text-zinc-400">You must agree to continue using MessMeal.</p>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto px-4 py-4 sm:px-6">
          <section className="space-y-4 text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
            <p>
              MessMeal (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;, or &quot;the App&quot;) is committed to protecting your privacy and ensuring
              transparency in how your information is handled; by accessing or using the App, you agree to the
              collection and use of information in accordance with this Privacy Policy.
            </p>

            <p>
              We may collect personal information including your name, email address, registration or employee ID,
              avatar, hostel and mess details, academic year, and contact information, along with user-generated data
              such as meal ratings, feedback, complaints, uploaded proofs (including images), and committee-related
              records like attendance, checklists, and meal logs; we also collect technical data such as device
              information, IP address, and app usage patterns to improve performance and user experience.
            </p>

            <p>
              Your information is used to operate, maintain, and enhance the App, manage meal services, process
              feedback and complaints, enable administrative and committee functions, send notifications and updates,
              and ensure compliance with policies while preventing misuse.
            </p>

            <p>
              We store and process your data securely using trusted third-party services such as Google Firebase, which
              may host data on secure cloud servers, and we implement industry-standard safeguards to protect your data
              from unauthorized access, alteration, or disclosure.
            </p>

            <p>
              We do not sell your personal information and only share it with authorized administrators, committee
              members, or service providers strictly as required for app functionality.
            </p>

            <p>
              Your data is retained only for as long as necessary to fulfill the purposes outlined in this policy or to
              comply with legal obligations, after which it is securely deleted or anonymized.
            </p>

            <p>
              You have the right to access, review, update, or request deletion of your personal data, as well as to
              opt out of non-essential notifications, subject to applicable laws such as the{' '}
              <a
                href={DPDP_ACT_URL}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 font-semibold text-[#0057FF] underline underline-offset-2 dark:text-[#D4F000]"
              >
                Digital Personal Data Protection Act, 2023
                <ExternalLink className="h-3.5 w-3.5" />
              </a>{' '}
              and, where applicable, the{' '}
              <a
                href={GDPR_URL}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 font-semibold text-[#0057FF] underline underline-offset-2 dark:text-[#D4F000]"
              >
                General Data Protection Regulation
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
              ; however, the App is not intended for use by individuals under the age of 18 without appropriate
              authorization.
            </p>

            <p>
              We may update this Privacy Policy from time to time, and any changes will be communicated through the App
              or other appropriate channels, with the updated date clearly indicated; continued use of the App after
              such changes constitutes acceptance of the revised policy.
            </p>

            <p>
              If you have any questions, concerns, or requests regarding this Privacy Policy or your data, you may
              contact us at{' '}
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="font-semibold text-[#0057FF] underline underline-offset-2 dark:text-[#D4F000]"
              >
                {CONTACT_EMAIL}
              </a>
              .
            </p>

            <p className="pt-1 font-semibold text-zinc-800 dark:text-zinc-100">
              © {currentYear} MessMeal. All rights reserved.
            </p>
          </section>
        </main>

        <footer className="border-t border-zinc-200 px-4 py-4 sm:px-6 dark:border-zinc-800">
          <label className="mb-3 flex items-start gap-3">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="mt-0.5 h-4 w-4 rounded border-zinc-300 text-[#0057FF] focus:ring-[#0057FF] dark:border-zinc-700 dark:bg-zinc-900 dark:text-[#D4F000] dark:focus:ring-[#D4F000]"
            />
            <span className="text-sm text-zinc-700 dark:text-zinc-300">
              I have read and agree to the Privacy Policy and Terms of Service.
            </span>
          </label>

          <button
            type="button"
            disabled={!agreed}
            onClick={onAccept}
            className="w-full rounded-xl bg-[#0057FF] px-4 py-3 text-sm font-bold uppercase tracking-wide text-white transition-all hover:bg-[#0047CC] disabled:cursor-not-allowed disabled:opacity-50 dark:bg-[#D4F000] dark:text-[#0D0D0D] dark:hover:bg-[#C0DB00]"
          >
            I Agree &amp; Continue
          </button>
        </footer>
      </div>
    </div>
  );
}
