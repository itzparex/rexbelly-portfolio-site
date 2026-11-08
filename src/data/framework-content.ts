export type FrameworkField = {
  key: string;
  label: string;
  placeholder: string;
  required?: boolean;
  optional?: boolean;
};

export type FrameworkTask = {
  id: string;
  title: string;
  mode: "build" | "read-only" | "research" | "draft";
  summary: string;
  fields: FrameworkField[];
  constraints: string;
  deliver: string;
  verify: string;
  example: Record<string, string>;
};

export type FrameworkStage = {
  title: string;
  do: string;
  ai: string;
  check: string;
  taskId?: string;
  anchorId?: string;
};

export type FrameworkWorkflow = {
  id: string;
  number: string;
  title: string;
  cardCopy: string;
  intro: string;
  stages: FrameworkStage[];
  tasks: FrameworkTask[];
  exampleTaskId: string;
  exampleDescription: string;
};

export const frameworkWorkflows: FrameworkWorkflow[] = [
  {
    id: "shopify",
    number: "01",
    title: "Shopify Builder",
    cardCopy: "Plan and build Shopify sections, product pages, and theme improvements.",
    intro: "From a scoped theme change to a preview-ready handoff, with merchant settings and storefront states checked along the way.",
    exampleTaskId: "shopify-section",
    exampleDescription: "A reusable product size-guide dialog, with theme-editor and mobile checks.",
    stages: [
      {
        title: "Brief & Scope",
        do: "Capture the store goal, theme, page or section, reference, constraints, and expected behavior. Produce a short acceptance checklist.",
        ai: "Turn your request into a clear scope, identify missing decisions, and draft testable acceptance criteria.",
        check: "Confirm which theme and templates are in scope.",
        taskId: "shopify-section",
      },
      {
        title: "Theme Audit",
        do: "Inspect the actual templates, sections, snippets, assets, settings, and relevant app behavior. Identify what can be reused.",
        ai: "Trace the relevant theme patterns and summarize dependencies before proposing a change.",
        check: "Account for existing products, templates, and merchant settings that rely on the code.",
        taskId: "shopify-audit",
      },
      {
        title: "Build & Configure",
        do: "Implement one change with the theme’s conventions. For reusable sections, include merchant-editable settings and clear defaults.",
        ai: "Draft or implement the selected change in small pieces, following existing patterns and explaining decisions.",
        check: "Check that the section can be added and edited through the normal Shopify theme editor.",
        taskId: "shopify-section",
      },
      {
        title: "Storefront QA",
        do: "Run the project’s existing checks and preview the changed feature on mobile and desktop. For product work, cover the relevant product states.",
        ai: "Build a focused check list and report which states were tested, failed, or could not be reached.",
        check: "Test applicable variants, media, availability, cart actions, keyboard use, and market-specific behavior.",
        taskId: "shopify-fix",
      },
      {
        title: "Release & Handoff",
        do: "Deliver the changed files, theme editor instructions, preview evidence, and recovery steps.",
        ai: "Prepare concise implementation notes and a staged release checklist.",
        check: "Review the preview theme before approving a live theme change.",
        taskId: "shopify-audit",
      },
    ],
    tasks: [
      {
        id: "shopify-section",
        title: "Build a Shopify section",
        mode: "build",
        summary: "Create a reusable theme section that fits the existing theme.",
        fields: [
          { key: "theme", label: "Theme and version", placeholder: "e.g. Dawn 15, custom theme" },
          { key: "placement", label: "Placement and purpose", placeholder: "e.g. Product template, size-guide dialog" },
          { key: "reference", label: "Reference or requirements", placeholder: "Describe the layout, content, and behavior", optional: true },
          { key: "controls", label: "Merchant controls", placeholder: "e.g. Heading, content, colors, button label", optional: true },
          { key: "mobile", label: "Mobile behavior", placeholder: "e.g. Full-width dialog with scrollable content", optional: true },
        ],
        constraints: "Inspect the existing theme and follow its conventions. Preserve unrelated behavior. Do not access or modify a live theme, customer data, checkout, or external services without explicit approval.",
        deliver: "For Plan mode, provide a scoped implementation plan and acceptance checklist. For Implement mode, make the smallest complete change, identify the exact files and install location, include section settings and defaults, and explain how to add and edit it in the theme editor.",
        verify: "Run available project checks. Explain how to preview the section on desktop and mobile, and verify keyboard behavior and the requested states. Report checks that could not run.",
        example: {
          theme: "The store’s current Shopify theme (inspect the project before naming its version)",
          placement: "Product template — add a reusable size-guide dialog",
          reference: "A text link near the size selector opens a dialog with a heading and supplied sizing content.",
          controls: "Merchant-editable link label, dialog heading, and rich-text guide content.",
          mobile: "Dialog fits the viewport, scrolls internally, and can be closed by keyboard.",
        },
      },
      {
        id: "shopify-product",
        title: "Improve a product page",
        mode: "build",
        summary: "Audit a product page, then plan or implement one prioritized improvement.",
        fields: [
          { key: "theme", label: "Theme and version", placeholder: "e.g. Dawn 15 or unknown" },
          { key: "product", label: "Product or template", placeholder: "Product name, URL, or template" },
          { key: "shopper", label: "Shopper problem and priority", placeholder: "What should become clearer or easier?" },
          { key: "preserve", label: "Features to preserve", placeholder: "e.g. Variant selection, subscription app", optional: true },
        ],
        constraints: "Use only confirmed product facts. Preserve existing functionality and theme conventions. Do not change checkout, customer data, pricing, or live content without approval.",
        deliver: "Provide a targeted audit and prioritized plan. In Implement mode, apply only the selected improvement and summarize changed files and decisions.",
        verify: "Check the relevant product states: variants, media, availability, cart action, keyboard use, and mobile layout. Report any state that was not tested.",
        example: {
          theme: "Current Shopify theme; inspect repository for version",
          product: "A product template with variant selection and a size guide",
          shopper: "Make choosing a size easier and reduce uncertainty before adding to cart.",
          preserve: "Existing variant behavior, product media, and cart integration.",
        },
      },
      {
        id: "shopify-fix",
        title: "Fix a theme issue",
        mode: "build",
        summary: "Reproduce a storefront issue, identify its cause, and make a focused fix.",
        fields: [
          { key: "page", label: "Page or template", placeholder: "e.g. Product page for a specific product" },
          { key: "steps", label: "Steps to reproduce", placeholder: "1. Open … 2. Select …" },
          { key: "expected", label: "Expected behavior", placeholder: "What should happen?" },
          { key: "scope", label: "Affected devices or markets", placeholder: "e.g. iPhone Safari, Canada market", optional: true },
        ],
        constraints: "Reproduce before changing code. Keep the fix narrow, preserve working theme behavior, and avoid live-store or external writes without approval.",
        deliver: "Explain the reproduction, root cause, smallest complete fix, changed files, and any assumptions.",
        verify: "Repeat the reported steps after the fix on the affected device or market when available. Run existing checks and report anything untested.",
        example: {
          page: "Product page with a size-guide link",
          steps: "On a narrow mobile viewport, open the size guide and try to reach its close control.",
          expected: "The guide remains within the viewport, scrolls if needed, and can be closed with keyboard or touch.",
          scope: "Mobile Safari and desktop keyboard navigation.",
        },
      },
      {
        id: "shopify-audit",
        title: "Audit a theme before launch",
        mode: "read-only",
        summary: "Review a preview theme and report reproducible launch risks without editing files.",
        fields: [
          { key: "preview", label: "Preview URL or project", placeholder: "A preview URL or local theme project" },
          { key: "templates", label: "Templates in scope", placeholder: "e.g. Home, collection, product, cart" },
          { key: "coverage", label: "Devices and markets", placeholder: "e.g. Mobile and desktop, US and Canada", optional: true },
        ],
        constraints: "Read-only audit. Do not edit files, publish a theme, submit forms, place orders, or access customer data.",
        deliver: "List findings by severity with steps to reproduce, affected template, release-blocker status, and a focused verification checklist.",
        verify: "Distinguish observed failures from untested states. State the preview and device coverage used.",
        example: {
          preview: "The launch preview theme URL",
          templates: "Home, product, collection, cart, and the navigation drawer",
          coverage: "Mobile and desktop; check the target selling markets if available.",
        },
      },
    ],
  },
  {
    id: "website",
    number: "02",
    title: "Website Builder",
    cardCopy: "Take a business website from brief and page structure to build and review.",
    intro: "A clear path from business goals and content to an accessible, responsive website with its key visitor actions tested.",
    exampleTaskId: "website-plan",
    exampleDescription: "A services landing page for a local flooring company, with a clear quote path.",
    stages: [
      {
        title: "Discovery",
        do: "Define who the website serves, what visitors need, and the primary action.",
        ai: "Organize the brief, surface unanswered questions, and turn the goal into criteria for a successful site.",
        check: "Agree on the audience, offer, and goal.",
        taskId: "website-plan",
      },
      {
        title: "Site Map & Content",
        do: "Map the pages and draft the purpose, sections, and call to action for each one.",
        ai: "Suggest a site map and content outline that helps visitors find the right information and act.",
        check: "Verify that visitors can find services, work, and contact information.",
        taskId: "website-plan",
      },
      {
        title: "Design & Interaction",
        do: "Plan layout, content hierarchy, responsive behavior, and interactions using the current brand system when available.",
        ai: "Translate the approved structure into page sections, responsive states, and interaction details.",
        check: "Review the key visitor paths on desktop and mobile.",
        taskId: "website-landing",
      },
      {
        title: "Build & Connect",
        do: "Implement in the project’s chosen stack. Connect navigation, forms, and CMS features in scope.",
        ai: "Inspect the project conventions, implement in small pieces, and identify any integration or content dependencies.",
        check: "Test the normal path and relevant empty, error, and success states.",
        taskId: "website-landing",
      },
      {
        title: "QA & Handoff",
        do: "Check responsiveness, accessibility, metadata, and links. Deliver preview and handoff notes.",
        ai: "Run focused checks and prepare a concise handoff with preview evidence.",
        check: "Verify the primary action end to end and review the preview before release.",
        taskId: "website-audit",
      },
    ],
    tasks: [
      {
        id: "website-plan",
        title: "Plan a business website",
        mode: "draft",
        summary: "Turn a business brief into a practical sitemap and page-by-page outline.",
        fields: [
          { key: "business", label: "Business and offer", placeholder: "What does the business provide?" },
          { key: "audience", label: "Audience and primary action", placeholder: "Who visits, and what should they do?" },
          { key: "pages", label: "Required pages", placeholder: "e.g. Home, Services, Projects, Contact" },
          { key: "content", label: "Content and assets", placeholder: "What copy, photos, or brand assets exist?", optional: true },
        ],
        constraints: "Keep recommendations grounded in supplied information. Mark assumptions and content gaps instead of inventing business facts.",
        deliver: "Provide a sitemap, page briefs, section outline for each page, primary call to action, and a content checklist.",
        verify: "Check that the sitemap supports the audience’s main task and makes the services, work, and contact path easy to find.",
        example: {
          business: "A local flooring company offering installation and material guidance.",
          audience: "Homeowners comparing flooring options; the primary action is to request a quote.",
          pages: "Home, Services, Projects, About, Contact.",
          content: "Existing project photos, service descriptions, and contact details.",
        },
      },
      {
        id: "website-landing",
        title: "Build a landing page",
        mode: "build",
        summary: "Plan or implement a responsive landing page around one audience and action.",
        fields: [
          { key: "goal", label: "Page goal and audience", placeholder: "Who is this for, and what action matters?" },
          { key: "reference", label: "Reference and platform", placeholder: "Design reference and project stack" },
          { key: "assets", label: "Available content and assets", placeholder: "Copy, images, brand system, or integrations", optional: true },
          { key: "action", label: "Primary action", placeholder: "e.g. Request a quote or book a call" },
        ],
        constraints: "Follow the existing project stack and design conventions. Preserve existing routes and integrations. Do not send forms or write to external services without approval.",
        deliver: "For Plan mode, provide page structure and interaction notes. For Implement mode, build the scoped page, summarize files changed, and explain the preview path.",
        verify: "Check responsive behavior, accessibility basics, links, and the primary action. Test relevant empty, error, and success states without sending real data.",
        example: {
          goal: "Create a services landing page for a local flooring company, aimed at homeowners comparing providers.",
          reference: "Use the existing project stack and brand. Inspect its components and routes before proposing changes.",
          assets: "Use supplied flooring project photos and confirmed service information.",
          action: "Request a quote.",
        },
      },
      {
        id: "website-improve",
        title: "Improve an existing page",
        mode: "build",
        summary: "Find the highest-value page improvements and scope a change without disturbing working paths.",
        fields: [
          { key: "route", label: "Page URL or route", placeholder: "e.g. /services" },
          { key: "issue", label: "Issue and desired outcome", placeholder: "What feels unclear or ineffective?" },
          { key: "preserve", label: "Elements to preserve", placeholder: "Existing design, content, or behavior", optional: true },
        ],
        constraints: "Inspect the current page and project first. Separate evidence from assumptions, and preserve existing visitor paths and brand conventions.",
        deliver: "Provide prioritized recommendations or, in Implement mode, a scoped change with a concise before-and-after summary.",
        verify: "Compare the affected visitor path before and after. Check mobile layout, accessibility, links, and the relevant action.",
        example: {
          route: "The current services page",
          issue: "Visitors should understand the main services and find the quote-request path more quickly.",
          preserve: "Current brand, useful service details, and working contact form.",
        },
      },
      {
        id: "website-audit",
        title: "Run a website audit",
        mode: "read-only",
        summary: "Review selected pages and report reproducible visitor-facing issues without editing.",
        fields: [
          { key: "site", label: "Site or preview", placeholder: "A URL or local project path" },
          { key: "pages", label: "Pages and visitor actions", placeholder: "What pages and key paths should be checked?" },
          { key: "devices", label: "Device coverage", placeholder: "e.g. Mobile and desktop", optional: true },
        ],
        constraints: "Read-only audit. Do not submit real forms, create accounts, place orders, or modify project files.",
        deliver: "Report reproducible findings on usability, responsive layout, accessibility, and broken flows with severity and recommended fixes.",
        verify: "Include steps, page and viewport, what was observed, and any checks that could not be run.",
        example: {
          site: "The local preview or staging URL",
          pages: "Home, Services, Projects, Contact; follow the quote-request path.",
          devices: "Mobile and desktop, including keyboard navigation.",
        },
      },
    ],
  },
  {
    id: "research",
    number: "03",
    title: "Product Research Strategy",
    cardCopy: "Research the customer, shape the offer, and turn the findings into direct-response copy.",
    intro: "Use one product as the thread from source-based customer research to an approved offer, proof map, and channel-specific copy.",
    exampleTaskId: "research-copy",
    exampleDescription: "Facebook ads for a gardening product, grounded in an approved offer and source log.",
    stages: [
      {
        title: "AI Customer Deep Dive Research",
        anchorId: "stage-ai-customer-deep-dive",
        do: "Gather approved customer material and relevant public sources. Organize language, motivations, objections, alternatives, and recurring questions.",
        ai: "Analyze supplied sources, capture exact customer language, and produce a source log and research summary.",
        check: "Each important observation has a source. Assumptions are labeled.",
        taskId: "research-deep-dive",
      },
      {
        title: "Marketer’s Booklet",
        anchorId: "stage-marketers-booklet",
        do: "Summarize the customer, buying triggers, alternatives, strongest objections, and promising angles in a working brief.",
        ai: "Turn the evidence into a concise marketer’s brief with unresolved questions.",
        check: "The brief reflects the evidence and includes unresolved questions.",
        taskId: "research-booklet",
      },
      {
        title: "Offer Builder",
        anchorId: "stage-offer-builder",
        do: "Define the offer, its lead benefit, differentiators, and the terms customers need to understand.",
        ai: "Explore offer framing using confirmed product details and highlight decisions that need owner approval.",
        check: "Confirm pricing, guarantees, terms, and product details with the owner.",
        taskId: "research-offer",
      },
      {
        title: "Proof and Belief Architecture",
        anchorId: "stage-proof-and-belief",
        do: "Map each buying objection or belief to the available evidence. Produce a claim-to-proof table and a list of proof to collect.",
        ai: "Connect each proposed claim to an approved source and surface evidence gaps.",
        check: "Reviews, results, and claims remain tied to actual sources.",
        taskId: "research-proof",
      },
      {
        title: "Conversion Strategy and Belief Sequence",
        anchorId: "stage-conversion-strategy",
        do: "Decide which message comes first, when to introduce proof, and where to ask for action. Adapt the sequence to the selected channel.",
        ai: "Plan or draft channel-specific messaging that follows the approved offer and proof.",
        check: "Every major message has a job, and the draft reflects the approved offer and evidence.",
        taskId: "research-copy",
      },
    ],
    tasks: [
      {
        id: "research-deep-dive",
        title: "Run customer research",
        mode: "research",
        summary: "Extract sourced customer language, themes, motivations, and open questions.",
        fields: [
          { key: "product", label: "Product and market", placeholder: "What is sold, and where?" },
          { key: "customer", label: "Target customer", placeholder: "Who is the product intended to help?" },
          { key: "sources", label: "Approved sources", placeholder: "Paste notes, reviews, interviews, or allowed source types" },
          { key: "questions", label: "Research questions", placeholder: "What should the research clarify?", optional: true },
        ],
        constraints: "Use only supplied or explicitly approved sources. Do not invent quotes or product facts. Separate sourced findings, interpretations, and hypotheses to test. If source access is missing, ask for the source or list a research question.",
        deliver: "Provide a source log, exact customer language with source references, themes, motivations, objections, alternatives, recurring questions, and open questions.",
        verify: "Attach a source to each important observation. Label assumptions and hypotheses, and flag high-impact claims without evidence.",
        example: {
          product: "A gardening product sold in the selected market.",
          customer: "Home gardeners who want to make routine garden work more comfortable.",
          sources: "Use only the supplied customer review and interview source log; request it if it is not attached.",
          questions: "What triggers purchase, what alternatives do customers consider, and what objections remain?",
        },
      },
      {
        id: "research-booklet",
        title: "Create the Marketer’s Booklet",
        mode: "draft",
        summary: "Synthesize research into a practical messaging brief.",
        fields: [
          { key: "research", label: "Research notes and sources", placeholder: "Paste the approved research summary and source log" },
          { key: "product", label: "Confirmed product details", placeholder: "Features, use, price, terms, and limits" },
          { key: "alternatives", label: "Known alternatives", placeholder: "Products or workarounds customers compare", optional: true },
        ],
        constraints: "Do not add unsupported facts or customer quotes. Label interpretation separately from sourced findings and list evidence gaps.",
        deliver: "Create a working brief covering audience, customer language, buying triggers, alternatives, objections, messaging angles, source notes, and evidence gaps.",
        verify: "Trace key statements to supplied research or product facts. Clearly mark unresolved questions.",
        example: {
          research: "The approved source log and findings from customer research for one gardening product.",
          product: "Confirmed product description, benefits, price, guarantee terms, and usage details.",
          alternatives: "Other tools and manual methods identified in the research.",
        },
      },
      {
        id: "research-offer",
        title: "Build the offer",
        mode: "draft",
        summary: "Develop offer framing and identify owner decisions before any claim is used.",
        fields: [
          { key: "booklet", label: "Marketer’s Booklet", placeholder: "Paste the approved brief" },
          { key: "product", label: "Confirmed product details", placeholder: "Features, price, terms, and constraints" },
          { key: "proof", label: "Available proof", placeholder: "Approved reviews, data, demonstrations", optional: true },
        ],
        constraints: "Do not invent pricing, guarantees, scarcity, results, or terms. Mark unconfirmed statements as decisions for the owner.",
        deliver: "Provide offer options, a recommended lead benefit with rationale, differentiators grounded in facts, and a list of owner approvals required.",
        verify: "Check every product detail and term against the supplied source. Flag each benefit that lacks supporting evidence.",
        example: {
          booklet: "The approved gardening-product Marketer’s Booklet.",
          product: "Confirmed product features, actual price, delivery details, and return terms.",
          proof: "Only customer reviews and product evidence provided by the owner.",
        },
      },
      {
        id: "research-proof",
        title: "Map proof and beliefs",
        mode: "draft",
        summary: "Connect customer objections to claims and evidence, without overstating proof.",
        fields: [
          { key: "claims", label: "Proposed claims and objections", placeholder: "List the claims and customer beliefs to address" },
          { key: "evidence", label: "Approved evidence", placeholder: "Paste sources, reviews, data, or demonstrations" },
          { key: "channel", label: "Intended channel", placeholder: "e.g. Product page, email, Facebook ad", optional: true },
        ],
        constraints: "Use only approved evidence. Never fabricate results, testimonials, or quotations. Keep hypotheses separate from established proof.",
        deliver: "Create a claim-to-proof table, evidence gaps, and a prioritized list of proof to collect.",
        verify: "Ensure every claim is tied to the exact supporting source and accurately reflects its limits.",
        example: {
          claims: "Claims and objections from the approved product brief for one gardening product.",
          evidence: "Approved review excerpts and product documentation supplied by the owner.",
          channel: "Facebook ads and the product page.",
        },
      },
      {
        id: "research-copy",
        title: "Plan or write direct-response copy",
        mode: "draft",
        summary: "Generate copy for the requested channel only, using an approved offer and source-backed proof.",
        fields: [
          { key: "offer", label: "Approved offer and product", placeholder: "Paste confirmed product and offer details" },
          { key: "research", label: "Research or source log", placeholder: "Customer language, findings, and source references" },
          { key: "proof", label: "Available proof", placeholder: "Evidence that may support the requested claims" },
          { key: "channel", label: "Requested channel", placeholder: "Choose one: product page, email, or Facebook ad" },
          { key: "action", label: "Desired action", placeholder: "e.g. View product, shop now, learn more", optional: true },
        ],
        constraints: "Generate only the requested channel. Use actual product facts, exact approved quotes, and confirmed offer terms. Distinguish sourced findings, interpretations, and hypotheses. Mark illustrative examples clearly and list high-impact claims with missing proof under evidence gaps.",
        deliver: "For a product page, provide section sequence and copy. For email, provide subject, preview text, body, and CTA. For a Facebook ad, provide hooks, primary text, headlines, and CTA options. Include proof references and evidence gaps.",
        verify: "Trace factual claims to the supplied evidence, confirm offer terms, and flag unsupported claims. Do not invent customer quotes or performance results.",
        example: {
          offer: "The approved offer and confirmed details for a gardening product.",
          research: "The supplied source log and research summary. Ask for these if missing.",
          proof: "The evidence approved by the product owner; do not assume reviews or results exist.",
          channel: "Facebook ad",
          action: "Learn more about the product.",
        },
      },
    ],
  },
];
