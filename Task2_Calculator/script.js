// ─── State ───────────────────────────────────────────────────────────────────
let display        = "0";
let expression     = "";
let prevValue      = null;
let currentOp      = null;
let waitingForOp   = false;
let justCalculated = false;

// ─── DOM helpers ─────────────────────────────────────────────────────────────
const displayEl    = document.getElementById("display");
const expressionEl = document.getElementById("expression");

function updateUI() {
  displayEl.textContent    = display;
  expressionEl.textContent = expression || "0";

  const len = display.length;
  displayEl.style.fontSize =
    len > 14 ? "22px" :
    len > 10 ? "30px" :
    len > 7  ? "38px" : "48px";
}

// ─── Calculation ─────────────────────────────────────────────────────────────
function calculate(a, b, op) {
  switch (op) {
    case "+": return a + b;
    case "-": return a - b;
    case "×": return a * b;
    case "÷": return b === 0 ? "Error" : a / b;
    default:  return b;
  }
}

function formatNum(n) {
  if (n === "Error" || !isFinite(n)) return "Error";
  if (Number.isInteger(n) && Math.abs(n) < 1e15) return String(n);
  return parseFloat(n.toPrecision(12)).toString();
}

// ─── Actions ─────────────────────────────────────────────────────────────────
function inputDigit(d) {
  if (justCalculated) {
    display = d; expression = d; justCalculated = false;
  } else if (waitingForOp) {
    display = d; expression += d; waitingForOp = false;
  } else {
    display    = display === "0" ? d : display + d;
    expression = expression === "" || expression === "0" ? d : expression + d;
  }
  updateUI();
}

function inputDot() {
  if (justCalculated)      { display = "0."; expression = "0."; justCalculated = false; }
  else if (waitingForOp)   { display = "0."; expression += "0."; waitingForOp = false; }
  else if (!display.includes(".")) { display += "."; expression += "."; }
  updateUI();
}

function handleOperator(op) {
  const current = parseFloat(display);

  document.querySelectorAll(".btn-operator").forEach(b => b.classList.remove("active-op"));
  document.querySelectorAll(".btn-operator").forEach(b => {
    if (b.dataset.op === op) b.classList.add("active-op");
  });

  if (prevValue !== null && !waitingForOp) {
    const result = calculate(prevValue, current, currentOp);
    const rs = formatNum(result);
    display = rs; prevValue = parseFloat(rs);
    expression = rs + " " + op + " ";
  } else {
    prevValue  = current;
    expression = (justCalculated ? display : expression) + " " + op + " ";
  }

  currentOp = op; waitingForOp = true; justCalculated = false;
  updateUI();
}

function handleEquals() {
  if (prevValue === null || waitingForOp) return;
  const current = parseFloat(display);
  const result  = calculate(prevValue, current, currentOp);
  const rs      = formatNum(result);
  expression = expression + " = " + rs;
  display    = rs;
  prevValue  = null; currentOp = null; waitingForOp = false; justCalculated = true;
  document.querySelectorAll(".btn-operator").forEach(b => b.classList.remove("active-op"));
  updateUI();
}

function handleClear() {
  display = "0"; expression = "";
  prevValue = null; currentOp = null; waitingForOp = false; justCalculated = false;
  document.querySelectorAll(".btn-operator").forEach(b => b.classList.remove("active-op"));
  updateUI();
}

function handleCE() {
  display = "0";
  if (!waitingForOp) {
    const trimmed   = expression.trimEnd();
    const lastSpace = trimmed.lastIndexOf(" ");
    expression = lastSpace >= 0 ? expression.substring(0, lastSpace + 1) : "";
  }
  waitingForOp = false;
  updateUI();
}

function handleSign() {
  display = formatNum(parseFloat(display) * -1);
  updateUI();
}

function handlePercent() {
  const val = parseFloat(display) / 100;
  display   = formatNum(val);
  if (!waitingForOp) {
    const parts = expression.split(/([+\-×÷] )/);
    parts[parts.length - 1] = formatNum(val);
    expression = parts.join("");
  }
  updateUI();
}

function handleBackspace() {
  if (justCalculated) return;
  display = display.length > 1 ? display.slice(0, -1) : "0";
  updateUI();
}

// ─── Button clicks ────────────────────────────────────────────────────────────
document.querySelectorAll(".calc-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    const action = btn.dataset.action;
    if      (action === "digit")    inputDigit(btn.dataset.val);
    else if (action === "dot")      inputDot();
    else if (action === "operator") handleOperator(btn.dataset.op);
    else if (action === "equals")   handleEquals();
    else if (action === "clear")    handleClear();
    else if (action === "ce")       handleCE();
    else if (action === "sign")     handleSign();
    else if (action === "percent")  handlePercent();

    btn.classList.add("pressed");
    setTimeout(() => btn.classList.remove("pressed"), 120);
  });
});

// ─── Keyboard support ─────────────────────────────────────────────────────────
document.addEventListener("keydown", (e) => {
  if (e.key >= "0" && e.key <= "9") { inputDigit(e.key); flashBtn(`[data-val="${e.key}"]`); }
  else if (e.key === ".")        { inputDot();            flashBtn(`[data-action="dot"]`); }
  else if (e.key === "+")        { handleOperator("+");   flashBtn(`[data-op="+"]`); }
  else if (e.key === "-")        { handleOperator("-");   flashBtn(`[data-op="-"]`); }
  else if (e.key === "*")        { handleOperator("×");   flashBtn(`[data-op="×"]`); }
  else if (e.key === "/")        { e.preventDefault(); handleOperator("÷"); flashBtn(`[data-op="÷"]`); }
  else if (e.key === "Enter" || e.key === "=") { handleEquals();  flashBtn(`[data-action="equals"]`); }
  else if (e.key === "Escape")   { handleClear();         flashBtn(`[data-action="clear"]`); }
  else if (e.key === "Backspace"){ handleBackspace();     flashBtn(`[data-action="ce"]`); }
  else if (e.key === "%")        { handlePercent();       flashBtn(`[data-action="percent"]`); }
});

function flashBtn(selector) {
  const btn = document.querySelector(selector);
  if (!btn) return;
  btn.classList.add("pressed");
  setTimeout(() => btn.classList.remove("pressed"), 120);
}

// ─── Init ─────────────────────────────────────────────────────────────────────
updateUI();
