let tooltip = null;
const CHINESE_REGEX = /[\u4E00-\u9FFF]/g;

function countChineseChars(text) {
  const matches = text.match(CHINESE_REGEX);
  return matches ? matches.length : 0;
}

function showTooltip(x, y, count) {
  if (!tooltip) {
    tooltip = document.createElement('div');
    tooltip.id = 'chinese-char-count-tooltip';
    document.body.appendChild(tooltip);
  }
  tooltip.textContent = `中文字數: ${count}`;
  tooltip.style.left = `${x}px`;
  tooltip.style.top = `${y}px`;
  tooltip.style.display = 'block';
}

function hideTooltip() {
  if (tooltip) {
    tooltip.style.display = 'none';
  }
}

document.addEventListener('mouseup', (event) => {
  const selectedText = window.getSelection().toString().trim();
  if (selectedText) {
    const chineseCharCount = countChineseChars(selectedText);
    if (chineseCharCount > 0) {
      const selection = window.getSelection();
      if (selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        const rect = range.getBoundingClientRect();
        // Position tooltip below the selection
        // Adjustments might be needed for better positioning across different sites
        showTooltip(rect.left + window.scrollX, rect.bottom + window.scrollY + 5, chineseCharCount);
      }
    } else {
      hideTooltip();
    }
  } else {
    hideTooltip();
  }
});

document.addEventListener('mousedown', (event) => {
  // Hide tooltip if clicking outside the selection and not on the tooltip itself
  if (tooltip && event.target !== tooltip && window.getSelection().toString().trim() === '') {
     // Check if the click is outside the current selection if one exists
    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        const rect = range.getBoundingClientRect();
        if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) {
            hideTooltip();
        }
    } else {
        hideTooltip();
    }
  } else if (tooltip && event.target !== tooltip && window.getSelection().toString().trim() === '') { // if no text is selected, hide
    hideTooltip();
  }
});

// Handle cases where selection is cleared by other means (e.g., Escape key)
document.addEventListener('selectionchange', () => {
  const selectedText = window.getSelection().toString().trim();
  if (!selectedText && tooltip && tooltip.style.display === 'block') {
    hideTooltip();
  }
});
