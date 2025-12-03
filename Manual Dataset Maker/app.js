// Simple in-browser JSONL builder for Rúna training examples.

(function () {
    const inputEl = document.getElementById("inputText");
    const outputEl = document.getElementById("outputText");
    const jsonlEl = document.getElementById("jsonlText");
  
    const addBtn = document.getElementById("addBtn");
    const clearCurrentBtn = document.getElementById("clearCurrentBtn");
    const copyBtn = document.getElementById("copyBtn");
    const downloadBtn = document.getElementById("downloadBtn");
    const clearAllBtn = document.getElementById("clearAllBtn");
    const statusText = document.getElementById("statusText");
  
    /** In-memory list of examples: { input: string, output: string } */
    let examples = [];
  
    function updateJsonlView() {
      const lines = examples.map((ex) => JSON.stringify(ex));
      jsonlEl.value = lines.join("\n");
      statusText.textContent = `${examples.length} example${examples.length === 1 ? "" : "s"}`;
    }
  
    function addExample() {
      const input = inputEl.value.trim();
      const output = outputEl.value.trim();
  
      if (!input || !output) {
        alert("Both Input and Output must be filled in before adding.");
        return;
      }
  
      const example = { input, output };
      examples.push(example);
  
      updateJsonlView();
  
      // Clear fields for the next pair and focus input
      inputEl.value = "";
      outputEl.value = "";
      inputEl.focus();
    }
  
    function clearCurrent() {
      inputEl.value = "";
      outputEl.value = "";
      inputEl.focus();
    }
  
    function clearAll() {
      if (examples.length === 0) {
        return;
      }
      if (!confirm("Clear ALL examples from this session? This cannot be undone.")) {
        return;
      }
      examples = [];
      updateJsonlView();
    }
  
    async function copyJsonl() {
      const text = jsonlEl.value;
      if (!text) {
        alert("No JSONL content to copy yet.");
        return;
      }
  
      if (navigator.clipboard && navigator.clipboard.writeText) {
        try {
          await navigator.clipboard.writeText(text);
          statusText.textContent = `Copied ${examples.length} example${examples.length === 1 ? "" : "s"} to clipboard`;
        } catch (err) {
          console.warn("Clipboard write failed, falling back to manual select:", err);
          jsonlEl.focus();
          jsonlEl.select();
        }
      } else {
        jsonlEl.focus();
        jsonlEl.select();
      }
    }
  
    function downloadJsonl() {
      const text = jsonlEl.value;
      if (!text) {
        alert("No JSONL content to download yet.");
        return;
      }
  
      const blob = new Blob([text], { type: "application/jsonl;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
  
      const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
      a.href = url;
      a.download = `runa_sft_manual_${timestamp}.jsonl`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  
    // Wire up events
    addBtn.addEventListener("click", addExample);
    clearCurrentBtn.addEventListener("click", clearCurrent);
    clearAllBtn.addEventListener("click", clearAll);
    copyBtn.addEventListener("click", copyJsonl);
    downloadBtn.addEventListener("click", downloadJsonl);
  
    // Allow Ctrl+Enter / Cmd+Enter in Output box to "Add to JSONL"
    outputEl.addEventListener("keydown", (evt) => {
      if ((evt.ctrlKey || evt.metaKey) && evt.key === "Enter") {
        evt.preventDefault();
        addExample();
      }
    });
  
    // Optional: auto-focus input when page loads
    window.addEventListener("load", () => {
      inputEl.focus();
      updateJsonlView();
    });
  })();
  