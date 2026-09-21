const EDITORIALS = [
  ["Ink still wet", "The hour is a small room. Leave something on the table before it closes."],
  ["A stoop, not a feed", "Public notes sit in daylight. Private ones stay in the drawer. That is the whole deal."],
  ["Hands, not dashboards", "This place is meant to feel like a shop that opens the shutters every sixty minutes."],
  ["Quiet traffic", "If the street is empty, write anyway. The next hour will read it."],
  ["Paper first", "Type like you are leaving a note under a cup. Short is honest."],
  ["The clock is the editor", "We do not ship features in a rush. We turn the page when the minute hand says so."],
  ["Borrowed light", "Someone else's public sentence can sit next to yours. That is the magazine."],
  ["No neon", "The room is warm on purpose. It should feel used, not generated."],
  ["Keep the handle", "A name on the masthead is enough. You do not need a brand kit."],
  ["One more chair", "If you marked it public, it belongs on the stoop. Come sit with it."],
  ["Hour as craft", "Sixty minutes is long enough to change the headline and short enough to stay awake."],
  ["The drawer", "Private drafts are not lesser. They are just not for the street yet."],
];

export function hourKey(date = new Date()) {
  const d = new Date(date);
  d.setMinutes(0, 0, 0);
  return d.toISOString();
}

export function copyForHour(date = new Date()) {
  const h = new Date(date).getUTCHours() + new Date(date).getUTCDate();
  return EDITORIALS[h % EDITORIALS.length];
}

export function nextHour(date = new Date()) {
  const d = new Date(date);
  d.setMinutes(60, 0, 0);
  return d;
}
