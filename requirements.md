Background
You're joining a team at a B2B enterprise SaaS company. The company captures call transcripts
from across the organization — customer support calls (customers reaching out with issues),
external calls (account managers speaking with customers about renewals, adoption, and
feedback), and internal calls (engineering syncs, cross-team escalations, planning discussions).
The team is building a product called Transcript Intelligence — a tool that helps different
stakeholders across the company make better decisions using these transcripts. Think support
leaders, sales managers, product managers, engineering leads — each would want something
different from this tool.
You'll receive approximately 100 sample transcripts across the three call types as your starting
dataset.
Your job is to explore the dataset, extract meaningful insights, and show us how you think.
What We'd Like You to Do
1. Build a pipeline that processes the transcripts and categorizes them by topic or
theme. Show us the categories you identified, explain why you chose your approach
(LLM-based, clustering, rule-based, hybrid — your call), and give examples of transcripts
that fall into each category. We want to see your reasoning, not just the output.
2. Generate a sentiment analysis across call types and identify trends. Don't just
produce charts — tell us what the trends mean. If something stands out, say what it
could indicate and why someone should care.
3. What else can you see? Beyond the two tasks above, we'd love to see what other
insights you think could be generated from this data. Think about the different
stakeholders who might use a tool like this — what would be valuable to them that isn't obvious at first glance? Document at least 2-3 additional insight ideas. You can
implement them or simply describe them with your reasoning for why they'd matter.

Implementation note for quality control:
- Theme assignments should be checked against title, summary, provided topics, and supporting quote evidence.
- A validation pass should flag low-confidence matches for human review and report pass-rate metrics instead of treating taxonomy labels as unquestioned truth.
- Call-type, theme, sentiment, and risk outputs should carry a low/medium/high confidence signal with the evidence or data coverage behind it; low-confidence assignments should be surfaced for review.
- Confidence labels are operational evidence indicators, not calibrated probabilities.
- Record data and analysis provenance, including source-file hashes, pipeline/code version, run timestamp, configured model and prompt version, and whether data augmentation was performed.
- This is especially important for demo or stakeholder review, where misclassified themes can mislead decision-makers.

Dashboard interaction requirements (implemented extension):
- Provide stakeholder presets and composable call-type, product-module, account, and date-range filters across the dashboard's aggregate insight views.
- Keep filter state in the URL so filtered views can be shared and meeting drill-down links retain their context.
- Recompute displayed aggregates from the matching meetings. Clearly label corpus-wide narratives or validation summaries that are not recomputed for the active filters.
- Provide an account-focused drill-in from risk views, including the matching call history, risk evidence, customer sentiment, and related themes/modules.
- Show sentiment trajectory counts and within-call-type percentages, updating both with active dashboard filters; explain that trajectory labels are heuristics rather than confirmed resolutions.
- Compare provided meeting-level sentiment labels with duration-weighted utterance polarity by direction, showing alignment rates and linked conflicts by call type. Treat this as a consistency check, not independent model validation or an accuracy metric.
- Label issue-graph nodes and edges clearly and show a persistent interpretation note that shared-theme links are associations, not proof of a shared incident, root cause, or causality.

How to Present Your Work
Submit three deliverables:

1. A notebook or code repository — this is your reference material. It should be
well-organized and readable so we can review your technical approach. Include
comments or markdown that explain your key decisions.

Show the pipeline running, walk through the outputs, and demo any insights or
visualizations you've built. A simple screen recording with narration is fine — no need for
professional production.
You'll have 30 minutes to present your slide deck to a panel, followed by 15 minutes of Q&A. During Q&A we may ask you to walk us through specific parts of your code, so be ready
to pull up your notebook.
A Few Ground Rules

You're welcome to use any tools including LLMs. We're evaluating your thinking,
judgment, and the quality of your insights — not whether you wrote every line from
scratch.
There's no prescribed tech stack. Use whatever you're comfortable with.
There's no strict time limit. We've scoped this so the required tasks are achievable in a
few hours. How much further you go is up to you.
Frequently Asked Questions
Can I modify or augment the sample dataset? Absolutely. The dataset is a starting point. If
you want to add synthetic data, restructure it, enrich it with additional fields, or generate more
transcripts to better demonstrate your approach — go for it. Just explain what you changed and
why.
What if the dataset doesn't have all three call types (support, external, internal)? The
sample dataset may not perfectly map to all three categories. You're welcome to relabel,
reclassify, or generate additional data to fit the scenario. How you handle this is part of what
we're evaluating.
Do I need to build a production-ready system? No. We're not expecting deployment-ready
code. We want to see your thinking, your approach, and the quality of your insights. Clean,
readable code matters more than over-engineering.
Can I use LLMs or AI tools? Yes — any and all tools are welcome. Copilot, ChatGPT, Claude,
open-source models, whatever helps you. We care about what you do with the output, not how
you got there.
Can I generate additional data? Yes. If you feel you need more transcripts to validate your
approach, demonstrate a pattern, or test at scale, you're welcome to generate synthetic data
using LLMs or any other method. Just be transparent about what's original and what you
generated, and explain why you needed more.
What language or framework should I use? Your choice. Python, R, TypeScript, Go —
whatever you're most productive in. Same for libraries, frameworks, and cloud services — AWS,
GCP, Azure, or any other platform. Use whatever tools help you do your best work.
How long should my slide deck be? However many slides you need to fill 30 minutes
effectively. Don't pad it — if you can tell the story in fewer slides, that's better than stretching to
fill time.
Should I focus more on the required tasks or the bonus insights? The required tasks are
your foundation — make sure those are solid. But the bonus insights are where you stand out. A
strong required section with two or three thoughtful bonus ideas beats a perfect required section
with nothing beyond it.
What if I have a great idea but don't have time to implement it? Write it up. Describe what
the insight is, why it matters, who would use it, and how you'd approach building it. A
well-articulated idea you didn't code is more valuable to us than a half-baked implementation.
Who will I be presenting to? A panel of product and engineering leaders. Pitch your findings to
that audience — they care about impact and decisions, not your import statements.
Can I ask clarifying questions before starting? Yes, reach out to the recruiter. But part of the
exercise is seeing how you handle ambiguity, so we may not answer everything.