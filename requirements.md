# IP-SAKTI SAHAYAK

IP-SAKTI Sahayak is an evidence-first AI assistant for intellectual property research and assistance.

This document is the **SINGLE SOURCE OF TRUTH** for the IP-SAKTI Sahayak frontend. Future development phases must refer to this document without changing the established product direction. If a future request conflicts with this document, the latest explicit user instruction takes priority.

The product focuses on:

- Patents
- Prior art
- Traditional Knowledge
- Ayurveda and formulations
- Access and Benefit Sharing (ABS)
- IP laws and regulations
- Indian and international IP research
- Multilingual interaction
- Source-backed research
- Human IP facilitator review

The product should feel like a dedicated IP research workspace, **NOT** a generic AI chatbot.

---

## DESIGN DIRECTION

Use the provided visual references as the primary design reference.

The overall visual language should be:

- Minimal
- Clean
- Premium
- Professional
- Calm
- Trustworthy
- Evidence-first
- Legal + scientific
- Modern
- Spacious

The interface should prioritize:

- Strong visual hierarchy
- Excellent whitespace
- Clear typography
- Subtle borders
- Restrained use of color
- Consistent components
- Clear information hierarchy
- Responsive layouts

Avoid:

- Generic ChatGPT cloning
- Neon AI aesthetics
- Excessive gradients
- Excessive glassmorphism
- Excessive rounded cards
- Heavy shadows
- Fake 3D elements
- Excessive decorative illustrations
- Emoji-based UI
- Unnecessary animations
- Fake statistics
- Fake testimonials
- Fake government endorsements

Do not introduce a new visual language on individual pages. All pages must feel like parts of the same product.

---

## APPLICATION STRUCTURE

The application has these primary routes:

| Route         | Purpose                          |
| ------------- | -------------------------------- |
| `/`           | Home / Landing page              |
| `/ask`        | New IP research chat             |
| `/chats`      | User's saved chats               |
| `/analysis`   | Analysis and research history    |
| `/sources`    | Authoritative source library     |
| `/review`     | Human IP facilitator review      |
| `/formulation`| Formulation workspace (optional) |

The application should use a **shared application shell** containing:

- Sidebar
- Header
- Main content area

The sidebar and header are shared across application pages.

---

## GLOBAL HEADER

**Left:**
- Sidebar toggle
- IP-SAKTI branding

**Center:**
- Global search button

**Right:**
- Application language selector
- Clerk profile button

The header should remain minimal and responsive. Search functionality can be implemented later.

---

## GLOBAL SIDEBAR

**Navigation:**

- Home
- Ask Sahayak
- My Chats
- Analysis
- Sources
- Human Review

Each item should have:

- Consistent icon
- Label
- Active state
- Hover state
- Keyboard accessibility

The sidebar must:

- Collapse on desktop
- Become a drawer on mobile
- Preserve navigation functionality when collapsed
- Show tooltips for icon-only navigation
- Highlight the active route

---

## APPLICATION LANGUAGE / i18n

The **ENTIRE APPLICATION UI** must use i18n.

Initial supported languages:

- English
- Hindi
- Kannada

Use one centralized localization system. Recommended structure:

```
src/
  i18n/
    index.ts
    locales/
      en.json
      hi.json
      kn.json
```

All user-facing UI text must come from these translation files, including:

- Navigation
- Headers
- Buttons
- Labels
- Placeholders
- Forms
- Page titles
- Status messages
- Error messages
- Empty states
- Tooltips
- Accessibility labels
- Investigation labels
- Source descriptions
- Review workflow
- Footer
- Success messages

**Never hardcode user-facing English strings inside components.**

Every future page must add complete translations for English, Hindi, and Kannada. The three translation files must maintain the same key structure.

---

## CRITICAL LANGUAGE SEPARATION

The application's UI language is **completely separate** from AI conversation language.

The global language selector controls ONLY the **APPLICATION UI LANGUAGE**.

It does **NOT** control:

- User input language
- AI response language
- Voice input language
- AI translation behavior

Example: If the user selects Kannada, the sidebar, header, buttons, labels, and page content become Kannada. The user can still type in English, Hindi, Kannada, or another supported language. The AI independently determines/processes input and response language.

**Never connect the i18n selector directly to AI response language.**

---

## CLERK AUTHENTICATION

Use Clerk for authentication and user identity. The global profile button must be connected to Clerk.

The authenticated Clerk user ID will later be used to associate:

- Chats
- Analysis history
- Review requests
- User-specific data

Clerk is responsible for authentication and identity. **Clerk is NOT the application's chat database.** Actual chat and application data will be stored through the application backend/database.

---

## HOME `/`

The Home route is the product landing page. It should communicate:

- What IP-SAKTI Sahayak is
- Why IP research needs better tools
- Core capabilities
- How Sahayak works
- AI investigation
- Evidence-first research
- Technical architecture
- Working demonstration
- Use cases
- Multilingual capability
- Trust and responsible use
- Human review
- Call to action

Suggested sections:

1. Hero
2. Why IP research needs better tools
3. Core capabilities
4. How Sahayak works
5. AI Investigation preview
6. Evidence-first research
7. Architecture
8. Working demo video
9. Use cases
10. Multilingual capability
11. Trust / responsible use
12. Human review
13. Final CTA
14. Footer

The Home page should feel like a polished product presentation, not a dashboard.

---

## `/ASK`

`/ask` is the primary conversational IP research workspace.

On first open, show a minimal new-chat interface including:

- India / International jurisdiction selector
- Question input
- Document attachment
- Saved / Temporary option
- Voice input
- Send button
- Suggested questions

When the user sends the first question:

1. Create a new Chat ID.
2. Associate it with the authenticated Clerk user.
3. Send the question to the backend.
4. Run the AI research pipeline.
5. Show the AI Investigation state.
6. Show the evidence-first answer.
7. Save the conversation.

---

## AI INVESTIGATION

AI Investigation is one of the signature UI components. It should make **safe research metadata** visible.

Possible investigation information:

- Language detected
- Jurisdiction
- IP type
- Formulation type
- Legal sources searched
- Patent prior art searched
- Traditional knowledge searched
- ABS relevance checked
- Evidence ranked
- Citations verified

Only show investigation steps that are actually relevant. **Do not expose hidden chain-of-thought.** Research Trail should show safe execution metadata only.

---

## RESEARCH TRAIL

A Research Trail control should be available on relevant analysis or answer screens.

When opened, it can show:

- Query received
- Language detected
- Jurisdiction selected
- IP type identified
- Formulation classification
- Sources searched
- Evidence collected
- Evidence ranked
- Citations verified
- Answer generated

This is a transparency/audit feature. It must **not** expose private chain-of-thought.

---

## EVIDENCE-FIRST ANSWERS

Important answers should emphasize evidence. Responses can include:

- Answer
- Confidence
- Evidence
- Source
- Section
- Page
- Citation
- View source
- Why this answer

Use evidence/citation cards rather than relying only on numbered citations such as `[1]`, `[2]`, `[3]`. The application should communicate that AI-generated information is grounded in retrieved evidence.

---

## RELEVANT AREAS

After relevant answers, show detected areas where appropriate. Examples:

- Patent
- Traditional Knowledge
- ABS
- India
- International
- Formulation
- Trademark
- Design

Only display areas relevant to the current query. Do not display irrelevant empty categories.

---

## VOICE RESPONSE

AI responses can provide a voice/listen control supporting:

- Start
- Pause
- Stop

It should be reusable across relevant chat and analysis responses.

---

## FOLLOW-UP CHAT

After an AI response, users can continue the same conversation. The follow-up input should remain minimal and provide:

- Follow-up text input
- Document attachment where supported
- Send button

The conversation must continue under the same Chat ID.

---

## FORMULATION WORKSPACE

Route: `/formulation`

The formulation workflow is a separate structured experience. If introduced, it should contain:

- Formulation name
- Ingredients
- Intended use
- Preparation / process
- Traditional use (optional)
- Voice input
- Analyze button

There should be **NO document attachment** in the initial formulation workspace.

When the user selects Analyze:

1. Create a Chat ID.
2. Associate it with the authenticated user.
3. Analyze the formulation.
4. Show formulation-specific investigation.
5. Show a structured formulation profile.
6. Show relevant IP considerations.
7. Show ABS relevance where applicable.
8. Show traditional knowledge relevance where applicable.
9. Show potentially relevant prior art.
10. Allow human review.
11. Allow follow-up interaction.

---

## FORMULATION PROFILE

The formulation result should use **structured cards** rather than a normal conversational answer.

Possible sections:

**FORMULATION PROFILE**
- Formulation classification
- System
- Ingredients
- Biological resources detected
- Traditional knowledge indicators

**IP CONSIDERATIONS**
- Patent
- Traditional Knowledge
- ABS

**POTENTIAL ABS RELEVANCE**
- Assessment
- Explanation
- Preliminary status

**POTENTIALLY RELEVANT PRIOR ART** (each result may show)
- Type
- Title
- Similarity signal
- Relevant feature
- View evidence

Similarity is an AI-assisted research signal and must **NOT** be presented as a legal conclusion.

---

## MY CHATS

`/chats` contains conversations associated with the authenticated Clerk user.

Each chat should have:

- Chat ID
- Title
- Date/time
- Type
- Jurisdiction
- Last activity

Opening a chat should restore the conversation.

Chat types may include:

- General IP research
- Formulation analysis
- Prior-art research
- Other supported workflows

---

## ANALYSIS

`/analysis` provides an overview of the user's previous research and analysis activity. It can later contain:

- Recent analyses
- Formulation analyses
- Research activity
- IP areas
- Evidence activity
- Review requests

**Do not fabricate statistics.** Only show real data available from the backend.

---

## SOURCES

`/sources` is the authoritative source library. It should list documents/resources used by Sahayak.

Possible sources include:

- India Code
- IP India
- WIPO
- Ministry of AYUSH
- TKDL
- Other approved authoritative sources

Each source/resource can contain:

- Name
- Description
- Category
- Jurisdiction
- Authority/source type
- Document/resource name
- External link

Users should be able to understand where Sahayak's evidence comes from. **Do not fabricate source documents or links.**

---

## HUMAN REVIEW

`/review` is the human IP facilitator review workflow. A user can request professional review from relevant analysis/chat screens.

The review form should include:

- Reason for review
- Original question
- Chat ID
- Submit for Review

After successful submission, show:

- Review request submitted
- Request ID
- Status: Pending review

The Request ID must be generated dynamically by the backend. **Do not hardcode example IDs in the actual implementation.**

---

## SAFETY AND RESPONSIBLE USE

Sahayak is an AI research assistant. The UI must never imply:

- Guaranteed patentability
- Guaranteed legal correctness
- Guaranteed legal outcome
- Guaranteed patent success
- AI replacing an IP professional

Use language such as:

- Evidence found
- Potential relevance
- Review recommended
- Further assessment recommended
- Insufficient evidence
- Human review

The application should maintain a clear informational/legal disclaimer where appropriate.

---

## INDIA / INTERNATIONAL

The application supports jurisdiction-aware research. Users can select:

- India
- International

The selected jurisdiction should influence the relevant research workflow and backend query. The UI must make the distinction clear. India and international evidence should not be visually mixed without identifying the jurisdiction/source.

---

## RESPONSIVE DESIGN

Every component and route must be fully responsive. Support:

- Desktop
- Tablet
- Mobile

The application must not rely on desktop-only layouts.

Important responsive areas:

- Sidebar
- Header
- Chat interface
- Investigation
- Evidence cards
- Formulation forms
- Prior-art cards
- Source cards
- Review forms
- Architecture diagram
- Footer

On mobile:

- Sidebar becomes a drawer
- Content stacks naturally
- Header adapts
- Cards stack
- Controls remain accessible
- No horizontal scrolling

Translated Hindi/Kannada text must also fit naturally without clipping or breaking the layout.

---

## ACCESSIBILITY

All interactive UI must support:

- Keyboard navigation
- Visible focus states
- Accessible labels
- Appropriate ARIA attributes
- Sufficient contrast
- Screen-reader-friendly controls

Do not rely on color alone to communicate meaning.

---

## BACKEND INTEGRATION

The frontend will connect to an existing FastAPI backend.

The primary query endpoint is:

```
POST /query
```

The backend returns information including:

- answer
- confidence
- citations
- query type
- sufficiency
- source metadata

The frontend should be designed to **consume** this data rather than inventing its own AI results. **Do not create fake backend responses in production components.**

During UI development, mock data may be used only where necessary for visual development and must be clearly separated from real backend integration.

---

## PRODUCT PRINCIPLES

Always prioritize:

1. Evidence over decoration
2. Clarity over complexity
3. Trust over flashy AI effects
4. Reusable components over duplicated UI
5. Real data over fabricated content
6. Human review when AI evidence is insufficient
7. Transparency without exposing chain-of-thought
8. Consistent design across all routes
9. Complete multilingual UI
10. Responsive behavior everywhere

---

## DEVELOPMENT PHASES

Development should happen incrementally.

**PHASE 1 — Global application shell**
- Header, Sidebar, Routing, Responsive navigation, Search UI, Language selector, i18n, Clerk authentication/profile

**PHASE 2 — Home landing page**
- Hero, Features, How it works, AI investigation preview, Evidence-first section, Architecture, Demo video, Use cases, Multilingual section, Trust, Human review CTA, Footer

**PHASE 3 — Ask Sahayak**
- New chat, Jurisdiction selector, Input, Document upload, Saved/Temporary, Voice input, Suggestions, Chat creation, Backend integration, AI investigation, Evidence-first answer, Research Trail, Relevant areas, Voice response, Follow-up

**PHASE 4 — Formulation Workspace**
- Structured formulation input, Analysis, Formulation profile, Patent/TK/ABS cards, Prior art, Evidence, Follow-up, Human review

**PHASE 5 — My Chats**
- Clerk user-specific chats, Chat history, Chat restoration, Search/filter if required

**PHASE 6 — Analysis**
- Research history, Analysis summaries, Evidence activity

**PHASE 7 — Sources**
- Source library, Documents, Descriptions, Categories, External links, Filters/search

**PHASE 8 — Human Review**
- Review form, Chat context, Request submission, Request ID, Status, Success state

---

## IMPLEMENTATION RULE

When implementing any future phase:

- Read `requirements.md` first.
- Follow the existing design system.
- Reuse existing components.
- Reuse existing i18n.
- Do not create competing design systems.
- Do not hardcode user-facing strings.
- Do not change established routes without explicit instruction.
- Do not change application language behavior.
- Do not connect UI language to AI response language.
- Do not fabricate backend data.
- Do not add unrelated features.

If a future request conflicts with this document, the latest explicit user instruction takes priority.

---

## SUCCESS CRITERIA

The final application should feel like one coherent product. A user should be able to understand:

What Sahayak is → Ask an IP question → See how it investigates → See supporting evidence → Continue the conversation → Review previous research → Explore authoritative sources → Request human assistance

The product should demonstrate technical depth through clarity and transparency rather than visual complexity.
