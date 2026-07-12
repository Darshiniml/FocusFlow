const Timetable = () => {
  const schedule = [
    ['6 AM - Exercise', '8 AM - College', '7 PM - DSA Practice', '6 PM - Lecture', '8 AM - Revision', '', ''],
    ['', '10 AM - Group Study', '', '2 PM - Lab', '', '10 AM - Review', '11 AM - Catchup'],
    ['', '', '5 PM - Project Work', '', '6 PM - Mock Interview', '', ''],
  ]

  return (
    <div className="page timetable-page">
      <header className="page-header">
        <div>
          <h1>Weekly Timetable</h1>
          <p>Organize your week with scheduled time slots and smart task generation.</p>
        </div>
        <div className="header-actions">
          <button type="button" className="btn btn-secondary">Add Slot</button>
          <button type="button" className="btn btn-secondary">Auto Generate</button>
        </div>
      </header>

      <section className="panel timetable-panel">
        <div className="panel-header">
          <h2>Weekly Schedule</h2>
          <span className="muted">Tap any slot in the future to edit or add details.</span>
        </div>
        <div className="timetable-grid">
          <div className="timetable-header">Monday</div>
          <div className="timetable-header">Tuesday</div>
          <div className="timetable-header">Wednesday</div>
          <div className="timetable-header">Thursday</div>
          <div className="timetable-header">Friday</div>
          <div className="timetable-header">Saturday</div>
          <div className="timetable-header">Sunday</div>

          {schedule.map((row, rowIndex) => row.map((slot, index) => (
            <div key={`${rowIndex}-${index}`} className={slot ? 'timetable-cell filled' : 'timetable-cell empty'}>
              {slot || <span className="muted">Free</span>}
            </div>
          )))}
        </div>
      </section>

      <section className="panel timetable-features-panel">
        <div className="panel-header">
          <h2>Key Features</h2>
          <span className="muted">A lightweight view of timetable options.</span>
        </div>
        <ul className="feature-list">
          <li>Preview your week at a glance</li>
          <li>Quickly add or shift time blocks</li>
          <li>Connect slots to task generation</li>
          <li>Track focus sessions and study windows</li>
        </ul>
      </section>
    </div>
  )
}

export default Timetable;
