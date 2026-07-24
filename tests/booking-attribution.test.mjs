import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const html = readFileSync(join(root, "index.html"), "utf8");

test("uses the official TimeRex widget callback", () => {
  assert.match(html, /id="timerex_calendar"/);
  assert.match(html, /asset\.timerex\.net\/js\/embed\.js/);
  assert.match(html, /onFormOpen:function\(\)\{trackBookingOpen\('widget'\);\}/);
  assert.match(html, /onBookingComplete:function\(\)/);
});

test("records complete attribution without remapping booking clicks", () => {
  assert.doesNotMatch(html, /booking_click:'cta_click'/);
  assert.match(html, /track\('booking_complete',params\)/);
  assert.match(html, /product_key:qs\.get\('product_key'\)\|\|'digger-flow'/);
  assert.match(html, /template_id:qs\.get\('template_id'\)\|\|''/);
  assert.match(html, /is_test:qs\.get\('is_test'\)==='1'/);
  assert.match(html, /booking_event_id:bookingEventId\(\)/);
});

test("keeps attribution on the fallback URL", () => {
  assert.match(html, /var attributedBookUrl=BOOK_URL/);
  assert.match(html, /a\.href = attributedBookUrl/);
});
