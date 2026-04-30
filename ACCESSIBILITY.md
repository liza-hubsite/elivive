# Accessibility Compliance Notes (ADA Title II Web Rule)

This site is being maintained to align with **WCAG 2.1 Level AA**, which is the technical standard referenced by the U.S. Department of Justice's April 2024 ADA Title II web rule update.

## Key Rule Dates (from DOJ fact sheet)

- Public entities with population **50,000 or more**: **April 26, 2027**
- Public entities with population **under 50,000** and **special district governments**: **April 26, 2028**

## What Was Implemented In This Repo

- Added skip links to bypass repeated navigation.
- Added clearer document structure and heading hierarchy (`h1`, `h2`, sections, main landmark).
- Added visible keyboard focus styles for links, buttons, and form fields.
- Improved link accessibility for icon-only social links with explicit accessible names.
- Improved form accessibility with required-field guidance and stronger label clarity.
- Corrected text encoding issues that could affect assistive technology output.
- Updated button color contrast to meet WCAG AA for normal-size text.

## Ongoing Verification Checklist

- Keyboard-only navigation works on all pages.
- Focus indicator is always visible.
- Text and controls meet contrast targets.
- Images and icon links have meaningful alternatives.
- Forms have associated labels and clear instructions.

## Source Guidance

- ADA DOJ Fact Sheet (Final Rule + compliance-date extension):
  - https://www.ada.gov/resources/2024-03-08-web-rule/
- WCAG 2.1 Recommendation:
  - https://www.w3.org/TR/WCAG21/
