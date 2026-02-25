import React from 'react'

export function QuickReplies({ chips, onSelect, disabled }) {
  return (
    <div className="iago-widget-quick-replies">
      {chips.map((chip) => (
        <button
          key={chip}
          className="iago-widget-chip"
          onClick={() => onSelect(chip)}
          disabled={disabled}
        >
          {chip}
        </button>
      ))}
    </div>
  )
}
