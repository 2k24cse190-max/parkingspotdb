import { useState, useEffect } from "react";

function SlotGrid({ onSlotSelect, slots = [] }) {

  const [selectedSlot, setSelectedSlot] = useState(null);

  // Clear selected slot if parking data changes
  useEffect(() => {
    setSelectedSlot(null);
  }, [slots]);

  const handleSlotClick = (slot) => {

    if (slot.status !== "available") {
      return;
    }

    setSelectedSlot(slot.code);

    if (onSlotSelect) {
      onSlotSelect(slot.code);
    }
  };

  return (
    <div className="slot-section">

      <div className="slot-legend">

        <div>
          <span className="legend-box available"></span>
          Available
        </div>

        <div>
          <span className="legend-box selected"></span>
          Selected
        </div>

        <div>
          <span className="legend-box occupied"></span>
          Occupied
        </div>

        <div>
          <span className="legend-box reserved"></span>
          Reserved
        </div>

      </div>

      <div className="parking-floor">

        <div className="floor-label">
          Ground Floor
        </div>

        <div className="slot-grid">

          {slots.map((slot) => (

            <button
              key={slot.code}
              className={`parking-slot ${slot.status} ${
                selectedSlot === slot.code
                  ? "selected"
                  : ""
              }`}
              onClick={() => handleSlotClick(slot)}
              disabled={slot.status !== "available"}
            >

              <span className="slot-number">
                {slot.code}
              </span>

              <span className="slot-car">
                🚗
              </span>

            </button>

          ))}

        </div>

      </div>

    </div>
  );
}

export default SlotGrid;